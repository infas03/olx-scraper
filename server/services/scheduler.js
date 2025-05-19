import Listing from '../models/Listing.js';
import { hashString } from '../utils/helper.js';
import scrapeOLX from '../scraper/olxScraper.js';

const SCRAPE_INTERVAL_MINUTES = 10;
let scrapeInterval = null;
let isScraping = false;
let scrapeCount = 0;

async function runScrape() {
  if (isScraping) {
    console.warn('Scrape already in progress. Skipping...');
    return;
  }

  isScraping = true;
  scrapeCount++;
  const startTime = Date.now();

  try {
    console.log(`Starting OLX scrape #${scrapeCount}...`);
    
    await scrapeOLX(3, async (newListings) => {
      for (const listing of newListings) {
        const listingId = hashString(listing.link);
        const exists = await Listing.findOne({ where: { id: listingId } });
        
        if (!exists) {
          await Listing.create({
            id: listingId,
            ...listing,
            createdAt: new Date()
          });
        }
      }
    });

    console.log(`Scrape #${scrapeCount} complete.`);
  } catch (error) {
    console.error(`Scrape #${scrapeCount} failed:`, error);
  } finally {
    isScraping = false;
    console.log(`Scrape #${scrapeCount} took ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
  }
}

export function startScheduler() {
  if (scrapeInterval) {
    console.warn('Scheduler already running');
    return;
  }

  console.log(`Starting scheduler (${SCRAPE_INTERVAL_MINUTES} min interval)`);
  runScrape();
  
  scrapeInterval = setInterval(
    () => runScrape(),
    SCRAPE_INTERVAL_MINUTES * 60 * 1000
  );
}

export function stopScheduler() {
  if (scrapeInterval) {
    clearInterval(scrapeInterval);
    scrapeInterval = null;
    console.log('Scheduler stopped');
  }
}

export default {
  start: startScheduler,
  stop: stopScheduler
};
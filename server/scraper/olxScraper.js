import puppeteer from "puppeteer";

const scrapeOLX = async (pageLimit = 3) => {
    console.time('scrapeOLX');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();

        await Promise.all([
            page.setGeolocation({ latitude: 38.7223, longitude: -9.1393 }),
            page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"),
            page.setViewport({ width: 1366, height: 768 }),
            page.setRequestInterception(true)
        ]);

        page.on('request', (req) => {
            ['image', 'stylesheet', 'font'].includes(req.resourceType()) ? req.abort() : req.continue();
        });

        const allListings = [];
        const baseUrl = "https://www.olx.pt/coracaodejesus/?search%5Bdist%5D=15";

        for (let currentPage = 1; currentPage <= pageLimit; currentPage++) {
            const url = currentPage === 1 ? baseUrl : `${baseUrl}&page=${currentPage}`;
            
            console.log(`Scraping page ${currentPage}...`);
            await page.goto(url, { 
                waitUntil: "domcontentloaded", 
                timeout: 20000 
            });

            await page.waitForSelector('[data-cy="l-card"]', { timeout: 10000 });

            await page.evaluate(async () => {
                await new Promise(resolve => {
                    const scrollHeight = document.body.scrollHeight;
                    const scrollStep = Math.floor(scrollHeight / 5);
                    let scrolled = 0;
                    
                    const scroll = () => {
                        window.scrollBy(0, scrollStep);
                        scrolled += scrollStep;
                        scrolled >= scrollHeight ? resolve() : requestAnimationFrame(scroll);
                    };
                    
                    requestAnimationFrame(scroll);
                });
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            const pageListings = await page.evaluate(() => {
                const cleanUrl = (url) => url ? url.replace(/(\/image);.*/, '$1') : '';
                
                return Array.from(document.querySelectorAll('[data-cy="l-card"]')).map(el => {
                    const locationDate = (el.querySelector('[data-testid="location-date"]')?.textContent?.trim() || "N/A - N/A").split(" - ");
                    
                    return {
                        title: el.querySelector("h4, h6")?.textContent?.trim() || "N/A",
                        price: el.querySelector('[data-testid="ad-price"]')?.textContent?.replace(/Negociável|\s+/g, "").trim() || "N/A",
                        date: locationDate[1] || "N/A",
                        location: locationDate[0] || "N/A",
                        link: el.querySelector("a")?.href || "#",
                        image: cleanUrl(el.querySelector("img")?.src || "")
                    };
                });
            });

            allListings.push(...pageListings);
            console.log(`Page ${currentPage}: ${pageListings.length} listings`);
        }

        console.timeEnd('scrapeOLX');
        console.log(`Total: ${allListings.length} listings scraped`);

        return allListings;

    } finally {
        await browser.close();
    }
};

export default scrapeOLX;
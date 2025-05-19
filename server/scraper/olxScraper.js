import puppeteer from "puppeteer";

const scrapeOLX = async (pageLimit = 3, onPageScraped = null) => {
  console.time("scrapeOLX");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://www.olx.pt", ["geolocation"]);

    const page = await browser.newPage();

    await Promise.all([
      page.setGeolocation({ latitude: 38.7223, longitude: -9.1393 }),
      page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      ),
      page.setViewport({ width: 1366, height: 768 }),
      page.setRequestInterception(true),
    ]);

    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (resourceType === "stylesheet" || resourceType === "font") {
        req.abort();
      } else {
        req.continue();
      }
    });

    const allListings = [];
    const baseUrl = "https://www.olx.pt/coracaodejesus/?search%5Bdist%5D=15";

    for (let currentPage = 1; currentPage <= pageLimit; currentPage++) {
      const url =
        currentPage === 1 ? baseUrl : `${baseUrl}&page=${currentPage}`;

      console.log(`Scraping page ${currentPage}...`);
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      await page.waitForSelector('[data-cy="l-card"]', { timeout: 20000 });

      await autoScroll(page, 3, 100);

      await page.evaluate(async () => {
        const images = Array.from(
          document.querySelectorAll('[data-cy="l-card"] img')
        );
        await Promise.all(
          images.map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((res) => {
                  img.addEventListener("load", res, { once: true });
                  img.addEventListener("error", res, { once: true });
                })
          )
        );
      });

      const pageListings = await page.evaluate(() => {
        const getRealImageUrl = (imgElement) => {
          const possibleAttributes = [
            "data-src",
            "data-srcset",
            "data-lazy",
            "data-original",
            "src",
          ];

          for (const attr of possibleAttributes) {
            const value = imgElement?.getAttribute(attr);
            if (value && !value.includes("no_thumbnail")) {
              if (attr === "data-srcset") {
                return value.split(",")[0].trim().split(" ")[0];
              }
              return value;
            }
          }
          return "";
        };

        return Array.from(document.querySelectorAll('[data-cy="l-card"]')).map(
          (el) => {
            const locationDate = (
              el
                .querySelector('[data-testid="location-date"]')
                ?.textContent?.trim() || "N/A - N/A"
            ).split(" - ");
            const imgElement = el.querySelector("img");

            const imageUrl = imgElement ? getRealImageUrl(imgElement) : "";

            const cleanUrl = (url) =>
              url ? url.replace(/(\/image);?.*/, "$1;") : "";

            return {
              title: el.querySelector("h4")?.textContent?.trim() || "N/A",
              price:
                el
                  .querySelector('[data-testid="ad-price"]')
                  ?.textContent?.replace(/Negociável|\s+/g, "")
                  ?.trim()
                  .replace(/(\d)(?=(?!(\d|\.|,))\D)/, "$1 ") || "N/A",
              date: locationDate[1] || "N/A",
              location: locationDate[0] || "N/A",
              link: el.querySelector("a")?.href || "#",
              image: cleanUrl(imageUrl) || "N/A",
            };
          }
        );
      });

      const newListings = pageListings.filter(listing => 
        listing.title !== "N/A" && 
        listing.price !== "N/A" && 
        listing.date !== "N/A" &&
        !allListings.some(existing => existing.link === listing.link)
      );

      allListings.push(...newListings);
      
      if (onPageScraped) {
        await onPageScraped(newListings);
      }

      console.log(`Page ${currentPage}: ${newListings.length} listings`);
    }

    console.timeEnd("scrapeOLX");
    console.log(`Total: ${allListings.length} listings scraped`);

    return allListings;
  } finally {
    await browser.close();
  }
};

async function autoScroll(page, passes = 2, delay = 200) {
  for (let i = 0; i < passes; i++) {
    await page.evaluate(async (delay) => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 250;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            setTimeout(resolve, delay);
          }
        }, delay);
      });
    }, delay);
  }
}

export default scrapeOLX;

// import puppeteer from "puppeteer";

// const scrapeOLX = async (pageLimit = 3) => {
//     console.time('scrapeOLX');
//     const browser = await puppeteer.launch({
//         headless: "new",
//         args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     try {
//         const context = browser.defaultBrowserContext();
//         await context.overridePermissions('https://www.olx.pt', ['geolocation']);

//         const page = await browser.newPage();

//         await Promise.all([
//             page.setGeolocation({ latitude: 38.7223, longitude: -9.1393 }),
//             page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"),
//             page.setViewport({ width: 1366, height: 768 }),
//             page.setRequestInterception(true)
//         ]);

//         page.on('request', (req) => {
//             ['stylesheet', 'font'].includes(req.resourceType()) ? req.abort() : req.continue();
//         });

//         const allListings = [];
//         const baseUrl = "https://www.olx.pt/coracaodejesus/?search%5Bdist%5D=15";

//         for (let currentPage = 1; currentPage <= pageLimit; currentPage++) {
//             const url = currentPage === 1 ? baseUrl : `${baseUrl}&page=${currentPage}`;

//             console.log(`Scraping page ${currentPage}...`);
//             await page.goto(url, {
//                 waitUntil: "networkidle2",
//                 timeout: 30000
//             });

//             await page.waitForSelector('[data-cy="l-card"]', { timeout: 15000 });

//             await autoScroll(page);
//             await autoScroll(page);

//             await page.evaluate(async () => {
//                 const imgElements = Array.from(document.querySelectorAll('[data-cy="l-card"] img'));
//                 await Promise.all(imgElements.map(img => {
//                     if (img.complete) return;
//                     return new Promise((resolve) => {
//                         img.addEventListener('load', resolve);
//                         img.addEventListener('error', resolve);
//                     });
//                 }));
//             });

//             const pageListings = await page.evaluate(() => {
//                 const getRealImageUrl = (imgElement) => {
//                     const possibleAttributes = [
//                         'data-src',
//                         'data-srcset',
//                         'data-lazy',
//                         'data-original',
//                         'src'
//                     ];

//                     for (const attr of possibleAttributes) {
//                         const value = imgElement?.getAttribute(attr);
//                         if (value && !value.includes('no_thumbnail')) {
//                             if (attr === 'data-srcset') {
//                                 return value.split(',')[0].trim().split(' ')[0];
//                             }
//                             return value;
//                         }
//                     }
//                     return '';
//                 };

//                 return Array.from(document.querySelectorAll('[data-cy="l-card"]')).map(el => {
//                     const locationDate = (el.querySelector('[data-testid="location-date"]')?.textContent?.trim() || "N/A - N/A").split(" - ");
//                     const imgElement = el.querySelector("img");

//                     const imageUrl = imgElement ? getRealImageUrl(imgElement) : '';

//                     const cleanUrl = (url) => url ? url.replace(/(\/image);?.*/, '$1;') : '';

//                     return {
//                         title: el.querySelector("h4")?.textContent?.trim() || "N/A",
//                         price: el.querySelector('[data-testid="ad-price"]')?.textContent?.replace(/Negociável|\s+/g, "").trim() || "N/A",
//                         date: locationDate[1] || "N/A",
//                         location: locationDate[0] || "N/A",
//                         link: el.querySelector("a")?.href || "#",
//                         image: cleanUrl(imageUrl) || "N/A"
//                     };
//                 });
//             });

//             allListings.push(...pageListings);
//             console.log(`Page ${currentPage}: ${pageListings.length} listings`);
//         }

//         console.log('Final listings: ', allListings);
//         console.timeEnd('scrapeOLX');
//         console.log(`Total: ${allListings.length} listings scraped`);

//         return allListings;

//     } finally {
//         await browser.close();
//     }
// };

// async function autoScroll(page) {
//     await page.evaluate(async () => {
//         await new Promise((resolve) => {
//             let totalHeight = 0;
//             const distance = 200;
//             const timer = setInterval(() => {
//                 const scrollHeight = document.body.scrollHeight;
//                 window.scrollBy(0, distance);
//                 totalHeight += distance;

//                 if(totalHeight >= scrollHeight) {
//                     clearInterval(timer);
//                     setTimeout(resolve, 1000);
//                 }
//             }, 150);
//         });
//     });
// }

// export default scrapeOLX;

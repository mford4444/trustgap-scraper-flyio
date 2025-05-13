
import puppeteer from 'puppeteer';

export async function scrapeBrokerCheck(crdNumber) {
  const url = `https://brokercheck.finra.org/individual/summary/${crdNumber}`;
  console.log(`Launching browser for CRD ${crdNumber}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    pipe: true
  });

  const page = await browser.newPage();
  console.log(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  try {
    await page.waitForSelector('.individual-summary__section', { timeout: 10000 });

    const result = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el?.innerText?.trim() || null;
      };

      return {
        summary: getText('.individual-summary__bio') || 'No summary available',
        name: getText('.individual-summary__name'),
        currentFirm: getText('.individual-summary__firm-name'),
        registrations: Array.from(document.querySelectorAll('.registration__firm')).map(el => el.innerText.trim()),
      };
    });

    await browser.close();
    return { crdNumber, ...result };
  } catch (err) {
    await browser.close();
    throw new Error(`Scrape logic failed: ${err.message}`);
  }
}

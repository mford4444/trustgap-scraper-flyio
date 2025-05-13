
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

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => window.__REACT_QUERY_INITIAL_QUERIES__, { timeout: 10000 });

    const data = await page.evaluate(() => {
      const raw = window.__REACT_QUERY_INITIAL_QUERIES__;
      const obj = raw?.[0]?.state?.data;
      return {
        summary: obj?.bio || 'No summary available',
        disclosuresCount: obj?.disclosures?.length || 0,
        yearsOfExperience: obj?.yearsOfExperience || null,
        isPreviouslyRegistered: obj?.isPreviouslyRegistered || false,
        affiliations: obj?.registrations?.map(r => r.firm?.name).filter(Boolean) || []
      };
    });

    await browser.close();
    return { crdNumber, ...data };
  } catch (err) {
    await browser.close();
    throw new Error(`Puppeteer scrape failed: ${err.message}`);
  }
}

import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

import { parseEventbriteDate } from "../utils/parseEventbriteDate";
import { extractVenue } from "../utils/extractVenue";
import { extractRawDate } from "../utils/extractRawDate";
import { extractOrganizer } from "../utils/extractOrganizer";

export async function scrapeEventBriteEvents() {
  const url =
    "https://www.eventbrite.com.au/d/australia--sydney/all-events/";

  console.log("✅ Starting Eventbrite Scraper...");

  // ✅ Launch browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // ✅ Load first page


  let allEvents: any[] = [];

  // ✅ Scrape multiple pages (enough for assignment demo)
  const MAX_PAGES = 5;

  for (let currentPage = 1; currentPage <= MAX_PAGES; currentPage++) {
    const pageUrl = `${url}?page=${currentPage}`;

    console.log(`📄 Scraping Page ${currentPage}...`);
    await page.goto(pageUrl, { waitUntil: "networkidle2" });
    await page.waitForFunction(() => document.body.innerText.includes("$"));

    const html = await page.content();
    const $ = cheerio.load(html);

    // ✅ Loop through event cards
    $(".event-card").each((_, el) => {
      const title = $(el).find("h3").text().trim();
      const sourceUrl = $(el).find("a.event-card-link").attr("href");

      if (!title || !sourceUrl) return;

      // ✅ Image
      const imageUrl = $(el).find("img.event-card-image").attr("src");

      // ✅ Category → always array
      const categoryAttr = $(el)
        .find("a.event-card-link")
        .attr("data-event-category");

      const category = categoryAttr ? [categoryAttr] : [];

      // ✅ Extract card text for regex price
      const cardText = $(el).text();

      // ✅ Price extraction
      const priceMatch =
        cardText.match(/From\s+\$[0-9]+(\.[0-9]{2})?/)?.[0] ||
        cardText.match(/\$[0-9]+(\.[0-9]{2})?/)?.[0] ||
        (cardText.toLowerCase().includes("free") ? "Free" : null);

      const price = priceMatch ? priceMatch.replace("From ", "") : null;

      // ✅ Paragraph lines for date/venue/organizer
      const allLines = $(el)
        .find("p")
        .map((_, p) => $(p).text().trim())
        .get();

      // ✅ Organizer
      const organizer = extractOrganizer(allLines);

      // ✅ Date extraction
      const rawDate = extractRawDate(allLines);

      // ✅ Parsed datetime
      const dateTime = rawDate ? parseEventbriteDate(rawDate) : null;

      // ✅ Venue + Address
      const { venueName, address } = extractVenue(allLines);

      // ✅ Push event
      allEvents.push({
        title,
        dateTime,
        venueName,
        address,
        imageUrl,
        category,
        price,
        organizer,
        city: "Sydney",
        sourceName: "Eventbrite",
        sourceUrl,
      });
    });

    console.log(`✅ Total events collected: ${allEvents.length}`);

    // ✅ Pagination: Next page button
    
  }

  // ✅ Remove duplicates by URL
  allEvents = Array.from(
    new Map(allEvents.map((e) => [e.sourceUrl, e])).values()
  );

  await browser.close();

  console.log("✅ Eventbrite scraper finished.");
  console.log("✅ Total unique events scraped:", allEvents.length);

  return allEvents;
}

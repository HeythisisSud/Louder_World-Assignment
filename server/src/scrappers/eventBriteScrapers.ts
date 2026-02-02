import puppeteer from "puppeteer";
import * as cheerio from "cheerio"; 

export async function scrapeEventBriteEvents(){
    const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";
    const browser= await puppeteer.launch({ headless: false})
    const page= await browser.newPage();
    await page.goto(url, {waitUntil: "networkidle2"});

    const content = await page.content();

    const $= cheerio.load(content)

    const events: any[] = [];

    $(".event-card").each((_, el) => {
    // ✅ Title
    const title = $(el).find("h3").text().trim();

    // ✅ Event link
    const sourceUrl = $(el).find("a.event-card-link").attr("href");

    // ✅ Image URL
    const imageUrl = $(el).find("img.event-card-image").attr("src");

    // ✅ Date/time text
    const dateText = $(el)
      .find("p.Typography_body-md-bold__487rx")
      .first()
      .text()
      .trim();

    // ✅ Venue name (next <p> after date)
    const venueName = $(el)
      .find("p.Typography_body-md__487rx")
      .first()
      .text()
      .trim();

    // ✅ Category (from attribute)
    const category = $(el)
      .find("a.event-card-link")
      .attr("data-event-category");

    // ✅ Organizer name (last bold text)
    const organizer = $(el)
      .find("p.Typography_body-md-bold__487rx")
      .last()
      .text()
      .trim();

    // ✅ Only store valid events
    if (title && sourceUrl) {
      events.push({
        title,
        dateText,
        venueName,
        imageUrl,
        category,
        organizer,

        city: "Sydney",
        sourceName: "Eventbrite",
        sourceUrl,
        lastScrapedAt: new Date()
      });
    }
  });
    await browser.close();
      console.log("Scraped:", events.length, "events");

    return events;



}

scrapeEventBriteEvents()
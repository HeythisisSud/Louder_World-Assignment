import { scrapeEventBriteEvents } from "./eventBriteScrapers";
import { syncEventsToDB } from "../utils/syncEvents";

export async function runScrapers() {

    console.log("Starting scrapers...");

    const eventBriteEvents = await scrapeEventBriteEvents();

    await syncEventsToDB(eventBriteEvents);
    console.log("All scrapers finished.");
}
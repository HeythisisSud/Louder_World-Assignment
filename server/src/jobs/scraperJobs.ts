import cron from "node-cron";
import { runScrapers } from "../scrappers/runScrapers";


export function scheduleScraperJobs() {

    console.log("Scheduling scraper jobs...");


    cron.schedule("0 * * * *", async()=>{
        console.log("Running scheduled scraper job...");

        try{
            await runScrapers();
            console.log("Scheduled scraping completed.");
        }catch(error){
            console.error("Error during scheduled scraping:", error);
        }
    })
}
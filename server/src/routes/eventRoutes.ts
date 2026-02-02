import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { EventInput } from "../types/interfaces";
import { runScrapers } from "../scrappers/runScrapers";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * ✅ GET Events (Paginated)
 * Example:
 * /api/events?page=1&limit=20
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // ✅ Pagination params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const skip = (page - 1) * limit;

    // ✅ Total count
    const total = await prisma.event.count();

    // ✅ Fetch paginated events
    const events = await prisma.event.findMany({
      skip,
      take: limit,
      orderBy: {
        lastScrapedAt: "desc",
      },
    });

    // ✅ Return paginated response
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * ✅ POST Create Event (Manual insert test)
 */
router.post("/", async (req: Request<{}, {}, EventInput>, res: Response) => {
  try {
    const event = await prisma.event.create({
      data: req.body,
    });

    res.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * ✅ POST Trigger Scraper Manually
 * /api/events/scrape
 */
router.post("/scrape", async (req: Request, res: Response) => {
  try {
    console.log("Manual scraping triggered...");

    await runScrapers();

    res.json({ message: "Scraping completed ✅" });
  } catch (error) {
    console.error("Error during manual scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

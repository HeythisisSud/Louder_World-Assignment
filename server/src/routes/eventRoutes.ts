import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { EventInput } from "../types/interfaces";
import { runScrapers } from "../scrappers/runScrapers";
import redis, { connectRedis } from '../cache/redisClient'
const prisma = new PrismaClient();
const router = express.Router();

/**
 * ✅ GET Events (Paginated)
 * Example:
 * /api/events?page=1&limit=20
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    await connectRedis()
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const cacheKey=`events:page=${page}:limit=${limit}`

    const cached= await redis.get(cacheKey)


    if(cached){
      console.log("redis cache hit", cacheKey)
      return res.json(JSON.parse(cached))
    }

    console.log("redis cache miss",cacheKey)

    // ✅ Total count
    const totalEvents = await prisma.event.count();

    // ✅ Fetch paginated events
    const events = await prisma.event.findMany({
      skip,
      take: limit,
      orderBy: {
        dateTime: "asc",
      },
    });

     const response = {
      events,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
      totalEvents,
    };

    // ✅ 3. Save to Redis (TTL = 5 min)
    await redis.set(cacheKey, JSON.stringify(response), {
      EX: 60 * 5,
    });

    res.json(response);

  } catch (error) {
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

    const keys = await redis.keys("events:page=*");
    // ✅ Clear all cached event pages
    
    if (keys.length > 0) {
      
      await redis.del(keys);
    }
    console.log(" Redis cache cleared after scraping");
    res.json({ message: "Scraping completed ✅" });
  } catch (error) {
    console.error("Error during manual scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

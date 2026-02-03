import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { TicketQuery } from "../types/interfaces";

const router = express.Router();
const prisma = new PrismaClient();



router.post("/click", async (req: Request<{},{},TicketQuery,{}>, res: Response) => {

    try{
         const { eventId,email,consent}= req.body;

    if (!eventId || !email || consent !== true) {
        return res.status(400).json({ message: "Missing or invalid parameters." });
    }

    const ticketData = await prisma.ticketClick.create({
        data:{
            eventId:eventId as string,
            email: email as string,
            consent: Boolean(consent)
        }
    })
     res.json({
      message: "Ticket click saved ✅",
      data: ticketData,
    });

    } catch (error) {
        res.status(500).json({ message: "Internal server error." });

    }

   
})

export default router;
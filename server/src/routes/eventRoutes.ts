import { Request,Response } from "express";
import express from "express";
import { EventInput } from "../types/interfaces";
import { runScrapers } from "../scrappers/runScrapers";



import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



const router= express.Router();



router.get("/", async (req:Request,res:Response)=>{
    try{
        const events= await prisma.event.findMany({
            orderBy:{
                lastScrapedAt:"desc"
            }
            
        })
        res.json(events)
    } catch(error){
        res.status(500).json({error:"Internal Server Error"})

    }
})


router.post("/",async(req:Request<{},{}, EventInput>,res:Response)=>{
    try{
        const event= await prisma.event.create({
            data:req.body
        })
        
        res.json(event)

    } catch(error){
        res.status(500).json({error:"Internal Server Error"})   
    }})

router.post("/scrape",async(req:Request,res:Response)=>{
    try{
        await  runScrapers();
        res.json({message:"Scraping completed"})
    } catch(error){
        res.status(500).json({error:"Internal Server Error"})   
    }
})
export default router;
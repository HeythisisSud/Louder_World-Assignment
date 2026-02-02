import { PrismaClient } from "@prisma/client";
import { last } from "cheerio/dist/commonjs/api/traversing";

const prisma = new PrismaClient();


export async function syncEventsToDB(scrapedEvents: any[]) {
    console.log("Syncing events to DB...");

    const existingEvents=await prisma.event.findMany();

    for(const ev of scrapedEvents){
        const found = await prisma.event.findUnique({
            where:{ sourceUrl:ev.sourceUrl}
        })
        if(!found){
            await prisma.event.create({
                data:{
                    ...ev,
                    status:"new",
                    lastScrapedAt:new Date()
                }
            })
            continue;
        }
        if(found.title!=ev.title){
            await prisma.event.update({
                where:{id:found.id},
                data:{
                    title:ev.title,
                    status:"updated",
                    lastScrapedAt:new Date()
                }
            })
        }

    }
    for(const dbEvent of existingEvents){
        const stillExists = scrapedEvents.find(
            (e) => e.sourceUrl === dbEvent.sourceUrl
        );
        if(!stillExists && dbEvent.status !=="inactive"){
            await prisma.event.update({
                where:{id:dbEvent.id},
                data:{
                    status:"inactive",
                }
            })

        }
        
    }

    console.log("Sync complete.");


}
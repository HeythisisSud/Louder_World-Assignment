import express,  {Application} from "express";
import { Request, Response } from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes";
import { scheduleScraperJobs } from "./jobs/scraperJobs";
import ticketRoutes from "./routes/ticketClick";


const app:Application= express();

const PORT= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/", (req:Request,res:Response)=>{
    res.send("API is running")
});

app.use("/api/tickets", ticketRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);

    scheduleScraperJobs();
})

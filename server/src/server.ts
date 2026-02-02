import express,  {Application} from "express";
import { Request, Response } from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes";


const app:Application= express();

const PORT= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/", (req:Request,res:Response)=>{
    res.send("API is running")
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

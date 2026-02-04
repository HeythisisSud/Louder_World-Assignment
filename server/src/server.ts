import express,  {Application} from "express";
import { Request, Response } from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes";
import { scheduleScraperJobs } from "./jobs/scraperJobs";
import ticketRoutes from "./routes/ticketClick";
import session from "express-session";
import passport from "passport";
import "./auth/googleStrategy"; // ✅ load strategy
import authRoutes from "./routes/authRoutes";


const app:Application= express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.set("trust proxy", 1)
app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);



app.use(passport.initialize());
app.use(passport.session());


const PORT= process.env.PORT || 5000;


app.use("/api/events", eventRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/auth", authRoutes);

app.get("/", (req:Request,res:Response)=>{
    res.send("API is running")
});
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);

    scheduleScraperJobs();
})

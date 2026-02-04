import express, { Application } from "express";
import { Request, Response } from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes";
import { scheduleScraperJobs } from "./jobs/scraperJobs";
import ticketRoutes from "./routes/ticketClick";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import "./auth/googleStrategy"; // ✅ load strategy
import authRoutes from "./routes/authRoutes";

const app: Application = express();
app.set("trust proxy", 1);
app.use(express.json());

const allowedOrigins = [process.env.FRONTEND_URL].filter(
  (origin): origin is string => Boolean(origin)
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

const PgSessionStore = connectPgSimple(session);
const sessionStore =
  process.env.NODE_ENV === "production" && process.env.DATABASE_URL
    ? new PgSessionStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      })
    : undefined;

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: "/",
    },
  })
);



app.use(passport.initialize());
app.use(passport.session());


const PORT = process.env.PORT || 5000;


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

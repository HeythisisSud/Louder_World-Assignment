import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();

/**
 * ✅ Start Google OAuth
 */
router.get("/google", (req, res, next) => {
  console.log("✅ Google OAuth route hit!");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));


/**
 * ✅ Callback after Google login
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req: Request, res: Response) => {
    // ✅ Redirect back to frontend dashboard
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

/**
 * ✅ Get current logged-in user
 */
router.get("/me", (req: Request, res: Response) => {
  console.log("COOKIE HEADER:", req.headers.cookie);
  console.log("REQ.USER:", req.user);

  if (!req.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json(req.user);
});


/**
 * ✅ Logout
 */
router.post("/logout", (req: any, res) => {
  req.logout(() => {
    res.json({ message: "Logged out ✅" });
  });
});


export default router;

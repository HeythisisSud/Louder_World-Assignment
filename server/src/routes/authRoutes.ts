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
router.get("/google/callback", (req: Request, res: Response, next) => {
  res.on("finish", () => {
    console.log("SESSION ID:", req.sessionID);
    console.log("SET-COOKIE:", res.getHeader("set-cookie"));
  });

  passport.authenticate("google", (err: unknown, user: Express.User) => {
    if (err || !user) {
      console.log("error below")
      console.log(err)
      return res.redirect("/");
      
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      req.session.save(() => {
        // ✅ Redirect back to frontend dashboard
        res.redirect(`${process.env.FRONTEND_URL}/events`);
      });
    });
  })(req, res, next);
});
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

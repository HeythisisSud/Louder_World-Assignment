import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email returned from Google"), undefined);
        }

        // ✅ Find user
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        // ✅ Create if not found
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId,
              email,
              name,
              avatarUrl,
            },
          });
        }

        // ✅ MOST IMPORTANT LINE
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

/* ✅ Store user.id in session */
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

/* ✅ Load user from DB on each request */
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

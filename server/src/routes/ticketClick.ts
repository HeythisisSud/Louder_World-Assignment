import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateOtp } from "../utils/generateOtp";
import { sendOtpEmail } from "../utils/sendOtpEmails";

const router = express.Router();
const prisma = new PrismaClient();


router.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { email, eventId } = req.body;

    if (!email || !eventId) {
      return res.status(400).json({ message: "Missing email or eventId" });
    }

    const otp = generateOtp();

    await prisma.otpVerification.create({
      data: {
        email,
        eventId,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});


router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, eventId, otp } = req.body;

    const record = await prisma.otpVerification.findFirst({
      where: {
        email,
        eventId,
        otp,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Save ticket click only after verification
    await prisma.ticketClick.create({
      data: {
        email,
        eventId,
        consent: true,
      },
    });

    // Delete OTP after success
    await prisma.otpVerification.delete({
      where: { id: record.id },
    });

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

export default router;

import { Resend } from "resend";


export async function sendOtpEmail(email: string, otp: string) {
  const resend = new Resend(process.env.API_RESEND);
  await resend.emails.send({
  "from": "ThisIsSud <noreply@thisissud.space>",
  to: email,
  subject: "Your OTP",
  text: `Your OTP is ${otp}`,
});
}

"use client";

import { useState } from "react";

interface Props {
  eventId: string;
  eventUrl: string;
  onClose: () => void;
}

export default function TicketModal({
  eventId,
  eventUrl,
  onClose,
}: Props) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);

  /* ================= SEND OTP ================= */
  async function handleSendOtp() {
    if (!email) return alert("Please enter your email");

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/tickets/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, eventId }),
        }
      );

      if (!res.ok) {
        alert("Failed to send OTP");
        return;
      }

      setStep("otp");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* ================= VERIFY OTP ================= */
  async function handleVerifyOtp() {
    if (!otp) return alert("Please enter OTP");

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/tickets/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, eventId, otp }),
        }
      );

      if (!res.ok) {
        alert("Invalid or expired OTP");
        return;
      }

      // ✅ Redirect only after OTP verified
      window.location.href = eventUrl;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow-xl p-6 text-white">

        <h2 className="text-xl font-semibold mb-2">
          {step === "email" ? "Get Tickets 🎟️" : "Verify OTP 🔐"}
        </h2>

        <p className="text-sm text-gray-300 mb-6">
          {step === "email"
            ? "Enter your email to receive a verification code."
            : "Enter the 6-digit code sent to your email."}
        </p>

        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/20 text-white outline-none mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </>
        )}

       
        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/20 text-white outline-none mb-6 text-center tracking-widest"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep("email")}
                className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                Back
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

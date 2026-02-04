"use client";

import { useState } from "react";

interface Props {
  eventId: string;
  eventUrl: string;
  onClose: () => void;
}

export default function TicketModal({ eventId, eventUrl, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email) return alert("Please enter your email");

    setLoading(true);
    console.log(consent)

    // ✅ Save click to backend
    try{
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/click`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            email,
            consent,
          }),
        });
    
        setLoading(false);
    
        // ✅ Redirect to Eventbrite
        window.location.href = eventUrl;

    } catch(error){
        console.log(error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* ✅ Modal Box */}
      <div className="w-full max-w-md rounded-3xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">
          Get Tickets 🎟️
        </h2>

        <p className="text-sm text-gray-300 mb-6">
          Enter your email to continue to the ticket provider.
        </p>

        {/* ✅ Email Input */}
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/20 text-white outline-none mb-4"
        />

        {/* ✅ Consent Checkbox */}
        <label className="flex items-center gap-2 text-sm text-gray-300 mb-6">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="accent-blue-400"
          />
          I agree to receive updates about events (optional)
        </label>

        {/* ✅ Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  function handleGoogleLogin() {
    setLoading(true);

    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;  
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      
      <div className="relative w-full max-w-md rounded-3xl p-10 
        bg-white/10 backdrop-blur-2xl border border-white/20
        shadow-[0_0_40px_rgba(255,255,255,0.08)]
        hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]
        transition duration-300">

        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full 
          bg-blue-500/30 blur-3xl"></div>

        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full 
          bg-purple-500/30 blur-3xl"></div>

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Hey there! 👋
        </h1>

        <p className="text-gray-300 text-center mb-8 text-sm">
          Sign in with Google to access your dashboard
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3
            py-3 rounded-2xl font-semibold text-black
            bg-white hover:bg-gray-100
            active:scale-95 transition duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="text-2xl" />

          {loading ? "Redirecting..." : "Continue with Google"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-8">
          Only authorized users can access the dashboard.
        </p>
      </div>
    </div>
  );
}

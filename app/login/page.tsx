"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#6366f1]/30">
      {/* Soft background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6366f1]/10 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-[440px] text-center">
        {/* Simple Logo */}
        <div className="mb-12">
          <span className="text-[20px] font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-syne)" }}>
            one<span className="text-[#818cf8]">link</span>
          </span>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-white leading-tight tracking-tight mb-4" style={{ fontFamily: "var(--font-syne)" }}>
            Your entire world,<br />in one simple link.
          </h1>
          <p className="text-[15px] text-white/40 leading-relaxed max-w-[320px] mx-auto" style={{ fontFamily: "var(--font-dm-mono)" }}>
            The cleanest way to share your portfolio, socials, and projects with the world.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111111]/50 backdrop-blur-xl border border-white/[0.05] rounded-[2.5rem] p-10 shadow-2xl">
          <h2 className="text-[18px] font-bold text-white mb-8" style={{ fontFamily: "var(--font-syne)" }}>
            Welcome back
          </h2>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 rounded-2xl bg-white text-black text-[15px] font-bold hover:bg-zinc-100 transition-all active:scale-[0.98] cursor-pointer shadow-xl"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="mt-8 text-[12px] text-white/20 leading-relaxed px-4" style={{ fontFamily: "var(--font-dm-mono)" }}>
            By continuing, you agree to our <span className="text-white/40 hover:text-white transition-colors cursor-pointer">Terms of Service</span>.
          </p>
        </div>

        {/* Minimal Footer */}
        <div className="mt-12 text-[11px] text-white/10 uppercase tracking-[2px] font-mono" style={{ fontFamily: "var(--font-dm-mono)" }}>
          Built for creators
        </div>
      </div>
    </div>
  );
}

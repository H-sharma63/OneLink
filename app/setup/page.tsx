"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SetupPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.username) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      setError(null);
      return;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
      setError("Only letters, numbers, and hyphens allowed");
      setIsAvailable(null);
      return;
    }

    setError(null);
    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/user/setup?username=${username}`);
        const data = await res.json();
        setIsAvailable(data.available);
        if (!data.available) {
          setError("Username already taken");
        }
      } catch (err) {
        console.error("Failed to check username availability", err);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable || isChecking || username.length < 3) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        await update();
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to set username");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-[400px]">
        {/* Simple Header */}
        <div className="mb-12 text-center">
          <h1 className="text-[32px] font-extrabold text-white tracking-tight mb-3" style={{ fontFamily: "var(--font-syne)" }}>
            Claim your link
          </h1>
          <p className="text-[15px] text-white/30 leading-relaxed" style={{ fontFamily: "var(--font-dm-mono)" }}>
            Choose a unique handle for your Onelink profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 text-[20px] font-medium pl-2">
                getonelink.vercel.app/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="username"
                className="w-full bg-transparent border-b-2 border-white/10 py-4 pl-[125px] pr-2 text-white text-[20px] font-medium focus:outline-none focus:border-[#6366f1] transition-all placeholder:opacity-10"
                style={{ fontFamily: "var(--font-dm-mono)" }}
                maxLength={20}
                autoFocus
              />
            </div>

            <div className="h-6">
              {isChecking && (
                <p className="text-[12px] text-white/20">Checking availability...</p>
              )}
              {error && (
                <p className="text-[12px] text-pink-500/80">{error}</p>
              )}
              {!isChecking && isAvailable && (
                <p className="text-[12px] text-emerald-500/80">Username is available</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isAvailable || isSubmitting || username.length < 3}
            className="w-full py-5 rounded-2xl bg-white text-black font-extrabold text-[15px] hover:bg-zinc-200 disabled:opacity-10 disabled:grayscale transition-all active:scale-[0.98] shadow-xl"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {isSubmitting ? "Updating..." : "Create Profile"}
          </button>
        </form>

        <p className="text-center mt-12 text-[12px] text-white/10 font-mono">
          Logged in as {session?.user?.email}
        </p>
      </div>
    </div>
  );
}

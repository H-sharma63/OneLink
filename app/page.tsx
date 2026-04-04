import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.08] bg-black/50 backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto h-16 flex items-center justify-between px-6">
          <div className="text-[15px] font-bold tracking-tight">
            onelink
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-[13px] text-zinc-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              href="/login" 
              className="h-9 px-4 flex items-center rounded-md bg-white text-black text-[13px] font-medium hover:bg-zinc-200 transition-all active:scale-[0.98]"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-48 pb-32 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/[0.08] mb-10">
            <span className="text-[11px] font-medium text-zinc-400 tracking-wide uppercase">
              The new standard for bio links
            </span>
          </div>

          <h1 className="text-[40px] md:text-[72px] font-bold leading-[1.1] tracking-tight mb-8">
            One link for everything.<br />
            <span className="text-zinc-500">Perfectly minimal.</span>
          </h1>

          <p className="text-[16px] md:text-[18px] text-zinc-400 max-w-[540px] leading-relaxed mb-12">
            Create a professional profile in seconds. No clutter, no noise—just you and your best work, shared through a single URL.
          </p>

          <Link 
            href="/login" 
            className="group h-12 px-8 flex items-center gap-3 rounded-md bg-white text-black text-[14px] font-semibold hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            Claim your link <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Grid - Clean, border-based */}
        <div className="max-w-screen-xl mx-auto mt-48 grid grid-cols-1 md:grid-cols-3 border-t border-white/[0.08]">
          <div className="p-10 md:border-r border-white/[0.08]">
            <h3 className="text-[15px] font-bold mb-3">Instant Speed</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              Built on Next.js 16 for zero-latency page loads. Your profile is always ready.
            </p>
          </div>
          <div className="p-10 md:border-r border-white/[0.08]">
            <h3 className="text-[15px] font-bold mb-3">Neutral Design</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              We focus on typography and whitespace so your content stays the star of the show.
            </p>
          </div>
          <div className="p-10">
            <h3 className="text-[15px] font-bold mb-3">Direct Insights</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              Privacy-first analytics that tell you what's working without the tracking scripts.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-20 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-[14px] font-bold opacity-40">
            onelink
          </div>
          <div className="text-[12px] text-zinc-600 font-medium tracking-wide uppercase">
            Crafted with precision
          </div>
        </div>
      </footer>
    </div>
  );
}

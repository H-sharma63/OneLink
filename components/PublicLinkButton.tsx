"use client";

import { FiArrowUpRight } from "react-icons/fi";

type Link = {
  id: string;
  title: string;
  url: string;
  thumbnail?: string | null;
  icon?: string | null;
};

export function PublicLinkButton({ link, themeColors }: { link: Link, themeColors?: any }) {
  const handleClick = async () => {
    try {
      fetch(`/api/links/${link.id}/click`, { method: "POST" });
    } catch (err) {
      console.error("Failed to track click", err);
    }
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative w-full p-[1px] rounded-[1.25rem] ${themeColors?.bg === 'bg-white' ? 'bg-black/5 hover:bg-black/10' : 'bg-gradient-to-r from-white/5 to-white/[0.02] hover:from-indigo-500/20 hover:to-indigo-500/10'} transition-all active:scale-[0.99]`}
    >
      <div className={`relative w-full py-4 px-5 ${themeColors?.linkBg || 'bg-[#121212]'} rounded-[19px] flex items-center gap-4 overflow-hidden border ${themeColors?.border || 'border-transparent'}`}>
        {/* Subtle Glow Effect on Hover */}
        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {(link.thumbnail || link.icon) ? (
            <img src={link.thumbnail || link.icon || ""} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent" />
          )}
        </div>

        <span className={`relative flex-1 text-[15px] font-bold ${themeColors?.linkText || 'text-white/80'} group-hover:opacity-80 transition-opacity truncate text-left`}>
          {link.title}
        </span>
        
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.03] border ${themeColors?.border || 'border-white/5 text-white/20'} group-hover:bg-indigo-500/10 transition-all ${themeColors?.text || 'text-white'}`}>
          <FiArrowUpRight size={16} />
        </div>
      </div>
    </button>
  );
}

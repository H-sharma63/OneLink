"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLink, FiBarChart2, FiSettings, FiLogOut, FiUser } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { label: "Links", href: "/dashboard", icon: FiLink },
    { label: "Analytics", href: "/dashboard/analytics", icon: FiBarChart2 },
    { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
  ];

  return (
    <div className="flex h-screen bg-[#0F0F0F] text-white font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* 1. MINI SIDEBAR - Only icons, very classy */}
      <aside className="w-[72px] bg-[#161616] flex flex-col items-center py-8 border-r border-white/[0.03] flex-shrink-0 z-30">
        <div className="mb-12">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-black text-xl shadow-2xl">
            o
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav + user actions all at bottom */}
        <div className="flex flex-col gap-4 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                    : "text-zinc-600 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={20} />
              </Link>
            );
          })}

          <div className="w-8 border-t border-white/5 my-1" />

          <Link 
            href={`/${session?.user?.username}`} 
            target="_blank"
            className="w-12 h-12 flex items-center justify-center rounded-2xl text-zinc-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
          >
            <FiUser size={20} />
          </Link>
          <button 
            onClick={() => signOut()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </aside>

      {/* 2. THE MAIN CANVAS - Huge space */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0F0F0F] relative">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-screen-xl mx-auto px-12 md:px-20 py-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

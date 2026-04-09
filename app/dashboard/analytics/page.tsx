"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { FiEye, FiMousePointer, FiArrowUpRight } from "react-icons/fi";

interface Link {
  id: string;
  title: string;
  clicks: number;
}

export default function AnalyticsPage() {
  const { status } = useSession();
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, profileRes] = await Promise.all([
        fetch("/api/links"),
        fetch("/api/profile"),
      ]);
      setLinks(await linksRes.json());
      setProfile(await profileRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) return null;

  const chartData = links.map((l) => ({ name: l.title, clicks: l.clicks }));
  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0);

  return (
    <div className="space-y-20">
      <header>
        <h1 className="text-[40px] font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-[16px] text-white/40">Performance metrics for your workspace.</p>
      </header>

      {/* 1. NOTION STYLE KEY METRICS */}
      <div className="flex gap-16 border-b border-white/5 pb-12">
        <div>
          <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-3">Total Views</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[48px] font-bold">{profile?.views || 0}</span>
            <FiEye className="text-white/10" size={20} />
          </div>
        </div>
        <div>
          <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-3">Total Clicks</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[48px] font-bold">{totalClicks}</span>
            <FiMousePointer className="text-white/10" size={20} />
          </div>
        </div>
      </div>

      {/* 2. SIMPLE CHART */}
      <section>
        <h2 className="text-[14px] font-bold text-white/20 uppercase tracking-widest mb-10">Click distribution</h2>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ backgroundColor: '#202020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Bar dataKey="clicks" radius={[2, 2, 0, 0]} barSize={32}>
                {chartData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#4f46e5' : '#27272a'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3. ROW LIST */}
      <section>
        <h2 className="text-[14px] font-bold text-white/20 uppercase tracking-widest mb-6">Individual Performance</h2>
        <div className="space-y-px bg-white/5 border border-white/5 rounded-lg overflow-hidden">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between px-6 py-4 bg-[#191919] hover:bg-white/[0.02] transition-colors">
              <span className="text-[15px] font-medium">{link.title}</span>
              <div className="flex items-center gap-6">
                <span className="text-[14px] font-mono text-white/40">{link.clicks} clicks</span>
                <FiArrowUpRight className="text-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { FiArrowRight, FiCamera, FiInstagram, FiTwitter, FiGithub, FiLinkedin, FiYoutube, FiGlobe } from "react-icons/fi";

interface Socials {
  instagram?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [banner, setBanner] = useState("");
  const [theme, setTheme] = useState("dark");
  const [themeConfig, setThemeConfig] = useState<any>({});
  const [profileLayout, setProfileLayout] = useState<"classic" | "hero">("classic");
  const [socials, setSocials] = useState<Socials>({});
  const [links, setLinks] = useState<any[]>([]);

  const [localBannerPreview, setLocalBannerPreview] = useState("");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const socialPlatforms = [
    { id: 'instagram', icon: FiInstagram, label: 'Instagram' },
    { id: 'twitter', icon: FiTwitter, label: 'Twitter' },
    { id: 'github', icon: FiGithub, label: 'GitHub' },
    { id: 'linkedin', icon: FiLinkedin, label: 'LinkedIn' },
    { id: 'youtube', icon: FiYoutube, label: 'YouTube' },
    { id: 'website', icon: FiGlobe, label: 'Website' },
  ];

  useEffect(() => {
    fetchProfile();
    fetchLinks();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setDisplayName(data.name || "");
      setBio(data.bio || "");
      setBanner(data.banner || "");
      setTheme(data.theme || "dark");
      setThemeConfig(data.themeConfig || {});
      setProfileLayout(data.themeConfig?.profileLayout || "classic");
      setSocials(data.socials || {});
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data || []);
    } catch (err) {
      console.error("Failed to fetch links", err);
    }
  };

  const handleUpdateProfile = async (data?: any) => {
    if (data?.profileLayout) setProfileLayout(data.profileLayout);
    if (data?.theme) setTheme(data.theme);

    const updatedThemeConfig = { ...themeConfig, profileLayout: data?.profileLayout ?? profileLayout, ...(data?.themeConfig || {}) };
    const payload = {
      name: displayName,
      bio,
      banner,
      theme: data?.theme ?? theme,
      themeConfig: updatedThemeConfig,
      socials: { ...socials, ...(data?.socials || {}) },
      ...data
    };
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalBannerPreview(URL.createObjectURL(file));
    setIsUploadingBanner(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setBanner(data.secure_url);
        handleUpdateProfile({ banner: data.secure_url });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        alert("Failed to delete account. Please try again.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Failed to delete account", err);
      setIsDeleting(false);
    }
  };

  const getThemeClasses = (t: string) => {
    switch (t) {
      case 'light': return { bg: 'bg-[#f0f4f8]', text: 'text-[#0f172a]', linkBg: 'bg-white', linkText: 'text-[#0f172a]', border: 'border-black/5' };
      case 'ocean': return { bg: 'bg-[#0f172a]', text: 'text-[#e2e8f0]', linkBg: 'bg-[#1e293b]', linkText: 'text-white', border: 'border-white/5' };
      case 'hacker': return { bg: 'bg-[#000000]', text: 'text-[#4ade80]', linkBg: 'bg-[#052e16]', linkText: 'text-[#4ade80]', border: 'border-[#4ade80]/20' };
      case 'sunset': return { bg: 'bg-gradient-to-br from-orange-400 to-pink-500', text: 'text-white', linkBg: 'bg-white/10', linkText: 'text-white font-bold', border: 'border-white/20' };
      case 'bubblegum': return { bg: 'bg-pink-100', text: 'text-pink-900', linkBg: 'bg-pink-200', linkText: 'text-pink-800 font-bold', border: 'border-pink-300' };
      case 'cyberpunk': return { bg: 'bg-[#FCE22A]', text: 'text-black', linkBg: 'bg-black', linkText: 'text-[#FCE22A] font-black', border: 'border-black/10' };
      case 'forest': return { bg: 'bg-[#2d4a22]', text: 'text-[#d4edda]', linkBg: 'bg-[#1c3015]', linkText: 'text-[#a3cfb4] font-medium', border: 'border-[#a3cfb4]/20' };
      case 'dracula': return { bg: 'bg-[#282a36]', text: 'text-[#f8f8f2]', linkBg: 'bg-[#44475a]', linkText: 'text-[#ff79c6] font-bold', border: 'border-[#bd93f9]/30' };
      case 'monochrome': return { bg: 'bg-white', text: 'text-black', linkBg: 'bg-black', linkText: 'text-white font-mono', border: 'border-black' };
      case 'midnight': return { bg: 'bg-[#0B0C10]', text: 'text-[#66FCF1]', linkBg: 'bg-[#1F2833]', linkText: 'text-[#45A29E]', border: 'border-[#45A29E]/30' };
      case 'lavender': return { bg: 'bg-[#E6E6FA]', text: 'text-[#4B0082]', linkBg: 'bg-[#D8BFD8]', linkText: 'text-[#4B0082] font-semibold', border: 'border-[#8A2BE2]/20' };
      default: return { bg: 'bg-[#0a0a0a]', text: 'text-white/90', linkBg: 'bg-[#1e1e1e]', linkText: 'text-white/80', border: 'border-white/5' };
    }
  };

  const themeColors = getThemeClasses(theme);

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  if (status === "loading" || isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start relative max-w-screen-2xl mx-auto">

      {/* Settings Panel */}
      <div className="flex-1 max-w-[640px] space-y-16 pb-24">
        <div className="mb-4">
          <h1 className="text-[28px] font-bold tracking-tight mb-2 text-white">Settings</h1>
          <p className="text-[14px] text-zinc-500">Manage your profile appearance and account.</p>
        </div>

        {/* Appearance Settings */}
        <section className="bg-[#161616] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
          <h2 className="text-[12px] font-black uppercase tracking-[3px] text-white/20">Appearance</h2>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-white/10 tracking-widest">Profile Image Layout</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleUpdateProfile({ profileLayout: "classic" })}
                className={`py-8 rounded-[2rem] border-[3px] flex flex-col items-center justify-center gap-4 transition-all ${profileLayout === "classic" ? "border-indigo-500 bg-white/5 text-white shadow-xl scale-105" : "border-white/5 hover:border-white/20 text-white/40 hover:scale-[1.02]"}`}
              >
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex-shrink-0" />
                <span className="text-[13px] font-bold tracking-wide">Classic</span>
              </button>
              <button
                onClick={() => handleUpdateProfile({ profileLayout: "hero" })}
                className={`py-8 rounded-[2rem] border-[3px] flex flex-col items-center justify-center gap-4 transition-all ${profileLayout === "hero" ? "border-indigo-500 bg-white/5 text-white shadow-xl scale-105" : "border-white/5 hover:border-white/20 text-white/40 hover:scale-[1.02]"}`}
              >
                <div className="w-16 h-16 rounded-xl bg-white/10 border-2 border-white/20 flex-shrink-0 flex items-end justify-center pb-2 relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="w-6 h-6 rounded-full bg-white/80 border-2 border-white/20 relative z-10" />
                </div>
                <span className="text-[13px] font-bold tracking-wide">Hero</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-[10px] font-black uppercase text-white/10 tracking-widest">Profile Banner</h3>
            <div className="w-full h-32 rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden relative group flex items-center justify-center">
              {(localBannerPreview || banner) ? (
                <img src={localBannerPreview || banner} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/20 text-[13px] font-bold">No Banner</span>
              )}
              <label className="absolute inset-0 w-full h-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-[13px] cursor-pointer">
                {isUploadingBanner ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FiCamera size={16} /> Upload Banner</>}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploadingBanner} />
              </label>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-[10px] font-black uppercase text-white/10 tracking-widest">Theme</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[256px] overflow-y-auto no-scrollbar pr-2">
              {['dark', 'light', 'ocean', 'hacker', 'sunset', 'bubblegum', 'cyberpunk', 'forest', 'dracula', 'monochrome', 'midnight', 'lavender'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleUpdateProfile({ theme: t })}
                  className={`p-4 rounded-2xl border ${theme === t ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/5 bg-white/[0.02] text-white/40 hover:bg-white/[0.04]'} transition-all capitalize font-bold text-[13px]`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section className="bg-[#161616] p-10 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
          <h2 className="text-[12px] font-black uppercase tracking-[3px] text-white/20">Account</h2>
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.05]">
              <div>
                <p className="text-[13px] font-medium text-white/40 mb-1">Email Address</p>
                <p className="text-[15px] font-bold text-white">{session?.user?.email}</p>
              </div>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-wider">Verified</span>
            </div>

            <button onClick={() => setIsDeleteModalOpen(true)} className="w-full flex items-center justify-between group py-2 hover:opacity-100 opacity-60 transition-opacity">
              <div className="text-left">
                <p className="text-[14px] font-bold text-red-500 mb-1">Delete Account</p>
                <p className="text-[12px] text-white/40 font-medium">Permanently remove your profile and all data.</p>
              </div>
              <FiArrowRight className="text-red-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </div>

      {/* Live Phone Preview */}
      <div className="hidden lg:block sticky top-8 w-[320px] flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-[3px] text-white/20 text-center mb-6">Live Preview</p>
        <div className={`w-full aspect-[9/18.5] ${themeColors.bg} border-[12px] border-[#202020] rounded-[3.5rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col transition-all duration-500`}>
          <div className="w-24 h-6 bg-[#202020] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-3xl z-20" />

          {profileLayout === "classic" && (localBannerPreview || banner) && (
            <div className="w-full h-32 absolute top-0 left-0 z-0">
              <img src={localBannerPreview || banner} className="w-full h-full object-cover" />
            </div>
          )}

          {profileLayout === "hero" && session?.user?.image && (
            <div
              className="w-full h-1/2 absolute top-0 left-0 z-0 pointer-events-none"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
              }}
            >
              <img src={session.user.image} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="mt-16 text-center w-full relative z-10 px-6">
            <div className="block">
              {profileLayout === "classic" && (
                <div className="w-20 h-20 rounded-full bg-black mx-auto mb-4 overflow-hidden border border-white/5 flex items-center justify-center shadow-xl relative">
                  <div className={`absolute inset-0 border-2 ${themeColors.border} rounded-full`} />
                  {session?.user?.image ? (
                    <img src={session.user.image} className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <span className="text-[20px] font-bold text-white/50 relative z-10">{session?.user?.name?.[0]}</span>
                  )}
                </div>
              )}
              <h3 className={`text-[15px] font-bold ${themeColors.text} truncate max-w-[200px] mx-auto uppercase tracking-tight`}>{displayName || "Your Name"}</h3>
              <p className={`text-[11px] ${themeColors.text} opacity-50 mb-2 mt-1 truncate`}>{bio || "Your bio..."}</p>
              <p className={`text-[10px] ${themeColors.text} opacity-30 mb-6 truncate`}>@{session?.user?.username}</p>
            </div>

            <div className="space-y-3 w-full max-h-[300px] overflow-y-auto no-scrollbar py-2">
              {links.filter(l => l.isActive).map((link: any) => (
                <div
                  key={link.id}
                  className={`flex items-center w-full min-h-12 py-2 px-3 ${themeColors.linkBg} border ${themeColors.border} rounded-xl text-[12px] font-semibold ${themeColors.linkText} shadow-md`}
                >
                  {link.icon || link.thumbnail ? (
                    <img src={link.icon || link.thumbnail} className="w-8 h-8 rounded shrink-0 object-cover bg-white/5" />
                  ) : (
                    <div className="w-8 h-8 rounded shrink-0 bg-transparent" />
                  )}
                  <div className="flex-1 px-2 truncate leading-tight text-center">{link.title}</div>
                  <div className="w-8 h-8 shrink-0" />
                </div>
              ))}
            </div>

            <div className={`mt-6 flex flex-wrap justify-center gap-4 opacity-50 ${themeColors.text} pb-8`}>
              {socialPlatforms.map(platform => {
                const handle = (socials as any)[platform.id];
                if (!handle) return null;
                return (
                  <span key={platform.id}>
                    <platform.icon size={16} />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isDeleting && setIsDeleteModalOpen(false)} />
          <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
              <FiArrowRight className="text-red-500 w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-black text-white mb-2 tracking-tight">Delete Account?</h3>
            <p className="text-[14px] text-white/50 font-medium mb-8 leading-relaxed">
              Are you absolutely sure? This action will permanently remove your profile, your links, and all associated data. You cannot undo this action.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-4 px-4 rounded-xl text-[14px] font-bold text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-4 px-4 rounded-xl text-[14px] font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, delete it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

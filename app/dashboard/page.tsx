"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiPlus, FiCamera, FiExternalLink, FiTrash2, FiZap, FiInstagram, FiTwitter, FiGithub, FiLinkedin, FiYoutube, FiGlobe, FiArrowUpRight, FiShare2 } from "react-icons/fi";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableLinkItem } from "@/components/SortableLinkItem";
import QRShareModal from "@/components/dashboard/QRShareModal";

interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  order: number;
  clicks: number;
  icon?: string;
  thumbnail?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [links, setLinks] = useState<Link[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  // Still needed for floating preview
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [banner, setBanner] = useState("");
  const [theme, setTheme] = useState("dark");
  const [themeConfig, setThemeConfig] = useState<any>({});
  const [profileLayout, setProfileLayout] = useState<"classic" | "hero">("classic");
  const [socials, setSocials] = useState<any>({});

  const [localImagePreview, setLocalImagePreview] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [savedImage, setSavedImage] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    fetchLinks();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    if (!res.ok) return;
    const data = await res.json();

    if (data.onboarded === false) {
      router.push("/onboarding");
      return;
    }

    setDisplayName(data.name || "");
    setBio(data.bio || "");
    setBanner(data.banner || "");
    setTheme(data.theme || "dark");
    setThemeConfig(data.themeConfig || {});
    setProfileLayout(data.themeConfig?.profileLayout || "classic");
    setSocials(data.socials || {});
    setSavedImage(data.image || "");
  };

  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data || []);
  };

  const handleUpdateProfile = async (data?: any) => {
    const updatedThemeConfig = { ...themeConfig, profileLayout, ...(data?.themeConfig || {}) };
    const payload = {
      name: displayName,
      bio,
      banner,
      theme,
      themeConfig: updatedThemeConfig,
      socials: { ...socials, ...(data?.socials || {}) },
      ...data
    };
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === "avatar") {
      setLocalImagePreview(previewUrl);
      setIsUploadingAvatar(true);
    } else {
      setNewThumbnail(previewUrl);
      setIsUploadingThumbnail(true);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        if (type === "avatar") {
          await handleUpdateProfile({ image: data.secure_url });
        } else {
          setNewThumbnail(data.secure_url);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (type === "avatar") setIsUploadingAvatar(false);
      else setIsUploadingThumbnail(false);
    }
  };

  const handleAddLink = async () => {
    if (!newTitle || !newUrl) return;
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, url: newUrl, thumbnail: newThumbnail, icon: newIcon }),
    });
    if (res.ok) {
      const newLink = await res.json();
      setLinks([...links, newLink]);
      setNewTitle(""); setNewUrl(""); setNewThumbnail(""); setNewIcon(""); setIsAdding(false);
    }
  };

  const handleUrlBlur = async () => {
    if (!newUrl || newUrl.length < 5) return;

    setIsFetchingMetadata(true);
    try {
      const res = await fetch(`/api/links/metadata?url=${encodeURIComponent(newUrl)}`);
      const data = await res.json();
      if (data.title && !newTitle) setNewTitle(data.title);
      if (data.image) setNewThumbnail(data.image);
      if (data.icon) setNewIcon(data.icon);
    } catch (err) {
      console.error("Failed to fetch metadata", err);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleToggleLinkActive = async (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;
    const updatedStatus = !link.isActive;
    setLinks(links.map(l => l.id === id ? { ...l, isActive: updatedStatus } : l));
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: updatedStatus }),
    });
  };

  const handleDeleteLink = async (id: string) => {
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (res.ok) setLinks(links.filter(l => l.id !== id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);
      await Promise.all(newLinks.map((link, index) => fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: index }),
      })));
    }
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const socialPlatforms = [
    { id: 'instagram', icon: FiInstagram, label: 'Instagram' },
    { id: 'twitter', icon: FiTwitter, label: 'Twitter' },
    { id: 'github', icon: FiGithub, label: 'GitHub' },
    { id: 'linkedin', icon: FiLinkedin, label: 'LinkedIn' },
    { id: 'youtube', icon: FiYoutube, label: 'YouTube' },
    { id: 'website', icon: FiGlobe, label: 'Website' },
  ];

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

  return (
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start relative max-w-screen-2xl mx-auto px-6">

      <div className="flex-1 w-full max-w-[640px] space-y-16 pb-24">

        {/* Profile Editor */}
        <section className="bg-[#161616] p-10 rounded-[2.5rem] border border-white/5 space-y-10 shadow-2xl mt-8">
          <div className="flex items-center gap-8">
            <div className="relative group relative overflow-hidden">
              <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl transition-all group-hover:opacity-80">
                {(localImagePreview || savedImage || session?.user?.image) ? (
                  <img src={localImagePreview || savedImage || session?.user?.image || ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[32px] font-bold text-white/5">{session?.user?.name?.[0]}</span>
                )}
              </div>

              <label className="absolute -bottom-2 -right-2 p-2.5 bg-[#202020] text-indigo-400 rounded-xl border border-white/5 shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all z-10">
                {isUploadingAvatar ? <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> : <FiCamera size={16} />}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "avatar")} disabled={isUploadingAvatar} />
              </label>
            </div>
            <div className="flex-1 space-y-1">
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                onBlur={(e) => handleUpdateProfile({ name: e.target.value })}
                className="text-[28px] font-black bg-transparent border-none focus:outline-none w-full tracking-tight text-white placeholder:text-white/5"
                placeholder="Your Name"
              />
              <p className="text-[13px] text-white/20 font-mono">getonelink.vercel.app/{session?.user?.username}</p>
            </div>
          </div>

          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            onBlur={(e) => handleUpdateProfile({ bio: e.target.value })}
            className="text-[15px] text-white/40 bg-transparent border-none focus:outline-none w-full resize-none leading-relaxed placeholder:text-white/5"
            placeholder="Add a short bio..."
            rows={2}
          />

          <div className="pt-6 border-t border-white/5">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white/10 mb-6">Social Media Handles</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {socialPlatforms.map(platform => (
                <div key={platform.id} className="flex items-center gap-3 group">
                  <platform.icon size={18} className="text-white/10 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    placeholder={platform.label}
                    value={(socials as any)[platform.id] || ""}
                    onChange={e => {
                      const newSocials = { ...socials, [platform.id]: e.target.value };
                      setSocials(newSocials);
                    }}
                    onBlur={() => handleUpdateProfile({ socials })}
                    className="bg-transparent border-none text-[13px] text-white/60 focus:outline-none focus:text-white transition-colors w-full p-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Links Manager */}
        <section className="space-y-8 mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-black uppercase tracking-[3px] text-white/20">Active Links</h2>
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-2.5 bg-white text-black rounded-xl text-[12px] font-black hover:bg-zinc-200 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <FiPlus size={16} /> Add Link
            </button>
          </div>

          {isAdding && (
            <div className="p-8 bg-[#161616] border border-white/10 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative">
              {isFetchingMetadata && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Fetching Metadata</p>
                  </div>
                </div>
              )}

              <div className="flex gap-8 mb-10">
                <div className="w-32 h-32 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden group/thumb relative">
                  {(newThumbnail || newIcon) ? (
                    <img src={newThumbnail || newIcon} className="w-full h-full object-cover" />
                  ) : (
                    <FiCamera size={24} className="text-white/10" />
                  )}
                  <label className="absolute inset-x-0 bottom-0 h-10 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-[11px] font-bold text-white tracking-widest uppercase cursor-pointer z-10">
                    {isUploadingThumbnail ? 'Uploading' : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "thumbnail")} disabled={isUploadingThumbnail} />
                  </label>
                  {newThumbnail && (
                    <button
                      onClick={() => setNewThumbnail("")}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <FiTrash2 size={12} className="text-red-400" />
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/10 tracking-widest ml-1">URL</label>
                    <div className="relative">
                      <input
                        placeholder="https://github.com/your-username"
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        onBlur={handleUrlBlur}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-[15px] focus:outline-none focus:border-indigo-500 transition-all font-medium text-white"
                      />
                      {newUrl && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                          <FiExternalLink size={16} className="text-white/10" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/10 tracking-widest ml-1">Title</label>
                    <input
                      placeholder="e.g. My GitHub Profile"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-[15px] focus:outline-none focus:border-indigo-500 transition-all font-medium text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  onClick={handleAddLink}
                  disabled={!newTitle || !newUrl}
                  className="px-8 py-3.5 bg-indigo-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add to OneLink
                </button>
                <button onClick={() => setIsAdding(false)} className="px-6 py-3.5 text-white/30 text-[13px] font-bold hover:text-white transition-colors">Discard</button>
              </div>
            </div>
          )}

          <div className="bg-[#161616] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {links.map((link) => (
                    <SortableLinkItem
                      key={link.id}
                      link={link}
                      onDelete={handleDeleteLink}
                      onToggle={handleToggleLinkActive}
                    />
                  ))}
                  {links.length === 0 && !isAdding && (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mx-auto text-white/5">
                        <FiZap size={24} />
                      </div>
                      <p className="text-[13px] text-white/10 font-bold tracking-tight">Your link list is empty.</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </section>
      </div>

      {/* Phone Preview */}
      <div className="hidden lg:block sticky top-8 w-[260px] flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black uppercase tracking-[3px] text-white/20">Live Preview</p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[12px] font-bold rounded-xl transition-all active:scale-95"
            >
              <FiShare2 size={14} />
              Share
            </button>
            <a
              href={`/${session?.user?.username}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <FiArrowUpRight size={14} />
              Go Live
            </a>
          </div>
        </div>
        <div className={`w-full aspect-[9/18.5] ${themeColors.bg} border-[12px] border-[#202020] rounded-[3.5rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col transition-colors duration-500`}>
          <div className="w-24 h-6 bg-[#202020] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-3xl z-20" />

          {/* BANNER REPLICA FOR PREVIEW */}
          {profileLayout === "classic" && banner && (
            <div className="w-full h-32 absolute top-0 left-0 bg-white/5 z-0">
              <img src={banner} className="w-full h-full object-cover" />
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

          <div className="flex-1 mt-16 text-center w-full relative z-10 px-6 overflow-hidden flex flex-col">
            <a
              href={`/${session?.user?.username}`}
              target="_blank"
              className="group/header block"
            >
              {profileLayout === "classic" && (
                <div className="w-20 h-20 rounded-full bg-black mx-auto mb-4 overflow-hidden border border-white/5 flex items-center justify-center shadow-xl group-hover/header:rotate-6 transition-transform relative">
                  <div className={`absolute inset-0 border-2 ${themeColors.border} rounded-full`} />
                  {session?.user?.image ? (
                    <img src={session.user.image} className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <span className="text-[20px] font-bold text-white/50 relative z-10">{session?.user?.name?.[0]}</span>
                  )}
                </div>
              )}
              <h3 className={`text-[15px] font-bold ${themeColors.text} truncate max-w-[200px] mx-auto group-hover/header:opacity-80 transition-opacity uppercase tracking-tight`}>{displayName || "Your Name"}</h3>
              <p className={`text-[11px] ${themeColors.text} opacity-50 mb-6 mt-1 truncate`}>@{session?.user?.username}</p>
            </a>

            <div className="space-y-3 w-full flex-1 overflow-y-auto no-scrollbar py-2">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={ensureAbsoluteUrl(link.url)}
                  target="_blank"
                  className={`flex items-center w-full min-h-12 py-2 px-3 ${themeColors.linkBg} border ${themeColors.border} rounded-xl text-[12px] font-semibold ${themeColors.linkText} shadow-md text-center hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer scale-in ${!link.isActive && "opacity-30"}`}
                >
                  {link.icon || link.thumbnail ? (
                    <img src={link.icon || link.thumbnail} className="w-8 h-8 rounded shrink-0 object-cover bg-white/5" />
                  ) : (
                    <div className="w-8 h-8 rounded shrink-0 bg-transparent" />
                  )}
                  <div className="flex-1 px-2 truncate leading-tight">
                    {link.title}
                  </div>
                  <div className="w-8 h-8 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Social icons pinned to bottom of phone */}
          {socialPlatforms.some(p => (socials as any)[p.id]) && (
            <div className={`absolute bottom-0 left-0 right-0 z-20 flex justify-center gap-4 px-4 py-3 backdrop-blur-md bg-black/20 border-t ${themeColors.border}`}>
              {socialPlatforms.map(platform => {
                const handle = (socials as any)[platform.id];
                if (!handle) return null;
                const socialUrl = platform.id === 'website' ? handle : `https://${platform.id}.com/${handle}`;
                return (
                  <a key={platform.id} href={ensureAbsoluteUrl(socialUrl)} target="_blank" className={`${themeColors.text} opacity-60 hover:opacity-100 hover:scale-110 transition-all`}>
                    <platform.icon size={14} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <QRShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        username={session?.user?.username || ""}
      />
    </div>
  );
}

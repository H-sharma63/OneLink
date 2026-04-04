"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiCheck, FiCamera, FiInstagram, FiTwitter, FiGithub, FiLinkedin, FiYoutube, FiGlobe, FiMessageCircle, FiMusic, FiCode, FiBriefcase, FiUser } from "react-icons/fi";

const totalSteps = 5;

const goalOptions = [
  { id: "creator", title: "Creator", description: "Build my following and explore ways to monetize my audience.", icon: FiCode, color: "bg-pink-500" },
  { id: "business", title: "Business", description: "Grow my business and reach more customers.", icon: FiBriefcase, color: "bg-purple-600" },
  { id: "personal", title: "Personal", description: "Share links with my friends and acquaintances.", icon: FiUser, color: "bg-blue-500" },
];

const availablePlatforms = [
  { id: 'instagram', icon: FiInstagram, label: 'Instagram' },
  { id: 'twitter', icon: FiTwitter, label: 'Twitter' },
  { id: 'github', icon: FiGithub, label: 'GitHub' },
  { id: 'linkedin', icon: FiLinkedin, label: 'LinkedIn' },
  { id: 'youtube', icon: FiYoutube, label: 'YouTube' },
  { id: 'website', icon: FiGlobe, label: 'Personal Website' },
];

const themeOptions = [
  { id: "dark", label: "Obsidian", bg: "bg-[#0a0a0a]", text: "text-white/90", border: "border-white/5", linkBg: "bg-[#1e1e1e]", linkText: "text-white/80" },
  { id: "light", label: "Clean", bg: "bg-[#f0f4f8]", text: "text-[#0f172a]", border: "border-black/5", linkBg: "bg-white", linkText: "text-[#0f172a]" },
  { id: "ocean", label: "Ocean Glow", bg: "bg-[#0f172a]", text: "text-[#e2e8f0]", border: "border-white/5", linkBg: "bg-[#1e293b]", linkText: "text-white" },
  { id: "hacker", label: "Terminal", bg: "bg-[#000000]", text: "text-[#4ade80]", border: "border-[#4ade80]/20", linkBg: "bg-[#052e16]", linkText: "text-[#4ade80]" },
  { id: "sunset", label: "Sunset", bg: "bg-gradient-to-br from-orange-400 to-pink-500", text: "text-white", border: "border-white/20", linkBg: "bg-white/10 backdrop-blur-md", linkText: "text-white" },
  { id: "bubblegum", label: "Bubblegum", bg: "bg-pink-100", text: "text-pink-900", border: "border-pink-300", linkBg: "bg-white", linkText: "text-pink-800" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [theme, setTheme] = useState("dark");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [localImagePreview, setLocalImagePreview] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if they are already onboarded to prevent re-entering
    const checkOnboarded = async () => {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.onboarded) {
          router.push("/dashboard");
        }
        if (data.name) setDisplayName(data.name);
        if (data.bio) setBio(data.bio);
        if (data.image) setImage(data.image);
      }
    };
    checkOnboarded();
  }, [router]);

  // Keep displayName in sync with session name initially if empty
  useEffect(() => {
    if (!displayName && session?.user?.name) {
      setDisplayName(session.user.name);
    }
  }, [session, displayName]);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // 1. Update Profile (onboarded, theme, socials, etc)
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          bio,
          image,
          theme,
          socials: { ...socials, category: goal },
          onboarded: true
        }),
      });

      // 2. Head to Dashboard
      await update({ onboarded: true });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
      const newSocials = { ...socials };
      delete newSocials[id];
      setSocials(newSocials);
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const isStepValid = () => {
    if (step === 1) return goal !== "";
    if (step === 2) return theme !== "";
    if (step === 3) return selectedPlatforms.length > 0 || true; // optional
    if (step === 4) return displayName.trim() !== "";
    return true;
  };

  const activeThemeObj = themeOptions.find(t => t.id === theme) || themeOptions[0];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans selection:bg-indigo-500/30 flex flex-col">

      {/* Header / Progress */}
      <div className="w-full flex items-center justify-between p-6 max-w-screen-xl mx-auto">
        <button
          onClick={prevStep}
          className={`text-[14px] font-semibold text-white/50 hover:text-white transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          Back
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= step ? 'w-8 bg-white' : 'w-4 bg-white/20'}`}
            />
          ))}
        </div>
        <button
          onClick={nextStep}
          className="text-[14px] font-semibold text-white/50 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center max-w-[700px] mx-auto w-full px-6 pt-6 pb-24">

        {/* STEP 1: Categories */}
        {step === 1 && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-[32px] md:text-[40px] font-black tracking-tight leading-tight">Which best describes your goal for using OneLink?</h1>
              <p className="text-[16px] text-white/50 font-medium">This helps us personalize your experience.</p>
            </div>

            <div className="space-y-4">
              {goalOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => { setGoal(option.id); nextStep(); }}
                  className={`w-full p-6 text-left rounded-3xl border-2 flex items-center gap-6 transition-all ${goal === option.id ? 'border-white bg-[#1a1a1a]' : 'border-white/10 hover:border-white/20 bg-[#161616]'}`}
                >
                  <div className="flex-1 space-y-1">
                    <h3 className="text-[18px] font-bold text-white">{option.title}</h3>
                    <p className="text-[14px] text-white/50 font-medium">{option.description}</p>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl ${option.color} flex items-center justify-center text-white shadow-lg`}>
                    <option.icon size={28} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Theme Selection */}
        {step === 2 && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-[32px] md:text-[40px] font-black tracking-tight leading-tight">Select a theme</h1>
              <p className="text-[16px] text-white/50 font-medium">Pick the style that feels right. You can customize it later.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {themeOptions.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-full aspect-[1/2] rounded-[2rem] border-[6px] transition-all relative overflow-hidden flex flex-col items-center p-4 ${theme === t.id ? 'border-indigo-500 scale-105 shadow-2xl' : 'border-white/5 shadow-md hover:scale-105 hover:border-white/20'}`}
                >
                  <div className={`absolute inset-0 ${t.bg} z-0 pointer-events-none transition-colors duration-500`} />

                  <div className="relative z-10 w-full flex flex-col items-center mt-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 mx-auto mb-4 border border-white/5 opacity-50" />
                    <div className={`w-3/4 h-3 rounded-full ${t.linkBg} mb-6 opacity-80`} />

                    <div className="w-full space-y-2">
                      <div className={`w-full h-8 rounded-xl ${t.linkBg} opacity-90`} />
                      <div className={`w-full h-8 rounded-xl ${t.linkBg} opacity-80`} />
                      <div className={`w-full h-8 rounded-xl ${t.linkBg} opacity-70`} />
                    </div>
                  </div>

                  <div className={`absolute bottom-4 text-[12px] font-bold ${t.text} uppercase tracking-widest z-10`}>
                    {t.label}
                  </div>
                  {theme === t.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center z-20">
                      <FiCheck size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Platforms */}
        {step === 3 && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 text-center">
            <div className="space-y-4 mb-12">
              <h1 className="text-[32px] md:text-[40px] font-black tracking-tight leading-tight">Which platforms are you on?</h1>
              <p className="text-[16px] text-white/50 font-medium">Pick the ones you want to add to your OneLink.</p>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-[500px] mx-auto">
              {availablePlatforms.map(platform => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center gap-3 transition-all ${isSelected ? 'border-white bg-[#1a1a1a]' : 'border-white/10 hover:border-white/20 bg-[#161616]'}`}
                  >
                    <platform.icon size={32} className={isSelected ? 'text-indigo-400' : 'text-white'} />
                    <span className="text-[12px] font-semibold text-white/60">{platform.label}</span>
                  </button>
                );
              })}
            </div>


          </div>
        )}

        {/* STEP 4: Add Platform Links */}
        {step === 4 && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-[32px] md:text-[40px] font-black tracking-tight leading-tight">Add your links</h1>
              <p className="text-[16px] text-white/50 font-medium">Paste the URLs or handles for your selected platforms.</p>
            </div>

            <div className="space-y-6 max-w-[500px] mx-auto w-full">
              {selectedPlatforms.length === 0 && (
                <p className="text-center text-white/40 font-medium">You didn't select any platforms. You can skip this step.</p>
              )}

              {selectedPlatforms.map(platformId => {
                const platform = availablePlatforms.find(p => p.id === platformId);
                return (
                  <div key={platformId} className="flex items-center gap-4 bg-[#161616] p-4 border border-white/5 rounded-3xl group focus-within:border-white focus-within:bg-[#1a1a1a] transition-colors">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center flex-shrink-0">
                      {platform && <platform.icon size={20} className="text-white" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">{platform?.label}</label>
                      <input
                        placeholder={`https://${platformId}.com/username`}
                        value={socials[platformId] || ""}
                        onChange={(e) => setSocials({ ...socials, [platformId]: e.target.value })}
                        className="w-full bg-transparent border-none p-0 text-[15px] font-medium text-white focus:outline-none focus:ring-0 placeholder:text-white/20"
                      />
                    </div>
                  </div>
                );
              })}
            </div>


          </div>
        )}

        {/* STEP 5: Add Profile Details */}
        {step === 5 && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-[32px] md:text-[40px] font-black tracking-tight leading-tight">Complete your profile</h1>
              <p className="text-[16px] text-white/50 font-medium">Add your profile image, name, and a short bio.</p>
            </div>

            <div className="max-w-[400px] mx-auto w-full flex flex-col items-center space-y-8">
              <div className="relative">
                <div className="w-32 h-32 bg-[#202020] rounded-full border-4 border-[#0F0F0F] shadow-xl flex items-center justify-center overflow-hidden">
                  {(localImagePreview || image) ? (
                    <img src={localImagePreview || image} className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={48} className="text-white/20" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-white text-black rounded-full border-4 border-[#0F0F0F] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer">
                  {isUploadingAvatar 
                    ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    : <FiCamera size={16} />}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    disabled={isUploadingAvatar}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLocalImagePreview(URL.createObjectURL(file));
                      setIsUploadingAvatar(true);
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                        const data = await res.json();
                        if (res.ok) setImage(data.secure_url);
                      } catch (err) { console.error(err); }
                      finally { setIsUploadingAvatar(false); }
                    }}
                  />
                </label>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white/60 ml-2">Display Name</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Creator John"
                    className="w-full bg-[#161616] border border-white/5 rounded-2xl px-6 py-4 text-[15px] font-medium text-white focus:outline-none focus:border-white focus:bg-[#1a1a1a] transition-colors placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white/60 ml-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your audience about yourself..."
                    rows={3}
                    className="w-full bg-[#161616] border border-white/5 rounded-2xl px-6 py-4 text-[15px] font-medium text-white focus:outline-none focus:border-white focus:bg-[#1a1a1a] transition-colors resize-none placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="pt-8 w-full">
                <button
                  onClick={handleComplete}
                  disabled={isLoading || !displayName}
                  className="w-full py-4 bg-white text-black rounded-full text-[16px] font-bold hover:bg-gray-200 transition-colors shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Launch OneLink"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer Area */}
      <div className="w-full sticky bottom-0 z-50 bg-[#0F0F0F]">
        {(step < 5) && (
          <div className="w-full border-t border-white/5 p-6 flex justify-center">
            <div className="w-full max-w-[500px]">
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="w-full py-4 bg-white text-black rounded-full text-[16px] font-black disabled:bg-white/10 disabled:text-white/30 transition-all shadow-xl hover:bg-zinc-200"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Link Footer */}
        <footer className={`w-full flex flex-col items-center justify-center gap-2 py-4 ${step === 5 ? 'border-t border-white/5' : 'pt-0 pb-6'}`}>
          <p className="text-[12px] text-white/25 font-medium text-center px-4">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-white/50 hover:text-white underline underline-offset-2 transition-colors">Terms of Service</a>
            {" "}&amp;{" "}
            <a href="/privacy" className="text-white/50 hover:text-white underline underline-offset-2 transition-colors">Privacy Policy</a>
          </p>
          <p className="text-[11px] text-white/15 font-semibold tracking-wide">
            &copy; {new Date().getFullYear()} OneLink. All rights reserved.
          </p>
        </footer>
      </div>

    </div>
  );
}

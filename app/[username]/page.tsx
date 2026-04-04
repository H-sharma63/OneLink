import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { FiInstagram, FiTwitter, FiGithub, FiLinkedin, FiYoutube, FiGlobe, FiShare2 } from "react-icons/fi";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!user) notFound();

  prisma.user.update({
    where: { id: user.id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  const socials = (user.socials as any) || {};
  const socialPlatforms = [
    { id: 'instagram', icon: FiInstagram },
    { id: 'twitter', icon: FiTwitter },
    { id: 'github', icon: FiGithub },
    { id: 'linkedin', icon: FiLinkedin },
    { id: 'youtube', icon: FiYoutube },
    { id: 'website', icon: FiGlobe },
  ];

  const getThemeClasses = (t: string) => {
    switch (t) {
      case 'light': return { bg: 'bg-[#f0f4f8]', text: 'text-[#0f172a]', linkBg: 'bg-white', linkText: 'text-[#0f172a]', border: 'border-black/5' };
      case 'ocean': return { bg: 'bg-[#0f172a]', text: 'text-[#e2e8f0]', linkBg: 'bg-[#1e293b]', linkText: 'text-white', border: 'border-white/5' };
      case 'hacker': return { bg: 'bg-[#000000]', text: 'text-[#4ade80]', linkBg: 'bg-[#052e16]', linkText: 'text-[#4ade80]', border: 'border-[#4ade80]/20' };
      case 'sunset': return { bg: 'bg-gradient-to-br from-orange-400 to-pink-500', text: 'text-white', linkBg: 'bg-white/10 backdrop-blur-md', linkText: 'text-white font-bold', border: 'border-white/20' };
      case 'bubblegum': return { bg: 'bg-pink-100', text: 'text-pink-900', linkBg: 'bg-white', linkText: 'text-pink-800 font-bold', border: 'border-pink-300' };
      case 'cyberpunk': return { bg: 'bg-[#FCE22A]', text: 'text-black', linkBg: 'bg-black', linkText: 'text-[#FCE22A] font-black', border: 'border-black/10' };
      case 'forest': return { bg: 'bg-[#2d4a22]', text: 'text-[#d4edda]', linkBg: 'bg-[#1c3015]', linkText: 'text-[#a3cfb4] font-medium', border: 'border-[#a3cfb4]/20' };
      case 'dracula': return { bg: 'bg-[#282a36]', text: 'text-[#f8f8f2]', linkBg: 'bg-[#44475a]', linkText: 'text-[#ff79c6] font-bold', border: 'border-[#bd93f9]/30' };
      case 'monochrome': return { bg: 'bg-white', text: 'text-black', linkBg: 'bg-black', linkText: 'text-white font-mono', border: 'border-black' };
      case 'midnight': return { bg: 'bg-[#0B0C10]', text: 'text-[#66FCF1]', linkBg: 'bg-[#1F2833]', linkText: 'text-[#45A29E]', border: 'border-[#45A29E]/30' };
      case 'lavender': return { bg: 'bg-[#E6E6FA]', text: 'text-[#4B0082]', linkBg: 'bg-[#D8BFD8]', linkText: 'text-[#4B0082] font-semibold', border: 'border-[#8A2BE2]/20' };
      default: return { bg: 'bg-[#0a0a0a]', text: 'text-white/90', linkBg: 'bg-[#1e1e1e]', linkText: 'text-white/80', border: 'border-white/5' };
    }
  };
  const themeColors = getThemeClasses(user.theme as string);
  const profileLayout = (user.themeConfig as any)?.profileLayout || "classic";

  return (
    <div className={`min-h-[100dvh] ${themeColors.bg} ${themeColors.text} font-sans transition-colors duration-500`}>
      
      {/* SHARE BUTTON */}
      <button className={`fixed top-6 right-6 p-4 rounded-2xl bg-black/5 border ${themeColors.border} ${themeColors.text} opacity-50 hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-50`}>
        <FiShare2 size={20} />
      </button>

      {/* CLASSIC BANNER */}
      {profileLayout === "classic" && (user as any).banner && (
        <div className="w-full h-48 sm:h-64 absolute top-0 left-0 bg-white/5 z-0">
          <img src={(user as any).banner} className="w-full h-full object-cover" />
        </div>
      )}

      {/* HERO IMAGE */}
      {profileLayout === "hero" && user.image && (
         <div 
           className="w-full h-[50dvh] min-h-[350px] absolute top-0 left-0 z-0 pointer-events-none"
           style={{
             WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
             maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
           }}
         >
           <img src={user.image} className="w-full h-full object-cover" />
         </div>
       )}

      <main className={`max-w-[640px] mx-auto pb-20 px-6 flex flex-col items-center relative z-10 w-full ${profileLayout === 'hero' ? 'pt-[35dvh] lg:pt-[40dvh]' : 'pt-32'}`}>
        
        {/* AVATAR */}
        {profileLayout === "classic" && (
        <div className="w-[104px] h-[104px] rounded-full mb-6 overflow-hidden border-4 border-transparent shadow-2xl flex-shrink-0 flex items-center justify-center relative bg-black">
          <div className={`absolute inset-0 border-4 ${themeColors.border} rounded-full`} />
          {user.image ? (
            <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover rounded-full relative z-10" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[36px] font-bold ${themeColors.text} opacity-50 relative z-10 bg-white/5`}>
              {user.name?.[0] || user.username?.[0]}
            </div>
          )}
        </div>
        )}

        {/* TITLE & BIO */}
        <h1 className="text-[22px] font-black leading-tight mb-2 tracking-tight uppercase">
          {user.name || `@${user.username}`}
        </h1>
        
        {user.bio && (
          <p className={`text-[15px] font-medium text-center leading-relaxed ${themeColors.text} opacity-70 max-w-[400px] mb-12`}>
            {user.bio}
          </p>
        )}

        {/* BUTTON STACK */}
        <div className="w-full space-y-4">
          {user.links.length === 0 ? (
            <div className={`text-center py-20 bg-white/[0.01] border border-dashed ${themeColors.border} rounded-3xl opacity-40 text-[13px] font-bold`}>
              No links available.
            </div>
          ) : (
            user.links.map((link) => (
              <PublicLinkButton key={link.id} link={link as any} themeColors={themeColors} />
            ))
          )}
        </div>



        {/* LOGO */}
        <div className={`mt-32 pb-8 flex flex-col items-center ${themeColors.text} opacity-20`}>
          <div className="text-[12px] font-black tracking-[6px] uppercase hover:opacity-100 transition-opacity cursor-default">
            onelink
          </div>
        </div>
      </main>
      {/* FIXED SOCIAL FOOTER */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center backdrop-blur-md bg-black/20 border-t ${themeColors.border}`}>
        {socialPlatforms.some(p => socials[p.id]) && (
          <div className="flex justify-center gap-8 px-6 pt-4 pb-2">
            {socialPlatforms.map(platform => socials[platform.id] && (
              <a
                key={platform.id}
                href={platform.id === 'website' ? socials[platform.id] : `https://${platform.id}.com/${socials[platform.id]}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${themeColors.text} opacity-50 hover:opacity-100 transition-all hover:scale-125 active:scale-95`}
              >
                <platform.icon size={20} />
              </a>
            ))}
          </div>
        )}
        <div className={`text-[10px] font-black tracking-[5px] uppercase pb-3 pt-1 ${themeColors.text} opacity-20`}>
          onelink
        </div>
      </div>
    </div>
  );
}

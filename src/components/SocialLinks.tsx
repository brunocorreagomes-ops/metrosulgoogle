import { useState } from "react";
import { Instagram, Youtube, Mail, Check, Copy, Share2, Compass, Disc } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, translations } from "../locales";

interface SocialLinksProps {
  lang: Language;
}

interface SocialItem {
  name: string;
  url: string;
  handle: string;
  icon: any;
  platformColor: string;
}

const METRO_SOCIALS: SocialItem[] = [
  {
    name: "Instagram",
    url: "https://instagram.com/metrosulofficial",
    handle: "@metrosulofficial",
    icon: Instagram,
    platformColor: "hover:text-[#e1306c] hover:border-[#e1306c]/30 hover:bg-[#e1306c]/5"
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@metrosulofficial",
    handle: "@metrosulofficial",
    icon: Youtube,
    platformColor: "hover:text-[#ff0000] hover:border-[#ff0000]/30 hover:bg-[#ff0000]/5"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@metrosulofficial",
    handle: "@metrosulofficial",
    icon: (props: any) => (
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
      >
        <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M15 2v10a4 4 0 0 1-4 4" />
        <path d="M15 8a4 4 0 0 0 4 4" />
      </svg>
    ),
    platformColor: "hover:text-[#00f2fe] hover:border-[#00f2fe]/30 hover:bg-[#00f2fe]/5"
  }
];

export default function SocialLinks({ lang }: SocialLinksProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const emailAddress = "brunocorreagomes@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full z-10 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Direct Email contact hub card */}
        <div className="md:col-span-7 rounded-lg border border-white/5 bg-[#07111F]/50 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle gradient light flare */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#009DFF]/10 to-transparent blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mail size={13} className="text-[#009DFF]" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-[#009DFF] uppercase">{translations[lang].contactCardLabel}</span>
            </div>
            
            <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2 uppercase">
              {translations[lang].contactCardTitle}
            </h3>
            <p className="font-sans text-xs text-neutral-400 max-w-md leading-relaxed mb-6 font-light">
              {translations[lang].contactCardDesc}
            </p>

            {/* Founder, Producer, and Artist Badge */}
            <div className="mb-6 p-4 rounded-lg bg-black/35 border border-white/5 flex flex-col justify-center">
              <span className="block font-mono text-[8px] text-[#009DFF] uppercase tracking-widest mb-1.5 font-bold">
                {lang === "pt" ? "FUNDADOR, PRODUTOR & ARTISTA" : lang === "es" ? "FUNDADOR, PRODUCTOR Y ARTISTA" : "FOUNDER, PRODUCER & ARTIST"}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-bold tracking-wider text-white">BRUNO GOMES</span>
                <span className="inline-block w-1.5 h-1.5 bg-[#009DFF] rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a 
              href={`mailto:${emailAddress}`}
              className="flex-1 px-5 py-3 rounded-md bg-black/40 border border-white/5 hover:border-white/15 text-xs font-mono text-white flex items-center justify-between group transition-colors"
            >
              <span className="truncate tracking-wider">{emailAddress}</span>
              <Mail size={12} className="text-neutral-500 group-hover:text-[#009DFF] transition-colors ml-2 shrink-0" />
            </a>

            <button
              onClick={handleCopyEmail}
              className="px-5 py-3 rounded-md border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono tracking-widest text-white transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />
                  {translations[lang].contactCardCopied}
                </>
              ) : (
                <>
                  <Copy size={12} className="text-neutral-400" />
                  {translations[lang].contactCardCopy}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Triple social link list */}
        <div className="md:col-span-5 flex flex-col justify-between gap-3">
          {METRO_SOCIALS.map((soc) => {
            const IconComponent = soc.icon;
            
            return (
              <a
                key={soc.name}
                href={soc.url}
                target="_blank"
                rel="no-referrer"
                className={`flex-1 p-5 rounded-lg border border-white/5 bg-[#07111F]/30 flex items-center justify-between group transition-all duration-150 ${soc.platformColor}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded bg-white/[0.01] border border-white/5 group-hover:bg-transparent group-hover:border-current transition-all">
                    <IconComponent size={16} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                      {soc.name}
                    </span>
                    <span className="font-mono text-xs font-medium text-white tracking-widest uppercase">
                      {soc.handle}
                    </span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-white/[0.01] border border-white/5 text-neutral-600 group-hover:text-current group-hover:border-current group-hover:translate-x-1 transition-all duration-200">
                  <Share2 size={11} />
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
}

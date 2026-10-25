"use client";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
}

interface FooterProps {
  socialLinks: SocialLink[];
}

const platformIcons: Record<string, string> = {
  LinkedIn: "🔗",
  GitHub: "🐙",
  TikTok: "🎵",
  Instagram: "📷",
  WhatsApp: "💬",
  X: "🐦",
  Facebook: "📘",
};

export default function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="border-t border-white/10 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap justify-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:text-white"
            >
              <span className="text-xl">{platformIcons[link.platform] || "🔗"}</span>
              <span className="text-sm">{link.platform}</span>
            </a>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ayoub Osama Ayoub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

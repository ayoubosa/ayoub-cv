"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-xl p-6 transition-all duration-300 ${
        hover ? "hover:scale-[1.02] hover:shadow-xl" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

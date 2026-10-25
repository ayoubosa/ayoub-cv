"use client";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function GradientButton({
  children,
  onClick,
  href,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}: GradientButtonProps) {
  const base = "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all duration-300";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    outline: "border border-white/20 text-white hover:bg-white/5",
  };

  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} type={type} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

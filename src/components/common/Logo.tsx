import logoBadge from "@/assets/logo-badge.png";
import logoMark from "@/assets/logo-mark.png";

interface LogoProps {
  iconSize?: number;
  showText?: boolean;
  textClassName?: string;
  className?: string;
  variant?: "badge" | "mark";
}

export function Logo({
  iconSize = 32,
  showText = true,
  textClassName = "text-lg text-foreground",
  className = "",
  variant = "badge",
}: LogoProps) {
  const src = variant === "badge" ? logoBadge : logoMark;

  return (
    <div className={`flex items-center gap-2.5 justify-center ${className}`}>
      <img
        src={src}
        alt="Ranky AI"
        width={iconSize}
        height={iconSize}
        style={{ width: iconSize, height: iconSize }}
        className={`shrink-0 object-contain ${variant === "badge" ? "rounded-[9px]" : ""}`}
      />
      {showText && (
        <span className={`font-semibold uppercase tracking-tight ${textClassName}`}>Ranky AI</span>
      )}
    </div>
  );
}

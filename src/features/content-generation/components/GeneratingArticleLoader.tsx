import { Bot, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading through the source material…",
  "Outlining the article structure…",
  "Writing an attention-grabbing intro…",
  "Drafting the main sections…",
  "Sprinkling in SEO keywords…",
  "Polishing the tone and flow…",
  "Adding finishing touches…",
];

export function GeneratingArticleLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-10 text-center">
      <div className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="absolute inset-2 animate-pulse rounded-full bg-primary/10" />
        <div className="relative flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Bot className="size-7 animate-bounce" />
        </div>
        <Sparkles className="absolute -right-1 -top-1 size-5 text-muted-foreground" />
      </div>

      <div className="flex items-end gap-1" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-primary/70"
            style={{
              height: "8px",
              animation: `ai-writing-bar 1s ease-in-out ${i * 0.12}s infinite`,
            }}
          />
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Writing your article…</h3>
        <p className="mt-1 min-h-5 text-sm text-muted-foreground transition-all duration-300">
          {MESSAGES[messageIndex]}
        </p>
      </div>

      <style>{`
        @keyframes ai-writing-bar {
          0%, 100% { height: 8px; opacity: 0.5; }
          50% { height: 24px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

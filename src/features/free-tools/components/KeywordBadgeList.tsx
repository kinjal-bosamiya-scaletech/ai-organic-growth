import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CHANCE_BINS, binOf, chancePercent, volumeRangeOf } from "@/features/free-tools/lib/keywordChance";
import type { BestKeywordCategory } from "@/types/bestKeywords";

interface KeywordBadgeListProps {
  domain: string;
  categories: BestKeywordCategory[];
}

export function KeywordBadgeList({ domain, categories }: Readonly<KeywordBadgeListProps>) {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const { minVolume, maxVolume } = useMemo(() => volumeRangeOf(categories), [categories]);
  const volumeRange = Math.max(1, maxVolume - minVolume);

  const handleCopyKeyword = async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopiedKeyword(keyword);
      toast.success(`Copied "${keyword}"`);
      setTimeout(() => setCopiedKeyword((current) => (current === keyword ? null : current)), 1400);
    } catch {
      toast.error("Couldn't copy — select and copy the text manually.");
    }
  };

  return (
    <div className="flex flex-col gap-5" aria-label={`AI-suggested keyword opportunities for ${domain}`}>
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span className="text-2xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Chance to rank
          </span>
          {(["Low", "Medium", "High"] as const).map((bin) => (
            <span key={bin} className="flex items-center gap-1.5 text-xs text-foreground">
              <span
                className="size-2.5 shrink-0 rounded-full border"
                style={{ backgroundColor: CHANCE_BINS[bin].bg, borderColor: CHANCE_BINS[bin].border }}
              />
              {bin} · {bin === "Low" ? "<55%" : bin === "Medium" ? "55–79%" : "≥80%"}
            </span>
          ))}
        </div>
        <p className="max-w-[60ch] text-center text-xs text-muted-foreground">
          Each badge is a keyword, colored by its AI-estimated chance of ranking. Select any keyword to copy it.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">{category.title}</h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => {
                const chanceT = (item.volume - minVolume) / volumeRange;
                const chancePct = chancePercent(chanceT);
                const bin = binOf(chancePct);
                const { bg, ink, border } = CHANCE_BINS[bin];
                const isCopied = copiedKeyword === item.keyword;

                return (
                  <button
                    key={item.keyword}
                    type="button"
                    onClick={() => handleCopyKeyword(item.keyword)}
                    aria-label={`${item.keyword} — ${category.title}, ${bin.toLowerCase()} chance to rank, about ${chancePct}%. Press Enter to copy.`}
                    title={`${bin} chance · ~${chancePct}%`}
                    style={{ backgroundColor: bg, color: ink, borderColor: border }}
                    className="group/kw-badge inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-[filter,box-shadow] outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {isCopied ? (
                      <>
                        <Check className="size-3" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        {item.keyword}
                        <Copy
                          className="size-3 opacity-0 transition-opacity group-hover/kw-badge:opacity-70"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

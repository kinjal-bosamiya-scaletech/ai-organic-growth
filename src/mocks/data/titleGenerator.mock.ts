import type { TitleGenerationResult } from "@/types/titleGenerator";

// Deterministic mock titles built from the keyword, mirroring the spread of
// real search intents the real prompt researches (best-of, product/benefit,
// buying guide, comparison, how-it-works) — purely for local/mocked development.
export function buildTitleGenerationMock(
  keyword: string,
  count = 10,
  excludeTitles: string[] = [],
): TitleGenerationResult {
  const term = keyword.trim();
  const titled = term
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const templates = [
    `Best ${titled} in 2026 - Top Picks Compared | GuidePro`,
    `${titled} - Premium Quality, Fast Shipping | PureSupply`,
    `${titled} Buying Guide: What to Look for Before You Order`,
    `${titled} vs the Alternatives: Which Is Right for You?`,
    `What Is ${titled}? A Beginner's Guide | LearnHub`,
    `Top-Rated ${titled} Options Reviewed for 2026`,
    `${titled} 101: Everything First-Time Buyers Should Know`,
    `How to Choose the Right ${titled} for Your Needs`,
    `${titled}: Pros, Cons, and What Sets the Best Apart`,
    `Where to Find Quality ${titled} at the Best Price`,
  ];

  const excluded = new Set(excludeTitles);
  const available = templates.filter((title) => !excluded.has(title));

  return { titles: available.slice(0, count) };
}

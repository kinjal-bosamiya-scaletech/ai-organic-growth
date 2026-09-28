import type { BestKeywordsResult } from "@/types/bestKeywords";

const ITEMS_PER_CATEGORY = 4;

const CATEGORY_TEMPLATES: Array<{ title: (topic: string) => string; items: (topic: string) => string[] }> = [
  {
    title: (topic) => `Beginner's guide to ${topic}`,
    items: (topic) => [
      `how to start with ${topic}`,
      `${topic} for beginners`,
      `what is ${topic}`,
      `${topic} basics explained`,
      `getting started with ${topic}`,
      `${topic} for dummies`,
    ],
  },
  {
    title: (topic) => `Best ${topic} under $20`,
    items: (topic) => [
      `cheap ${topic}`,
      `affordable ${topic}`,
      `best budget ${topic}`,
      `${topic} deals`,
      `${topic} discount code`,
      `low cost ${topic}`,
    ],
  },
  {
    title: (topic) => `${topic} vs alternatives`,
    items: (topic) => [
      `${topic} alternatives`,
      `${topic} vs competitors`,
      `is ${topic} worth it`,
      `${topic} comparison`,
      `switching from ${topic}`,
      `${topic} pros and cons`,
    ],
  },
  {
    title: (topic) => `How to choose the right ${topic}`,
    items: (topic) => [
      `${topic} buying guide`,
      `best ${topic} features`,
      `${topic} checklist`,
      `top rated ${topic}`,
      `${topic} for small business`,
      `${topic} setup guide`,
    ],
  },
  {
    title: (topic) => `${topic} pricing explained`,
    items: (topic) => [
      `${topic} pricing`,
      `${topic} cost`,
      `${topic} plans compared`,
      `${topic} free trial`,
      `${topic} subscription`,
      `${topic} pricing 2026`,
    ],
  },
  {
    title: (topic) => `${topic} reviews`,
    items: (topic) => [
      `${topic} reviews`,
      `${topic} customer reviews`,
      `is ${topic} legit`,
      `${topic} testimonials`,
      `${topic} rating`,
      `${topic} complaints`,
    ],
  },
  {
    title: (topic) => `${topic} tips and tricks`,
    items: (topic) => [
      `${topic} tips`,
      `${topic} best practices`,
      `advanced ${topic} techniques`,
      `${topic} mistakes to avoid`,
      `${topic} hacks`,
      `${topic} shortcuts`,
    ],
  },
  {
    title: (topic) => `${topic} near me`,
    items: (topic) => [
      `${topic} near me`,
      `local ${topic}`,
      `${topic} services`,
      `${topic} providers`,
      `${topic} store`,
      `${topic} online`,
    ],
  },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pseudoVolume(seed: number, categoryIndex: number, itemIndex: number): number {
  const mixed = (seed + categoryIndex * 977 + itemIndex * 131) >>> 0;
  return 200 + (mixed % 4800);
}

function parseUrl(rawUrl: string): { domain: string; topic: string } {
  let hostname = rawUrl.trim();
  try {
    hostname = new URL(/^https?:\/\//i.test(hostname) ? hostname : `https://${hostname}`).hostname;
  } catch {
    // fall back to the raw input if it can't be parsed as a URL
  }

  const domain = hostname.replace(/^www\./i, "");
  const mainLabel = domain.split(".")[0] ?? domain;
  const topic = mainLabel.replace(/[-_]+/g, " ").trim() || "this website";

  return { domain, topic };
}

export function buildBestKeywordsMock(rawUrl: string): BestKeywordsResult {
  const { domain, topic } = parseUrl(rawUrl);
  const seed = hashString(domain);

  const categories = CATEGORY_TEMPLATES.map((template, categoryIndex) => {
    const keywords = template.items(topic).slice(0, ITEMS_PER_CATEGORY);
    const items = keywords.map((keyword, itemIndex) => ({
      keyword,
      volume: pseudoVolume(seed, categoryIndex, itemIndex),
    }));

    return {
      id: `category-${categoryIndex}`,
      title: template.title(topic),
      items,
    };
  });

  return { url: rawUrl, domain, topic, categories };
}

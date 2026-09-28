import type { ChatMessage, ChatSuggestion } from "@/types/chat";

export function getInitialChatMessage(name: string): ChatMessage {
  return {
    id: "msg-welcome",
    role: "ai",
    text: `Hi ${name} — I'm **Ranky AI**, your SEO assistant. I'm connected to live Search Console data for your site and can help you:\n- Diagnose **indexing & crawl** issues\n- Find **keyword** opportunities close to page one\n- Track **Core Web Vitals** and site speed\n- Compare you to **competitors**\n- Explain **traffic** changes\n\nAsk me anything, or tap a suggestion below to get started.`,
  };
}

export const chatSuggestionsMock: ChatSuggestion[] = [
  { id: "sugg-indexing", label: "Why aren't my pages indexed?", question: "Why aren't my pages indexed?" },
  { id: "sugg-keywords", label: "Which keywords are close to page one?", question: "Which keywords are close to page one?" },
  { id: "sugg-speed", label: "How's my site speed?", question: "How's my site speed?" },
];

interface AiReply {
  text: string;
  actions: string[];
}

/**
 * Ported from the design prototype's `aiReply(q)` — keyword-matched canned
 * responses standing in for a real LLM/agent backend.
 */
export function getAiReply(question: string, domain: string): AiReply {
  const text = question.toLowerCase();

  if (/index|crawl|not indexed|coverage/.test(text)) {
    return {
      text: "You have 34 product pages excluded from Google's index — mostly “Crawled – currently not indexed”. That's your single biggest quick win: those pages can't rank at all right now, and fixing them could lift clicks by ~18%.",
      actions: [
        "Audit the 34 excluded URLs in the Indexing report",
        "Add unique titles + meta descriptions and expand thin content",
        "Add internal links from high-authority category pages",
        "Resubmit the pages via the URL Inspection API",
      ],
    };
  }

  if (/keyword|rank|position|page one|page 1|striking/.test(text)) {
    return {
      text: "12 keywords are sitting in “striking distance” at positions #11–#15 — small on-page nudges can push them onto page one, where CTR jumps sharply. Separately, “cold brew maker” dropped from #4 to #11 and is worth prioritising.",
      actions: [
        "Add the exact query to each page's title tag",
        "Expand sections that only partially answer intent",
        "Add 2–3 internal links from related guides",
        "Refresh the “cold brew maker” page with 2026 data",
      ],
    };
  }

  if (/speed|vital|lcp|slow|performance|inp|cls|mobile/.test(text)) {
    return {
      text: "Core Web Vitals are your weakest area at 52/100. Mobile LCP is 3.9s and 62% of mobile URLs fail the threshold — this hurts mobile-first rankings and increases bounce.",
      actions: [
        "Serve hero images as WebP/AVIF with explicit dimensions",
        "Preload the LCP image and defer non-critical JS",
        "Enable a CDN and cache static assets",
      ],
    };
  }

  if (/competitor|bluebottle|beat|rival|gap/.test(text)) {
    return {
      text: "Bluebottlecoffee.com leads your space on visibility (82 vs your 46). They rank for ~2,400 keywords you don't target — mostly brewing guides and equipment reviews. Capturing the top 40 could add ~22K monthly clicks.",
      actions: [
        "Build guide content around brewing methods & equipment",
        "Target their high-overlap, low-difficulty keywords first",
        "Earn links from the same referring domains",
      ],
    };
  }

  if (/click|traffic|drop|down|fell|decline|region|country|geograph|map/.test(text)) {
    return {
      text: "Overall clicks are up 12.4% (18,240 in 28 days). The US drives 45% of them. Two soft spots stand out geographically: Germany and India have high impressions but below-average CTR, so better localisation there is a clear opportunity.",
      actions: [
        "Localise titles & meta for DE and IN queries",
        "Recover the “cold brew maker” ranking (~9K clicks/mo)",
        "Fix the 34 non-indexed pages to widen coverage",
      ],
    };
  }

  return {
    text: `Here's where I'd focus for ${domain}: SEO health is 72/100 (Fair). The fastest gains are fixing 34 non-indexed pages, recovering the “cold brew maker” ranking, and improving mobile LCP. Want me to break any of these down?`,
    actions: ["Fix indexing — biggest quick win", "Recover lost rankings", "Improve Core Web Vitals"],
  };
}

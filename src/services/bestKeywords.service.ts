import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { buildBestKeywordsMock } from "@/mocks/data/bestKeywords.mock";
import httpService from "@/services/http.service";
import type { BestKeywordsResult } from "@/types/bestKeywords";

// Future backend contract:
//   POST /best-keywords { url } -> BestKeywordsResult

export async function findBestKeywords(url: string): Promise<BestKeywordsResult> {
  if (USE_MOCKS) return mockDelay(buildBestKeywordsMock(url), 1200);
  return httpService.post<BestKeywordsResult>(API_CONFIG.bestKeywords, { url });
}

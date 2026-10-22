import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { buildBuiltWithMock } from "@/mocks/data/builtWith.mock";
import httpService from "@/services/http.service";
import type { BuiltWithResult } from "@/types/builtWith";

// Future backend contract:
//   POST /built-with { url } -> BuiltWithResult

export async function runBuiltWith(url: string): Promise<BuiltWithResult> {
  if (USE_MOCKS) return mockDelay(buildBuiltWithMock(url), 1200);
  return httpService.post<BuiltWithResult>(API_CONFIG.builtWith, { url });
}

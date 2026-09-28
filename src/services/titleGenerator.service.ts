import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { buildTitleGenerationMock } from "@/mocks/data/titleGenerator.mock";
import httpService from "@/services/http.service";
import type { TitleGenerationResult } from "@/types/titleGenerator";

// Future backend contract:
//   POST /projects/:id/title-generator { keyword, count?, excludeTitles? } -> TitleGenerationResult

export async function generateTitles(
  projectId: string,
  keyword: string,
  count = 10,
  excludeTitles: string[] = [],
): Promise<TitleGenerationResult> {
  if (USE_MOCKS) return mockDelay(buildTitleGenerationMock(keyword, count, excludeTitles), 1000);
  return httpService.post<TitleGenerationResult>(API_CONFIG.titleGenerator(projectId), {
    keyword,
    count,
    excludeTitles,
  });
}

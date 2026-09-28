import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { buildContentGenerationMock, buildEditContentMock, buildPlagiarismMock } from "@/mocks/data/contentGeneration.mock";
import httpService from "@/services/http.service";
import type { GeneratedContent, PlagiarismResult } from "@/types/contentGeneration";

// Future backend contract:
//   POST /projects/:id/content-generation            { url }   -> GeneratedContent
//   POST /projects/:id/content-generation/from-title  { title } -> GeneratedContent
//   POST /projects/:id/content-generation/plagiarism-check { text } -> PlagiarismResult
//   POST /projects/:id/content-generation/edit             { content, instruction } -> GeneratedContent

export async function generateContent(projectId: string, url: string): Promise<GeneratedContent> {
  if (USE_MOCKS) return mockDelay(buildContentGenerationMock(url), 1400);
  return httpService.post<GeneratedContent>(API_CONFIG.contentGeneration(projectId), { url });
}

// Generates a full article straight from a title/topic, with no product page involved.
export async function generateContentFromTitle(projectId: string, title: string): Promise<GeneratedContent> {
  if (USE_MOCKS) return mockDelay({ ...buildContentGenerationMock(""), productUrl: "", blogTitle: title }, 1400);
  return httpService.post<GeneratedContent>(API_CONFIG.contentGenerationFromTitle(projectId), { title });
}

// Runs a free plagiarism spot-check (Serper quote-matching) — only call this
// on explicit user action to stay within the free query allowance.
export async function checkPlagiarism(projectId: string, text: string): Promise<PlagiarismResult> {
  if (USE_MOCKS) return mockDelay(buildPlagiarismMock(text), 1200);
  return httpService.post<PlagiarismResult>(API_CONFIG.contentGenerationPlagiarism(projectId), { text });
}

// Sends the current article plus a plain-English instruction (e.g. "make the intro shorter")
// and gets back the full article with only the requested change applied.
export async function editContent(
  projectId: string,
  content: GeneratedContent,
  instruction: string,
): Promise<GeneratedContent> {
  if (USE_MOCKS) return mockDelay(buildEditContentMock(content, instruction), 1100);
  return httpService.post<GeneratedContent>(API_CONFIG.contentGenerationEdit(projectId), { content, instruction });
}

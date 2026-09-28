import { useMutation } from "@tanstack/react-query";
import {
  checkPlagiarism,
  editContent,
  generateContent,
  generateContentFromTitle,
} from "@/services/contentGeneration.service";
import type { GeneratedContent } from "@/types/contentGeneration";

export function useGenerateContent(projectId: string) {
  return useMutation({
    mutationFn: (url: string) => generateContent(projectId, url),
  });
}

export function useGenerateContentFromTitle(projectId: string) {
  return useMutation({
    mutationFn: (title: string) => generateContentFromTitle(projectId, title),
  });
}

export function useCheckPlagiarism(projectId: string) {
  return useMutation({
    mutationFn: (text: string) => checkPlagiarism(projectId, text),
  });
}

export function useEditContent(projectId: string) {
  return useMutation({
    mutationFn: ({ content, instruction }: { content: GeneratedContent; instruction: string }) =>
      editContent(projectId, content, instruction),
  });
}

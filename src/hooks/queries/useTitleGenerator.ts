import { useMutation } from "@tanstack/react-query";
import { generateTitles } from "@/services/titleGenerator.service";

export function useGenerateTitles(projectId: string) {
  return useMutation({
    mutationFn: ({ keyword, count, excludeTitles }: { keyword: string; count?: number; excludeTitles?: string[] }) =>
      generateTitles(projectId, keyword, count, excludeTitles),
  });
}

import { useMutation } from "@tanstack/react-query";
import { findBestKeywords } from "@/services/bestKeywords.service";

export function useBestKeywords() {
  return useMutation({
    mutationFn: (url: string) => findBestKeywords(url),
  });
}

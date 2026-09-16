import { useContext } from "react";
import { AiAssistantContext } from "@/context/AiAssistantContext";
import type { AiAssistantContextValue } from "@/context/AiAssistantContext";

export function useAiAssistant(): AiAssistantContextValue {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) throw new Error("useAiAssistant must be used within an AiAssistantProvider");
  return ctx;
}

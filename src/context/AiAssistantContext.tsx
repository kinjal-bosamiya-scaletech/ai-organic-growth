import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface AiAssistantContextValue {
  isOpen: boolean;
  /**
   * A question queued by a contextual AI action ("Explain this issue"). The
   * chat widget reads it once on open and then clears it.
   */
  pendingPrompt: string | null;
  /** Opens the assistant, optionally seeding it with a question to ask. */
  open: (prompt?: string) => void;
  close: () => void;
  /** Called by the widget after it has sent `pendingPrompt`. */
  consumePendingPrompt: () => void;
}

export const AiAssistantContext = createContext<AiAssistantContextValue | null>(null);

/**
 * Lifts the chat widget's open state so any page can hand it a question.
 *
 * This is presentation state only — the message transport is still
 * `useSendChatMessage`, untouched. It exists so "Explain this issue", "Why is my
 * competitor ranking higher?" and friends route into the assistant that already
 * exists rather than each page growing its own AI panel.
 */
export function AiAssistantProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const open = useCallback((prompt?: string) => {
    if (prompt) setPendingPrompt(prompt);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Drop an unsent prompt, so re-opening by hand doesn't fire a stale question.
    setPendingPrompt(null);
  }, []);

  const consumePendingPrompt = useCallback(() => setPendingPrompt(null), []);

  const value = useMemo<AiAssistantContextValue>(
    () => ({ isOpen, pendingPrompt, open, close, consumePendingPrompt }),
    [isOpen, pendingPrompt, open, close, consumePendingPrompt],
  );

  return <AiAssistantContext.Provider value={value}>{children}</AiAssistantContext.Provider>;
}

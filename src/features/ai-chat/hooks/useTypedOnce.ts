import { useCallback, useRef } from "react";

/**
 * Remembers which AI messages have already played their typewriter reveal.
 *
 * Chat lives inside a Sheet and Radix unmounts sheet content on close, so
 * without this every reply in the history retypes itself from scratch each
 * time the panel is reopened. The set lives in the always-mounted widget —
 * one per chat, so ids from different chats can't collide.
 */
export function useTypedOnce() {
  const typedIds = useRef<Set<string>>(new Set());

  const hasTyped = useCallback((id: string) => typedIds.current.has(id), []);
  const markTyped = useCallback((id: string) => {
    typedIds.current.add(id);
  }, []);

  return { hasTyped, markTyped };
}

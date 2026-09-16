import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import ChatMessageBubble from "@/features/ai-chat/components/ChatMessageBubble";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isThinking: boolean;
  /** False for replies that already typed themselves out on an earlier open. */
  shouldAnimate: (id: string) => boolean;
  onTyped: (id: string) => void;
}

export function ChatMessageList({ messages, isThinking, shouldAnimate, onTyped }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Messages type out progressively, so the content height keeps growing
    // after the initial render — watch it and keep the view pinned to bottom.
    const observer = new ResizeObserver(() => {
      container.scrollTop = container.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto p-5.5">
      <div ref={contentRef} className="flex flex-col gap-4">
        {messages.map((message) => (
          <ChatMessageBubble
            key={message.id}
            message={message}
            animate={shouldAnimate(message.id)}
            onTyped={onTyped}
          />
        ))}
        {isThinking ? (
          <div className="flex items-start gap-2.5">
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground">
              <Bot className="size-4" />
            </span>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3.5">
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]" />
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

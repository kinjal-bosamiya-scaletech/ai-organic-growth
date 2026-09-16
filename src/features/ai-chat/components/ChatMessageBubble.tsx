import { Bot, Check } from "lucide-react";
import { useEffect } from "react";
import { Markdown } from "@/components/common/Markdown";
import { useTypewriter } from "@/features/ai-chat/hooks/useTypewriter";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  /** False shows the reply in full straight away — how history should read. */
  animate?: boolean;
  /** Fired once the reveal finishes, so the caller can stop replaying it. */
  onTyped?: (id: string) => void;
}

const ChatMessageBubble = ({ message, animate = true, onTyped }: ChatMessageBubbleProps) => {
  const isAi = message.role === "ai";
  const shouldType = isAi && animate;
  const { displayedText, isTyping } = useTypewriter(message.text, shouldType);

  useEffect(() => {
    if (shouldType && !isTyping) onTyped?.(message.id);
  }, [shouldType, isTyping, message.id, onTyped]);

  return (
    <div className={cn("flex items-start gap-2.5", isAi ? "" : "flex-row-reverse")}>
      {isAi ? (
        <span className="mt-0.5 flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed",
          isAi ? "rounded-tl-sm bg-muted text-foreground" : "rounded-tr-sm bg-primary text-primary-foreground whitespace-pre-wrap",
        )}
      >
        {isAi ? (
          <Markdown text={displayedText} showCursor={isTyping} />
        ) : (
          <div>{message.text}</div>
        )}
        {message.actions && message.actions.length > 0 && !isTyping ? (
          <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-3">
            {message.actions.map((action) => (
              <div key={action} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-positive" strokeWidth={2.4} />
                <span className="text-sm leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatMessageBubble;

import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChatComposer } from "@/features/ai-chat/components/ChatComposer";
import { ChatMessageList } from "@/features/ai-chat/components/ChatMessageList";
import { useTypedOnce } from "@/features/ai-chat/hooks/useTypedOnce";
import { useAuth } from "@/hooks/useAuth";
import { useSendChatMessage } from "@/hooks/queries/useChat";
import { getInitialChatMessage } from "@/mocks/data/chat.mock";
import type { ChatMessage } from "@/types/chat";
import type { Project } from "@/types/project";

interface AiChatWidgetProps {
  project: Project;
}

const BUTTON_SIZE = 56;
const EDGE_MARGIN = 12;
const DRAG_THRESHOLD = 6;
const POSITION_STORAGE_KEY = "organiq-ai-chat-widget-position";

interface Position {
  x: number;
  y: number;
}

function clampPosition({ x, y }: Position): Position {
  const maxX = window.innerWidth - BUTTON_SIZE - EDGE_MARGIN;
  const maxY = window.innerHeight - BUTTON_SIZE - EDGE_MARGIN;
  return { x: Math.min(Math.max(x, EDGE_MARGIN), Math.max(maxX, EDGE_MARGIN)), y: Math.min(Math.max(y, EDGE_MARGIN), Math.max(maxY, EDGE_MARGIN)) };
}

function getInitialPosition(): Position {
  try {
    const stored = localStorage.getItem(POSITION_STORAGE_KEY);
    if (stored) return clampPosition(JSON.parse(stored));
  } catch {
    // ignore malformed/unavailable storage and fall back to the default corner
  }
  return clampPosition({ x: window.innerWidth - BUTTON_SIZE - 24, y: window.innerHeight - BUTTON_SIZE - 32 });
}

export function AiChatWidget({ project }: AiChatWidgetProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const sendMessage = useSendChatMessage();
  const { hasTyped, markTyped } = useTypedOnce();
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialChatMessage(user?.fullName ?? "there")]);
  const [draft, setDraft] = useState("");
  const [position, setPosition] = useState<Position>(getInitialPosition);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; dragged: boolean } | null>(null);

  useEffect(() => {
    const handleResize = () => setPosition((prev) => clampPosition(prev));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y, dragged: false };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    drag.dragged = true;
    setPosition(clampPosition({ x: drag.originX + dx, y: drag.originY + dy }));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;

    if (!drag) return;

    if (drag.dragged) {
      setPosition((prev) => {
        try {
          localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(prev));
        } catch {
          // storage may be unavailable (e.g. private browsing) — position just won't persist
        }
        return prev;
      });
    } else {
      setOpen(true);
    }
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sendMessage.isPending) return;

    setMessages((prev) => [...prev, { id: `msg-${prev.length}-user`, role: "user", text: trimmed }]);
    setDraft("");

    sendMessage.mutate(
      { projectId: project.id, text: trimmed, domain: project.domain },
      { onSuccess: (reply) => setMessages((prev) => [...prev, reply]) },
    );
  };

  return (
    <>
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title="Ask Ranky AI · drag to move"
        style={{ left: position.x, top: position.y }}
        className="fixed z-40 flex size-14 cursor-grab touch-none items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:cursor-grabbing"
      >
        <Bot className="size-6" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 data-[side=right]:sm:max-w-[600px]">
          <SheetHeader className="flex-row items-center gap-2.5 border-b border-border">
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] bg-primary text-primary-foreground">
              <Bot className="size-[18px]" />
            </span>
            <div>
              <SheetTitle>Ranky AI</SheetTitle>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Online · SEO Assistant
              </div>
            </div>
          </SheetHeader>
          <ChatMessageList
            messages={messages}
            isThinking={sendMessage.isPending}
            shouldAnimate={(id) => !hasTyped(id)}
            onTyped={markTyped}
          />
          <ChatComposer
            draft={draft}
            onDraftChange={setDraft}
            onSend={() => submit(draft)}
            onSuggestion={submit}
            disabled={sendMessage.isPending}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

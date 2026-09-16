import { SendHorizontal, Wand2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import ChatMessageBubble from "@/features/ai-chat/components/ChatMessageBubble";
import { useTypedOnce } from "@/features/ai-chat/hooks/useTypedOnce";
import { useEditContent } from "@/hooks/queries/useContentGeneration";
import type { GeneratedContent } from "@/types/contentGeneration";
import type { ChatMessage } from "@/types/chat";

interface ArticleEditChatCardProps {
  projectId: string;
  content: GeneratedContent;
  onContentChange: (content: GeneratedContent) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "edit-welcome",
  role: "ai",
  text: "Want a small change to this article? Tell me what to update — e.g. \"make the intro shorter\" or \"add a sentence about warranty\" — and I'll update the article for you.",
};

export function ArticleEditChatCard({ projectId, content, onContentChange, open, onOpenChange }: ArticleEditChatCardProps) {
  const editContent = useEditContent(projectId);
  const { hasTyped, markTyped } = useTypedOnce();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || editContent.isPending) return;

    setMessages((prev) => [...prev, { id: `edit-msg-${prev.length}-user`, role: "user", text: trimmed }]);
    setDraft("");

    editContent.mutate(
      { content, instruction: trimmed },
      {
        onSuccess: (updated) => {
          onContentChange(updated);
          setMessages((prev) => [
            ...prev,
            { id: `edit-msg-${prev.length}-ai`, role: "ai", text: "Done — I've updated the article with that change." },
          ]);
        },
        onError: (error) => {
          setMessages((prev) => [
            ...prev,
            {
              id: `edit-msg-${prev.length}-ai`,
              role: "ai",
              text: error instanceof Error ? error.message : "Sorry, I couldn't apply that change. Try again?",
            },
          ]);
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
              <Wand2 className="size-[18px]" />
            </span>
            <div>
              <SheetTitle>Edit With AI</SheetTitle>
              <SheetDescription>Describe a change and I'll update the article.</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          {messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              animate={!hasTyped(message.id)}
              onTyped={markTyped}
            />
          ))}
          {editContent.isPending ? (
            <div className="flex items-start gap-2.5">
              <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground">
                <Wand2 className="size-4" />
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3.5">
                <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
                <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]" />
                <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-border py-1 pr-1 pl-3.5 mx-4 mb-4">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit(draft);
              }
            }}
            disabled={editContent.isPending}
            placeholder="Describe the change you want…"
            className="border-none bg-transparent shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={() => submit(draft)}
            disabled={editContent.isPending || !draft.trim()}
            className="flex size-[38px] shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground disabled:opacity-50"
          >
            <SendHorizontal className="size-[18px]" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

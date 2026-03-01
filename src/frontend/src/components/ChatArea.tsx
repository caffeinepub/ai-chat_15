import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "../hooks/useQueries";
import { ChatInput } from "./ChatInput";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { WelcomeScreen } from "./WelcomeScreen";

interface ChatAreaProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  isTyping: boolean;
  conversationId: bigint | null;
  onSendMessage: (content: string) => void;
  inputDisabled?: boolean;
}

export function ChatArea({
  messages,
  isLoading,
  isTyping,
  conversationId,
  onSendMessage,
  inputDisabled,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  // Auto-scroll when messages change
  useEffect(() => {
    const count = messages?.length ?? 0;
    if (count !== prevMessageCount) {
      setPrevMessageCount(count);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, prevMessageCount]);

  // Also scroll when typing indicator appears
  useEffect(() => {
    if (isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isTyping]);

  const handleSuggestion = useCallback(
    (text: string) => {
      onSendMessage(text);
    },
    [onSendMessage],
  );

  const isEmpty = !conversationId;
  const hasMessages = messages && messages.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 chat-bg">
      {/* Messages area */}
      {isEmpty ? (
        <WelcomeScreen onSuggestion={handleSuggestion} />
      ) : isLoading ? (
        <div className="flex-1 px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
          {(["sk-a", "sk-b", "sk-c"] as const).map((id, i) => (
            <div
              key={id}
              className={`flex gap-3 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <Skeleton
                className={`h-16 rounded-2xl ${i % 2 === 0 ? "w-2/3" : "w-1/2"}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="max-w-3xl mx-auto w-full px-4 py-6">
            {!hasMessages ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  Start the conversation below.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <MessageBubble
                      key={msg.id.toString()}
                      message={msg}
                      index={idx}
                    />
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>

                <div ref={bottomRef} className="h-1" aria-hidden="true" />
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* Input always at bottom */}
      <div className="shrink-0 border-t border-border/40 max-w-3xl mx-auto w-full">
        <ChatInput
          onSend={onSendMessage}
          isTyping={isTyping}
          disabled={inputDisabled}
          placeholder={
            isEmpty ? "Start a new conversation…" : "Message Aether…"
          }
        />
      </div>
    </div>
  );
}

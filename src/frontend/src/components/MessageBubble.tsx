import { Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import type { Message } from "../hooks/useQueries";
import { Role } from "../hooks/useQueries";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === Role.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.15),
        ease: "easeOut",
      }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} group`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
          isUser
            ? "bg-primary/20 text-primary"
            : "bg-muted border border-border text-muted-foreground"
        }`}
      >
        {isUser ? <User size={14} /> : <Sparkles size={13} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] md:max-w-[68%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "user-bubble text-primary-foreground rounded-tr-sm"
            : "assistant-bubble text-foreground rounded-tl-sm border border-border/40"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 flex-row"
    >
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 bg-muted border border-border text-muted-foreground">
        <Sparkles size={13} />
      </div>

      {/* Typing dots */}
      <div className="assistant-bubble rounded-2xl rounded-tl-sm px-4 py-4 border border-border/40 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="typing-dot w-1.5 h-1.5 rounded-full typing-dot-color" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full typing-dot-color" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full typing-dot-color" />
        </div>
      </div>
    </motion.div>
  );
}

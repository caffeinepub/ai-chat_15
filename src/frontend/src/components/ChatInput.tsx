import { ArrowUp, Square } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isTyping: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isTyping,
  disabled,
  placeholder,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isTyping || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isTyping, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      // Auto-grow
      const ta = e.target;
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
    },
    [],
  );

  const canSend = value.trim().length > 0 && !isTyping && !disabled;

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="relative flex items-end gap-2 bg-card border border-border rounded-2xl px-4 py-3 shadow-chat transition-colors focus-within:border-ring/60">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Message Aether…"}
          disabled={disabled}
          rows={1}
          className="auto-grow-textarea flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed disabled:opacity-50 py-0.5"
          style={{ minHeight: "24px" }}
          aria-label="Message input"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!canSend && !isTyping}
          aria-label={isTyping ? "Stop generating" : "Send message"}
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 mb-0.5 ${
            canSend
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              : isTyping
                ? "bg-muted text-muted-foreground cursor-default"
                : "bg-muted/50 text-muted-foreground/40 cursor-not-allowed"
          }`}
        >
          {isTyping ? (
            <Square size={12} className="fill-current" />
          ) : (
            <ArrowUp size={14} />
          )}
        </motion.button>
      </div>
      <p className="text-center text-xs text-muted-foreground/50 mt-2">
        Press{" "}
        <kbd className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">
          Enter
        </kbd>{" "}
        to send ·{" "}
        <kbd className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">
          Shift+Enter
        </kbd>{" "}
        for new line
      </p>
    </div>
  );
}

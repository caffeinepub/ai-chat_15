import { BookOpen, Code2, Lightbulb, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Lightbulb,
    label: "Brainstorm ideas",
    prompt: "Help me brainstorm creative ideas for a new project",
  },
  {
    icon: Code2,
    label: "Debug code",
    prompt: "Help me debug a tricky piece of code I'm working on",
  },
  {
    icon: BookOpen,
    label: "Explain a concept",
    prompt: "Explain how machine learning works in simple terms",
  },
  {
    icon: Zap,
    label: "Write something",
    prompt: "Help me write a compelling introduction for an essay",
  },
];

export function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-center max-w-lg w-full"
      >
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
        >
          <Sparkles size={28} className="text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="font-display text-4xl text-foreground mb-2"
        >
          How can I help?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="text-muted-foreground text-sm leading-relaxed mb-10"
        >
          Ask me anything — I'm here to think through problems,
          <br className="hidden sm:block" />
          explain ideas, and help you get things done.
        </motion.p>

        {/* Suggestion chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="grid grid-cols-2 gap-2"
        >
          {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
            <button
              type="button"
              key={label}
              onClick={() => onSuggestion(prompt)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border text-left text-sm text-foreground hover:bg-accent hover:border-border/80 transition-all duration-150 group"
            >
              <Icon
                size={15}
                className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors"
              />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

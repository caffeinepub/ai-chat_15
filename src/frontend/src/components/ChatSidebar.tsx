import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, MessageSquare, Plus, Sparkles, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ConversationSummary } from "../hooks/useQueries";

interface ChatSidebarProps {
  conversations: ConversationSummary[] | undefined;
  isLoading: boolean;
  selectedId: bigint | null;
  onSelect: (id: bigint) => void;
  onNewChat: () => void;
  onDelete: (id: bigint) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function timeAgo(nanos: bigint): string {
  const ms = Number(nanos / BigInt(1_000_000));
  const now = Date.now();
  const diff = now - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ms).toLocaleDateString();
}

function ConversationItem({
  conv,
  isSelected,
  onSelect,
  onDelete,
}: {
  conv: ConversationSummary;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className={`group relative flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
        isSelected
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <MessageSquare
        size={14}
        className={`shrink-0 transition-colors ${
          isSelected ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate leading-tight font-medium">
          {conv.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {timeAgo(conv.lastUpdated)} · {Number(conv.messageCount)} msg
        </p>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Delete conversation"
                >
                  <Trash2 size={13} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    "{conv.title}" will be permanently deleted. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ChatSidebar({
  conversations,
  isLoading,
  selectedId,
  onSelect,
  onNewChat,
  onDelete,
  mobileOpen,
  onMobileClose,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : undefined }}
        className={`
          fixed top-0 left-0 h-full z-50 w-64 flex flex-col
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-300
          md:relative md:translate-x-0 md:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles size={14} className="text-primary" />
            </div>
            <span className="font-display text-lg text-sidebar-foreground leading-none pt-0.5">
              Aether
            </span>
          </div>
          <button
            type="button"
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={onMobileClose}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 mb-3">
          <Button
            onClick={onNewChat}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 border-border/60 bg-accent/30 hover:bg-accent text-sidebar-foreground text-xs font-medium h-9"
          >
            <Plus size={14} />
            New conversation
          </Button>
        </div>

        {/* Conversations list */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-0.5 pb-4">
            {isLoading ? (
              <div className="space-y-2 px-1 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : conversations && conversations.length > 0 ? (
              <AnimatePresence initial={false}>
                {conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id.toString()}
                    conv={conv}
                    isSelected={selectedId === conv.id}
                    onSelect={() => {
                      onSelect(conv.id);
                      onMobileClose();
                    }}
                    onDelete={() => onDelete(conv.id)}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No conversations yet.
                  <br />
                  Start a new one above.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with caffeine.ai
            </a>
          </p>
        </div>
      </motion.aside>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      onClick={onClick}
      aria-label="Open sidebar"
    >
      <Menu size={18} />
    </button>
  );
}

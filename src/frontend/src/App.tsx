import { Toaster } from "@/components/ui/sonner";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ChatArea } from "./components/ChatArea";
import { ChatSidebar, MobileMenuButton } from "./components/ChatSidebar";
import {
  Role,
  useAddMessage,
  useCreateConversation,
  useDeleteConversation,
  useGetConversation,
  useListConversations,
  useUpdateConversationTitle,
} from "./hooks/useQueries";
import {
  generateConversationTitle,
  generateMockResponse,
} from "./utils/mockResponses";

export default function App() {
  const [selectedConvId, setSelectedConvId] = useState<bigint | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingConvId, setPendingConvId] = useState<bigint | null>(null);

  // Queries
  const { data: conversations, isLoading: convListLoading } =
    useListConversations();
  const { data: conversation, isLoading: convLoading } =
    useGetConversation(selectedConvId);

  // Mutations
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const addMessage = useAddMessage();
  const updateTitle = useUpdateConversationTitle();

  // When a new conversation is created (pending), select it
  useEffect(() => {
    if (pendingConvId !== null) {
      setSelectedConvId(pendingConvId);
      setPendingConvId(null);
    }
  }, [pendingConvId]);

  const handleNewChat = useCallback(() => {
    setSelectedConvId(null);
    setMobileOpen(false);
  }, []);

  const handleSelectConversation = useCallback((id: bigint) => {
    setSelectedConvId(id);
  }, []);

  const handleDeleteConversation = useCallback(
    async (id: bigint) => {
      try {
        await deleteConversation.mutateAsync(id);
        if (selectedConvId === id) {
          setSelectedConvId(null);
        }
        toast.success("Conversation deleted");
      } catch {
        toast.error("Failed to delete conversation");
      }
    },
    [deleteConversation, selectedConvId],
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (isTyping) return;
      setIsTyping(true);

      try {
        let convId = selectedConvId;

        // Create new conversation if none selected
        if (convId === null) {
          const title = generateConversationTitle(content);
          const newId = await createConversation.mutateAsync(title);
          convId = newId;
          setSelectedConvId(newId);
        }

        // Add user message
        await addMessage.mutateAsync({
          conversationId: convId,
          role: Role.user,
          content,
        });

        // Auto-title on first message (only if it was a new conversation)
        const currentConv = conversation;
        if (
          !currentConv ||
          (currentConv.messages && currentConv.messages.length === 0)
        ) {
          const autoTitle = generateConversationTitle(content);
          await updateTitle.mutateAsync({ id: convId, newTitle: autoTitle });
        }

        // Simulate thinking delay (1–2 seconds)
        const delay = 1000 + Math.random() * 800;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Generate and add assistant response
        const response = generateMockResponse(content);
        await addMessage.mutateAsync({
          conversationId: convId,
          role: Role.assistant,
          content: response,
        });
      } catch {
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsTyping(false);
      }
    },
    [
      isTyping,
      selectedConvId,
      conversation,
      createConversation,
      addMessage,
      updateTitle,
    ],
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        isLoading={convListLoading}
        selectedId={selectedConvId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top bar */}
        <header className="shrink-0 flex items-center gap-3 px-4 h-14 border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <MobileMenuButton onClick={() => setMobileOpen(true)} />

          <div className="flex items-center gap-2">
            {/* Mobile logo (hidden on desktop since sidebar shows it) */}
            <div className="md:hidden w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
              <Sparkles size={12} className="text-primary" />
            </div>
            <h1 className="text-sm font-medium text-foreground truncate">
              {conversation?.title ?? (selectedConvId ? "Loading…" : "Aether")}
            </h1>
          </div>

          {/* Status dot */}
          {isTyping && (
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Thinking…</span>
            </div>
          )}
        </header>

        {/* Chat content */}
        <ChatArea
          messages={conversation?.messages}
          isLoading={convLoading && selectedConvId !== null}
          isTyping={isTyping}
          conversationId={selectedConvId}
          onSendMessage={handleSendMessage}
          inputDisabled={createConversation.isPending}
        />
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border text-foreground text-sm",
            error: "border-destructive/40",
            success: "border-primary/30",
          },
        }}
      />
    </div>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Conversation, ConversationSummary, Message } from "../backend.d";
import { Role } from "../backend.d";
import { useActor } from "./useActor";

export { Role };
export type { ConversationSummary, Conversation, Message };

// ── List conversations ──────────────────────────────────────────────────────
export function useListConversations() {
  const { actor, isFetching } = useActor();
  return useQuery<ConversationSummary[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      const list = await actor.listConversations();
      return [...list].sort((a, b) => Number(b.lastUpdated - a.lastUpdated));
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Get single conversation ────────────────────────────────────────────────
export function useGetConversation(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Conversation | null>({
    queryKey: ["conversation", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getConversation(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ── Create conversation ────────────────────────────────────────────────────
export function useCreateConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<bigint, Error, string>({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("No actor");
      return actor.createConversation(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// ── Delete conversation ────────────────────────────────────────────────────
export function useDeleteConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteConversation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// ── Add message ────────────────────────────────────────────────────────────
export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { conversationId: bigint; role: Role; content: string }
  >({
    mutationFn: async ({ conversationId, role, content }) => {
      if (!actor) throw new Error("No actor");
      return actor.addMessage(conversationId, role, content);
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// ── Update conversation title ──────────────────────────────────────────────
export function useUpdateConversationTitle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: bigint; newTitle: string }>({
    mutationFn: async ({ id, newTitle }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateConversationTitle(id, newTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

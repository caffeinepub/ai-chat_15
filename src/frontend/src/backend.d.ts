import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: bigint;
    content: string;
    role: Role;
    timestamp: Time;
}
export type Time = bigint;
export interface ConversationSummary {
    id: bigint;
    title: string;
    lastUpdated: Time;
    messageCount: bigint;
}
export interface Conversation {
    id: bigint;
    title: string;
    messages: Array<Message>;
    createdAt: Time;
    updatedAt: Time;
}
export enum Role {
    user = "user",
    assistant = "assistant"
}
export interface backendInterface {
    addMessage(conversationId: bigint, role: Role, content: string): Promise<void>;
    createConversation(title: string): Promise<bigint>;
    deleteConversation(id: bigint): Promise<void>;
    getConversation(id: bigint): Promise<Conversation | null>;
    listConversations(): Promise<Array<ConversationSummary>>;
    updateConversationTitle(id: bigint, newTitle: string): Promise<void>;
}

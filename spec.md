# AI Chat App

## Current State
New project with no existing backend or frontend code.

## Requested Changes (Diff)

### Add
- A ChatGPT-style chat interface with a sidebar listing past conversations and a main chat area
- Ability to create new conversations
- Chat messages with user and assistant roles displayed in a conversational format
- Mock AI responses that simulate a typical assistant reply (with slight delay for realism)
- Conversation history stored in the backend (title, messages, timestamps)
- Ability to delete conversations

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Backend: Store conversations with title, list of messages (role: user/assistant, content, timestamp), and created/updated timestamps. Provide APIs to create conversation, add message, list conversations, get conversation by ID, delete conversation.
- Frontend: Two-panel layout (sidebar + main chat). Sidebar lists conversations with new chat button. Main area shows message thread with input box at bottom. Mock AI responses generated on the frontend with a short delay after user sends a message.

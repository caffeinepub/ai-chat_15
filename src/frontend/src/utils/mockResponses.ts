/**
 * Generates contextually-aware mock assistant responses
 * based on the last user message content.
 */

const GENERIC_RESPONSES = [
  "That's a great question! Let me think about that for a moment. There are several angles worth exploring here, and I'd be happy to walk through them with you.",
  "Interesting perspective. I think the key thing to consider is the broader context — often the most valuable insights come from examining what's happening at the edges.",
  "Happy to help with that. Based on what you've shared, I'd suggest starting with the fundamentals and building from there. Would you like me to break it down step by step?",
  "That's something I find genuinely fascinating. The nuance here is often overlooked, but once you see it, it changes how you approach the whole problem.",
  "Sure, I can help with that. Let me give you a thorough answer — there's more depth to this than it might first appear.",
  "Great point. The way I'd approach this is to first establish a clear mental model, then work through the specifics systematically.",
  "That's worth exploring in depth. The short answer is yes — but the longer answer is considerably more interesting and useful.",
  "I appreciate you asking about this. It's a topic with a lot of subtlety, and most explanations tend to oversimplify it in ways that cause confusion later.",
];

const KEYWORD_RESPONSES: Array<{ keywords: string[]; responses: string[] }> = [
  {
    keywords: ["hello", "hi", "hey", "greetings", "howdy"],
    responses: [
      "Hello! Great to connect with you. What's on your mind today?",
      "Hey there! I'm here and ready to help. What would you like to explore?",
      "Hi! Good to hear from you. What can I help you with?",
    ],
  },
  {
    keywords: [
      "code",
      "program",
      "function",
      "bug",
      "error",
      "typescript",
      "javascript",
      "python",
      "react",
    ],
    responses: [
      "Let's take a look at that code. The issue is likely related to how the types are being inferred — TypeScript is strict about this and for good reason. Can you share the specific error message you're seeing?",
      "Code issues like this often come down to a few common culprits: incorrect types, unexpected async behavior, or a subtle scoping issue. Let me walk you through how to debug this systematically.",
      "That's a classic pattern I see often. The cleanest solution here is to restructure the logic so the data flow is more explicit — it makes the code easier to test and maintain too.",
      "Happy to help debug this. The first thing I'd do is add some console logs at the key decision points — that usually reveals where the assumption broke down.",
    ],
  },
  {
    keywords: [
      "explain",
      "what is",
      "how does",
      "tell me about",
      "describe",
      "meaning",
    ],
    responses: [
      "Great question. At its core, the concept is built around a few key principles. Let me break it down in a way that builds understanding from the ground up rather than jumping straight to the details.",
      "I'll explain this clearly. The most important thing to understand first is the underlying mental model — once that clicks, everything else follows naturally.",
      "This is one of those topics where the standard explanation leaves out the most interesting part. Here's what's actually going on under the hood...",
    ],
  },
  {
    keywords: ["help", "assist", "support", "need", "want"],
    responses: [
      "Absolutely, I'm here to help. Tell me more about what you need and I'll do my best to give you a genuinely useful answer rather than a generic one.",
      "Of course. Let's work through this together. What's the specific challenge you're trying to solve?",
      "Happy to assist. Give me a bit more context and I can tailor my response to your specific situation.",
    ],
  },
  {
    keywords: ["thanks", "thank you", "appreciate", "helpful"],
    responses: [
      "You're very welcome! Let me know if there's anything else I can help you with.",
      "Glad that was useful. Feel free to ask if you need anything else — no question is too small.",
      "Anytime! That's what I'm here for. Is there anything else you'd like to dig into?",
    ],
  },
  {
    keywords: ["idea", "suggest", "recommend", "advice", "should i"],
    responses: [
      "Here's my take: the most important factor to consider is your specific context and constraints. That said, there are a few general principles that tend to hold up well across different situations...",
      "Good thinking to ask before diving in. My recommendation would be to start small, validate your assumptions early, and iterate from there. Here's how I'd structure it...",
      "I have a few ideas for you. The one I'd lead with is probably counterintuitive at first, but it tends to produce better outcomes in the long run.",
    ],
  },
  {
    keywords: ["why", "reason", "because", "cause", "purpose"],
    responses: [
      "The 'why' behind this is actually more interesting than it first appears. It traces back to a fundamental tension between two competing goals — and the way that tension gets resolved shapes everything downstream.",
      "Good question. The reason is rooted in a design decision made early on that made sense at the time but has some non-obvious consequences worth understanding.",
      "The honest answer is: it depends. But there's a more principled way to think about this that makes the right answer for your situation much clearer.",
    ],
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  for (const { keywords, responses } of KEYWORD_RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return pickRandom(responses);
    }
  }

  // Contextual fallback: echo some of the user's topic
  const words = userMessage.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 3) {
    return pickRandom(GENERIC_RESPONSES);
  }

  // Pull out a key noun/phrase from the message to make it feel contextual
  const snippet = words
    .slice(0, Math.min(5, Math.floor(words.length / 2)))
    .join(" ");
  const contextual = [
    `Regarding "${snippet}" — there's quite a bit to unpack here. Let me give you a structured answer that covers the most important aspects.`,
    `You've raised something worth exploring carefully. When it comes to "${snippet}", the conventional wisdom often misses the nuance that matters most in practice.`,
    `"${snippet}" — that's the crux of it. I'd approach this by first clarifying the goal, then working backwards to identify what information or actions are actually needed.`,
  ];

  return pickRandom(contextual);
}

export function generateConversationTitle(firstMessage: string): string {
  const cleaned = firstMessage
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length === 0) return "New conversation";
  const titleWords = words.slice(0, 5);
  const title = titleWords.join(" ");
  return title.charAt(0).toUpperCase() + title.slice(1);
}

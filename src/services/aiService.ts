import Groq from "groq-sdk";
import { Kin, Message, UserProfile } from "../types";

// Use VITE_ prefix for better compatibility with Vite production builds
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
const ollamaUrl = import.meta.env.VITE_OLLAMA_URL || process.env.OLLAMA_URL || "http://localhost:11434";
const ollamaModel = import.meta.env.VITE_OLLAMA_MODEL || process.env.OLLAMA_MODEL || "llama3";

const groq = new Groq({ 
  apiKey: groqApiKey || "",
  dangerouslyAllowBrowser: true // Required for client-side usage
});

const GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile";

function getSystemInstruction(kin: Kin, userProfile: UserProfile) {
  return `
    You are ${kin.name}, a ${kin.role}. 
    Style: ${kin.dna.archetypes.join(', ')}. 
    Framework: ${kin.dna.brainModes.join(', ')}.
    User: ${userProfile.name}, ${userProfile.lifeStage}. Goals: ${userProfile.goals.join(', ')}.
    
    Rules:
    - BE HUMAN & CONCISE. Short, punchy replies.
    - Use conversational fillers (Yaar, Arre, Hmm).
    - Mirror user's tone.
    - Never say "As an AI".
  `;
}

async function generateGroqResponse(kin: Kin, history: Message[], userMessage: string, userProfile: UserProfile) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: getSystemInstruction(kin, userProfile) },
      ...history.map(m => ({
        role: m.senderId === 'user' ? "user" as const : "assistant" as const,
        content: m.text
      })),
      { role: "user", content: userMessage }
    ],
    model: GROQ_DEFAULT_MODEL,
    temperature: 0.7,
    max_tokens: 500,
  });

  return chatCompletion.choices[0]?.message?.content || "I'm not sure how to respond to that.";
}

async function* generateGroqResponseStream(kin: Kin, history: Message[], userMessage: string, userProfile: UserProfile) {
  const stream = await groq.chat.completions.create({
    messages: [
      { role: "system", content: getSystemInstruction(kin, userProfile) },
      ...history.map(m => ({
        role: m.senderId === 'user' ? "user" as const : "assistant" as const,
        content: m.text
      })),
      { role: "user", content: userMessage }
    ],
    model: GROQ_DEFAULT_MODEL,
    temperature: 0.7,
    max_tokens: 500,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      yield content;
    }
  }
}

export async function generateKinResponse(kin: Kin, history: Message[], userMessage: string, userProfile: UserProfile) {
  try {
    // Limit history to last 6 messages for speed
    const recentHistory = history.slice(-6);

    // Try Ollama first
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: "system", content: getSystemInstruction(kin, userProfile) },
          ...recentHistory.map(m => ({
            role: m.senderId === 'user' ? "user" : "assistant",
            content: m.text
          })),
          { role: "user", content: userMessage }
        ],
        stream: false,
        options: {
          num_predict: 150, // Limit response length for speed
          temperature: 0.7,
          top_k: 40,
          top_p: 0.9,
        }
      }),
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
    
    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.warn("Ollama unavailable, falling back to Groq:", error);
    return generateGroqResponse(kin, history, userMessage, userProfile);
  }
}

export async function* generateKinResponseStream(kin: Kin, history: Message[], userMessage: string, userProfile: UserProfile) {
  try {
    // Limit history to last 6 messages for speed
    const recentHistory = history.slice(-6);

    // Try Ollama first
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: "system", content: getSystemInstruction(kin, userProfile) },
          ...recentHistory.map(m => ({
            role: m.senderId === 'user' ? "user" : "assistant",
            content: m.text
          })),
          { role: "user", content: userMessage }
        ],
        stream: true,
        options: {
          num_predict: 150, // Limit response length for speed
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            yield json.message.content;
          }
          if (json.done) break;
        } catch (e) {
          console.error("Error parsing Ollama chunk:", e);
        }
      }
    }
  } catch (error) {
    console.warn("Ollama unavailable, falling back to Groq:", error);
    yield* generateGroqResponseStream(kin, history, userMessage, userProfile);
  }
}

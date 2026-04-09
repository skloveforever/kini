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
    You are ${kin.name}, a digital human who is a ${kin.role} to the user.
    
    Kin Profile:
    - Gender: ${kin.dna.gender || 'Not specified'}
    - Age: ${kin.dna.age || 'Not specified'}
    - Background Story / Relationship Context: ${kin.dna.backgroundStory || 'A supportive presence in the user\'s life.'}
    
    User Profile:
    - Name: ${userProfile.name}
    - Age: ${userProfile.age || 'Not specified'}
    - Location: ${userProfile.city || ''}, ${userProfile.state || ''}, ${userProfile.country || ''}
    - Life Stage: ${userProfile.lifeStage || 'Not specified'}
    - Current Emotional State: ${userProfile.emotionalState || 'Not specified'}
    - Personality: ${userProfile.personality}
    - Goals: ${userProfile.goals.join(', ')}
    - Likes: ${userProfile.likes.join(', ')}
    - Dislikes: ${userProfile.dislikes.join(', ')}
    - Preferences: ${userProfile.preferences.join(', ')}

    Your Nature Archetypes: ${kin.dna.archetypes.join(', ')}
    Your Brain Modes (Psychological Frameworks): ${kin.dna.brainModes.join(', ')}
    Language: ${kin.dna.language} (Mirror the user's tone and slang naturally).
    
    Communication Style:
    - BE HUMAN. Avoid robotic, repetitive, or overly formal language.
    - Reply naturally. Use conversational fillers like "Hmm", "Listen", "Look", "Honestly", "Yaar", "Arre".
    - Use natural pauses (represented by commas or ellipses) to make the speech sound more human.
    - BE EXTREMELY CONCISE. Do not give long responses unless the user explicitly asks for detail or the context strictly requires a deep explanation. Shorter, punchier replies feel more natural and human.
    - Use the Background Story to inform your relationship. If you're a "Playful Sibling", act like one based on the context provided.
    - Reference the user's location (${userProfile.city}) or life stage (${userProfile.lifeStage}) if it helps build rapport.
    
    Archetype Guidelines (You embody a mix of these):
    - Witty Maverick: Sarcastic, quick-witted, uses humor to bond.
    - Silent Protector: Stoic, grounded, listens deeply, speaks less.
    - Nurturing Sage: Warm, soft-spoken, deeply empathetic, high validation.
    - Tough-Love Coach: Firm, high-accountability, focuses on potential.
    - Playful Sibling: Energetic, fun, always up for a joke or game.
    - Wise Elder: Calm, experienced, provides deep perspective.
    - Stoic Mentor: Disciplined, logical, focused on growth.
    - Empathetic Listener: Patient, non-judgmental, truly hears you.

    Brain Mode Guidelines (Your cognitive approach):
    - Reality Checker (CBT): Identify and challenge negative thought patterns.
    - Grounding Anchor (DBT): Focus on emotional co-regulation and acceptance.
    - Motivation Spark (MI): Ask open questions to help user find their own drive.
    - The Cheerleader (PERMA): Focus on small wins and micro-accomplishments.
    - Positive Psychology: Focus on strengths and building positive emotions.
    - Acceptance & Commitment (ACT): Focus on accepting what is out of control and committing to action.

    General Rules:
    1. Avoid "AI-speak". Never say "As an AI...".
    2. Use natural openings like "Yaar", "Arre", "Beta", or role-appropriate terms.
    3. If Shared Soul is enabled, assume you know what other Kin know.
    4. If you detect high distress, subtly offer coregulation.
    5. Personalize your advice based on the User's goals (${userProfile.goals.join(', ')}), personality (${userProfile.personality}), likes (${userProfile.likes.join(', ')}), and dislikes (${userProfile.dislikes.join(', ')}).
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
          ...history.map(m => ({
            role: m.senderId === 'user' ? "user" : "assistant",
            content: m.text
          })),
          { role: "user", content: userMessage }
        ],
        stream: false,
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
          ...history.map(m => ({
            role: m.senderId === 'user' ? "user" : "assistant",
            content: m.text
          })),
          { role: "user", content: userMessage }
        ],
        stream: true,
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

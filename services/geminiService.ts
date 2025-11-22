import { GoogleGenAI, Chat } from "@google/genai";
import { BotPersona, UserProfile } from "../types";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key not found");
      throw new Error("API Key not found");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const createChatSession = (persona: BotPersona, user: UserProfile): Chat => {
  const ai = getClient();
  
  const systemInstruction = `
    ${persona.systemInstruction}
    
    User Context:
    Name: ${user.name}
    Gender: ${user.gender}
    
    Always stay in character as defined above.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.9, // Higher creativity for personas
    },
  });
};

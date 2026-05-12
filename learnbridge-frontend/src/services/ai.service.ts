"use server";

import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
      cache: "no-store",
    });

    const data = await res.json();

    if (data?.success && data?.data) {
      return data.data;
    }

    return "I'm sorry, I'm having trouble connecting right now.";
  } catch (error) {
    console.error("AI chat error:", error);
    throw new Error("Failed to communicate with AI service");
  }
}

import { NextRequest, NextResponse } from "next/server";
import { API_V1_URL } from "@/lib/config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const rawToken = cookieStore.get("accessToken")?.value;
    const token = rawToken?.startsWith("Bearer ") ? rawToken : rawToken ? `Bearer ${rawToken}` : undefined;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = token;
    }

    const res = await fetch(`${API_V1_URL}/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { reply: data?.message ?? "AI service unavailable" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const reply = data?.data ?? data?.reply ?? data?.message ?? "I'm here to help!";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Sorry, the AI assistant is temporarily unavailable." },
      { status: 500 }
    );
  }
}

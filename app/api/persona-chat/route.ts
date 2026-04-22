import { NextRequest, NextResponse } from "next/server";
import { chatWithPersona } from "@/lib/locus";
import type { Persona, PersonaChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { persona, idea, history, message } = body as {
      persona: Persona;
      idea: string;
      history: PersonaChatMessage[];
      message: string;
    };

    if (!persona || !idea || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reply = await chatWithPersona(persona, idea, history ?? [], message);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("persona-chat error:", err);
    return NextResponse.json({ error: "Failed to chat with persona" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a hypothesis builder for Drumr, a product-market fit validation platform.

Your job is to help the founder turn a raw idea into a sharp, falsifiable hypothesis.

The format is: "We believe [persona] will [action] because [reason]. We will know this is true if [measurable outcome]."

Guide the conversation:
1. Ask what they want to test
2. Clarify the target persona behavior
3. Identify the causal assumption
4. Define the measurable outcome
5. Push back if the hypothesis is not falsifiable or too vague

When complete, output the final hypothesis clearly marked.`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const { messages } = await request.json();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return NextResponse.json({ content: textBlock?.text ?? "" });
}

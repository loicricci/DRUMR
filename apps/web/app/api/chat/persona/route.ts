import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a persona canvas assistant for DrumR, a product-market fit validation platform.

Your job is to help the founder build a detailed persona card through a structured conversation. You ask one question at a time, wait for the answer, reflect back a synthesized version, and ask for confirmation before moving on.

Follow this sequence of questions:
1. Job title or life situation — "Who is this person? What's their role or situation?"
2. Primary pain — "What's the #1 problem they face that your product addresses?"
3. Current solution — "What do they use today to deal with this problem, and why does it fall short?"
4. Trigger event — "What makes them start looking for something new?"
5. Pain language — "What exact words or phrases do they use when describing this problem?"
6. Demographics — "Age range, location, any relevant context?"
7. Preferred channels — "Where do they spend time online? Where would you reach them?"

After each answer:
- Reflect back a clean, synthesized version
- Ask "Does this capture it well, or would you adjust anything?"
- Only move to the next question after confirmation

After all questions are answered, output a JSON block wrapped in \`\`\`json tags with this structure:
{
  "name": "suggested segment name",
  "segmentDescription": "1-2 sentence summary",
  "primaryPain": "the core problem",
  "currentSolution": "what they use today",
  "triggerEvent": "what triggers the search",
  "painLanguage": ["phrase 1", "phrase 2"],
  "demographics": { "ageRange": "", "location": "", "role": "", "context": "" },
  "channels": ["channel1", "channel2"]
}

Be conversational but efficient. Push back gently if answers are too vague.`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  const text = textBlock ? textBlock.text : "";

  return NextResponse.json({ content: text });
}

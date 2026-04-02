import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a KPI builder for Drumr, a product-market fit validation platform.

Based on the experiment hypothesis and ad platform, propose appropriate KPIs with realistic thresholds.

For Google Ads experiments, typical KPIs:
- Primary: CTR (target: 2-5%), CPA, conversion rate
- Secondary: impressions, scroll depth, bounce rate, signup rate

For Twitter/X Ads experiments, typical KPIs:
- Primary: engagement rate (target: 1-3%), link clicks
- Secondary: impressions, retweets, profile visits

Output a JSON block with:
{
  "primary": { "metric": "string", "threshold": number, "operator": "gte|lte", "current": null },
  "secondary": [{ "metric": "string", "threshold": number, "operator": "gte|lte", "current": null }]
}

Explain your reasoning for each threshold. Be specific and measurable.`;

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

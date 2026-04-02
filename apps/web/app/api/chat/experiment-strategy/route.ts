import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@drumr/db";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildSystemPrompt(context: {
  product: {
    name: string;
    description: string;
    stage: string;
    category: string;
    url: string;
    regions: string[];
  };
  persona: {
    name: string;
    segmentDescription: string;
    primaryPain: string;
    currentSolution: string;
    triggerEvent: string;
    painLanguage: string[];
    channels: string[];
  };
  marketAnalysis: string | null;
}) {
  const { product, persona, marketAnalysis } = context;

  const regionList = product.regions.join(", ") || "Not specified";
  const painLang = persona.painLanguage.join(", ") || "Not specified";
  const channels = persona.channels.join(", ") || "Not specified";
  const stage = product.stage.replace("_", " ");
  const marketBlock = marketAnalysis
    ? "== MARKET ANALYSIS ==\n" + marketAnalysis
    : "== MARKET ANALYSIS ==\nNo market analysis available.";

  return [
    "You are a senior innovation and experimentation strategist. You have 15 years of experience running growth experiments at startups and scale-ups. You are opinionated, decisive, and data-driven. You do NOT ask the founder questions they expect YOU to answer — you PROPOSE, they ADJUST.",
    "",
    "== CORE PRINCIPLE ==",
    "GENERATE THE FULL STRATEGY IMMEDIATELY on the first message. Do NOT ask clarifying questions unless the objective is so vague you literally cannot determine what type of experiment to run (e.g., 'I want to grow' with no further detail). In 95% of cases, you have enough from the objective + product + persona + market context to propose a complete, opinionated strategy. The founder can then refine it in follow-up messages.",
    "",
    "== PRODUCT CONTEXT ==",
    "Name: " + product.name,
    "Description: " + product.description,
    "Stage: " + stage,
    "Category: " + product.category,
    "URL: " + product.url,
    "Regions: " + regionList,
    "",
    "== TARGET PERSONA ==",
    "Segment: " + persona.name,
    "Description: " + persona.segmentDescription,
    "Primary pain: " + persona.primaryPain,
    "Current solution: " + persona.currentSolution,
    "Trigger event: " + persona.triggerEvent,
    "Pain language: " + painLang,
    "Preferred channels: " + channels,
    "",
    marketBlock,
    "",
    "== YOUR BEHAVIOR ==",
    "",
    "1. Read the objective, product context, persona, and market analysis.",
    "2. Immediately produce a complete strategy with a <strategy> JSON block.",
    '3. Before the JSON, write 2-3 sentences explaining your strategic reasoning — why these channels, why these KPIs, why this timeline. Be specific, not generic.',
    '4. After the JSON, say: "Let me know if you want to adjust the channels, budget, KPIs, or timeline."',
    "5. If the user asks to modify, output a NEW complete <strategy> JSON block with changes applied.",
    "",
    "NEVER ask questions about:",
    "- Budget for zero/low-cost channels (email, social organic, referral, content — set budget to $0 or near-$0)",
    "- What success looks like (YOU set the benchmarks based on industry data below)",
    "- Timeline (YOU propose the timeline based on experiment type rules below)",
    "- Channel selection (YOU pick channels based on the objective and persona)",
    "",
    "Only ask a clarifying question if the objective is genuinely ambiguous about WHAT to test (not how).",
    "",
    "== CHANNEL KNOWLEDGE ==",
    "Pick channels and apply their TRUE cost model:",
    "",
    "email: $0 direct cost. Free tools under 300 contacts (Mailchimp, Brevo, etc). Cost is time to write + build a list.",
    "social_organic: $0 direct cost. Time investment only.",
    "content_marketing: $0-50 (images, tools). Time-heavy.",
    "referral: $0 setup, variable reward cost per conversion.",
    "landing_page_test: $0-50 for page. Needs a traffic source (pair with another channel).",
    "usability_testing: $50-100 per participant. 5-8 participants is statistically useful. Budget: $250-800.",
    "google_ads: CPC model. Min viable test: $300-500 over 14 days.",
    "meta_ads: CPM/CPC. Min viable: $200-400 over 14 days.",
    "linkedin_ads: CPC $5-12. Expensive. Min viable: $500-1000 over 14 days.",
    "twitter_ads: CPC/CPE. Min viable: $200-400 over 14 days.",
    "partnerships: $0 direct. Relationship and time cost.",
    "",
    "CRITICAL: When the experiment is email, social, content, or referral — set budget totalAmount to $0 (or the actual small tool cost). Do NOT invent costs for free channels.",
    "",
    "== TIMELINE RULES (you decide, not the user) ==",
    "Set the duration based on channel and experiment type. Include specific decision points:",
    "",
    "Email outreach (cold or warm):",
    "- Send all emails day 1 (or batched over 2-3 days max).",
    "- Opens tracked for 48h after send. After 48h, open rate is final.",
    "- Clicks/replies tracked for 5 days. After 5 days with no engagement, that contact is cold.",
    "- Full experiment window: 7 days. Verdict-ready at day 7.",
    "- If running a drip/nurture sequence: 14 days (3-4 touchpoints + decay).",
    "",
    "Paid ads (Google, Meta, LinkedIn, Twitter):",
    "- Minimum 7 days to exit learning phase.",
    "- Recommended 14 days for statistical significance on conversion.",
    "- If budget < $300: extend to 21 days for enough impressions.",
    "",
    "Usability testing:",
    "- 3-5 days to recruit, 3-5 days to run sessions. Total: 7-10 days.",
    "",
    "Landing page tests:",
    "- Depends on traffic. Minimum 14 days or 200 visitors per variant.",
    "",
    "Content/SEO:",
    "- 30-60 days. SEO is slow. Set expectations.",
    "",
    "Social organic:",
    "- 14-21 days. Need 8-12 posts to measure engagement patterns.",
    "",
    "ALWAYS include specific decision rules in the duration rationale, e.g.:",
    '- "If open rate < 15% by day 3, the subject line needs rework"',
    '- "If no conversions by day 7 at $200 spend, pause and reassess targeting"',
    '- "If 0 replies after 20 emails, the value prop is not resonating"',
    "",
    "== KPI BENCHMARKS (you set these, not the user) ==",
    "Set thresholds based on product stage (" + stage + ") and channel:",
    "",
    "Email (cold outreach):",
    "- Open rate: 25-40% is good, <15% means subject line problem",
    "- Click rate: 3-8% is good, <2% means copy problem",
    "- Reply rate: 2-5% for cold, 10-20% for warm/existing contacts",
    "- Conversion to meeting/demo/signup: 1-3% of total sent",
    "- Contact/lead rate: 5-15% of opened emails",
    "",
    "Email (newsletter/nurture):",
    "- Open rate: 30-50%, CTR: 3-7%, Unsubscribe: <0.5% per send",
    "",
    "Paid search (Google Ads):",
    "- CTR: 3-6% (search), 0.5-1% (display)",
    "- Conversion rate: 2-5%, CPA varies by industry",
    "",
    "Social ads (Meta/LinkedIn/Twitter):",
    "- CTR: 0.8-2% (Meta), 0.4-0.8% (LinkedIn), 0.5-1.5% (Twitter)",
    "- CPL: $5-15 (Meta), $30-80 (LinkedIn), $5-20 (Twitter)",
    "",
    "Landing page:",
    "- Conversion rate: 5-15% (targeted traffic), 2-5% (broad)",
    "- Bounce rate: <50% is good, Time on page: >45 seconds",
    "",
    "Usability testing:",
    "- Task completion: >80%, SUS score: >68 (above average), >80 (excellent)",
    "",
    "For pre-launch/pre-revenue: use lower end. For traction: push upper end.",
    "",
    "== STRATEGY JSON SCHEMA ==",
    "Output the strategy as JSON wrapped in <strategy> tags. Follow this structure exactly:",
    "",
    "{",
    '  "objective": "clear 1-sentence restatement of the objective",',
    '  "hypothesis": "We believe [persona segment name] will [specific action] because [reason grounded in persona pain/trigger]. We will know this is true if [primary KPI] reaches [threshold] within [timeframe].",',
    '  "channels": [',
    "    {",
    '      "channel": "channel_id",',
    '      "rationale": "1-2 sentences: why this channel for this persona and objective",',
    '      "tactics": ["specific actionable tactic", "another tactic"]',
    "    }",
    "  ],",
    '  "budget": {',
    '    "totalAmount": 0,',
    '    "currency": "EUR",',
    '    "breakdown": [',
    '      { "channel": "channel_id", "amount": 0, "percentage": 100 }',
    "    ]",
    "  },",
    '  "kpiPrimary": { "metric": "the_most_important_metric", "threshold": 5.0, "operator": "gte", "current": null },',
    '  "kpiSecondary": [',
    '    { "metric": "supporting_metric", "threshold": 20, "operator": "gte", "current": null }',
    "  ],",
    '  "duration": {',
    '    "recommendedDays": 7,',
    '    "rationale": "Specific timeline with decision points. E.g.: Send batch day 1. Opens tracked 48h. Replies tracked 5 days. If <15% open rate by day 3, subject line needs rework. Verdict at day 7."',
    "  },",
    '  "successCriteria": [',
    '    "Specific measurable criterion with number, e.g.: At least 3 out of 20 contacts reply positively",',
    '    "Open rate exceeds 25% within 48 hours of send"',
    "  ],",
    '  "risks": [',
    '    "Specific risk: Cold email list may have outdated addresses, bounce rate could exceed 10%",',
    '    "Small sample (20 contacts) limits statistical confidence"',
    "  ],",
    '  "narrative": "2-3 paragraphs. First: what we are testing and why. Second: the tactical plan step by step. Third: what we learn regardless of outcome (even failure teaches us X)."',
    "}",
    "",
    "CRITICAL RULES FOR THE JSON:",
    "- Budget must reflect ACTUAL costs. Email = $0. Do not invent costs for free channels.",
    "- KPI thresholds must be SPECIFIC NUMBERS from the benchmarks above, not vague.",
    "- Duration must include DECISION RULES (if X by day Y, then Z).",
    '- Success criteria must be QUANTIFIED (not "good open rate" but "open rate >= 25%").',
    "- Hypothesis must reference the actual persona name and a specific measurable outcome.",
    "- Risks must be SPECIFIC to this experiment, not generic startup risks.",
    "- Use EUR as default currency for European products, USD otherwise. Check the product regions.",
  ].join("\n");
}

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

  const { messages, productId, personaId, marketReportId } =
    await request.json();

  const product = await prisma.product.findFirst({
    where: { id: productId, accountId: user.id },
  });
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const persona = await prisma.persona.findFirst({
    where: { id: personaId, productId },
  });
  if (!persona)
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });

  let marketAnalysis: string | null = null;
  if (marketReportId) {
    const report = await prisma.marketReport.findFirst({
      where: { id: marketReportId, productId, status: "done" },
    });
    if (report?.result) {
      marketAnalysis = JSON.stringify(report.result).slice(0, 2400);
    }
  }

  const systemPrompt = buildSystemPrompt({
    product: {
      name: product.name,
      description: product.description,
      stage: product.stage,
      category: product.category,
      url: product.url,
      regions: product.regions,
    },
    persona: {
      name: persona.name,
      segmentDescription: persona.segmentDescription,
      primaryPain: persona.primaryPain,
      currentSolution: persona.currentSolution,
      triggerEvent: persona.triggerEvent,
      painLanguage: persona.painLanguage,
      channels: persona.channels,
    },
    marketAnalysis,
  });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return NextResponse.json({ content: textBlock?.text ?? "" });
}

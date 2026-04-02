import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { marketReportId, productId } = await request.json();
  if (!marketReportId || !productId)
    return NextResponse.json(
      { error: "marketReportId and productId required" },
      { status: 400 }
    );

  const product = await prisma.product.findFirst({
    where: { id: productId, accountId: user.id },
  });
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const report = await prisma.marketReport.findUnique({
    where: { id: marketReportId },
    include: { product: true },
  });
  if (!report)
    return NextResponse.json({ error: "Report not found" }, { status: 404 });

  await prisma.marketReport.update({
    where: { id: marketReportId },
    data: { status: "running" },
  });

  const personas = report.personaId
    ? await prisma.persona.findMany({
        where: { id: report.personaId },
      })
    : await prisma.persona.findMany({
        where: { productId },
        orderBy: { updatedAt: "desc" },
      });

  const personaContext =
    personas.length > 0
      ? personas
          .map(
            (p) =>
              `- ${p.name}: ${p.segmentDescription}. Pain: ${p.primaryPain}. Trigger: ${p.triggerEvent}. Channels: ${p.channels.join(", ")}.`
          )
          .join("\n")
      : "No proto personas defined yet.";

  const systemPrompt = `You are conducting market analysis for a product.

Product: ${report.product.name} — ${report.product.description}
Category: ${report.product.category}

Proto Persona(s):
${personaContext}

Research and synthesize findings into these 5 sections:

1. Category Trends — What's happening in this category right now?
2. Competitor Positioning — Who are the main competitors and how are they positioned?
3. Search Demand Signals — What are people searching for in this space?
4. Whitespace Opportunities — Where are the gaps competitors aren't filling?
5. Persona Adjustment Suggestions — Based on market data, how should each proto persona be refined? Reference each persona by name.

After the analysis, propose 2-3 experiment hypotheses grounded in the proto persona(s) above. Each hypothesis MUST reference a specific persona by name.

Format each hypothesis as: "We believe [specific persona name] will [action] because [reason]. We will know this is true if [measurable outcome]."

Output as structured JSON with keys: categoryTrends, competitorPositioning, searchDemandSignals, whitespaceOpportunities, personaAdjustments, hypotheses (array of objects with keys: hypothesis (string), personaName (string), personaId (string or null)).
Return ONLY the JSON object, no markdown fences.`;

  const personaIdList = personas.map((p) => `${p.name}=${p.id}`).join(", ");

  const userMessage = `Regions: ${report.region.join(", ")}
${report.competitorsInput.length > 0 ? `Known competitors: ${report.competitorsInput.join(", ")}` : ""}
${report.researchQuestion ? `Research focus: ${report.researchQuestion}` : ""}
${personaIdList ? `Persona IDs for reference: ${personaIdList}` : ""}

Conduct the market analysis now.`;

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const resultText = textBlock?.type === "text" ? textBlock.text : "";

    let result: Prisma.JsonObject;
    let hypotheses: Array<{ hypothesis: string; personaName: string; personaId: string | null }>;

    try {
      const cleaned = resultText.replace(/```json\s*/g, "").replace(/```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
      const rawHypotheses = parsed.hypotheses || [];
      hypotheses = rawHypotheses.map((h: unknown) =>
        typeof h === "string"
          ? { hypothesis: h, personaName: "", personaId: null }
          : (h as { hypothesis: string; personaName: string; personaId: string | null })
      );
      result = parsed;
    } catch {
      result = { raw: resultText };
      hypotheses = [];
    }

    const hypothesisStrings = hypotheses.map((h) => h.hypothesis);

    await prisma.marketReport.update({
      where: { id: marketReportId },
      data: {
        status: "done",
        result,
        hypothesesProposed: hypothesisStrings,
      },
    });

    if (hypotheses.length > 0 && personas.length > 0) {
      const personaMap = new Map(personas.map((p) => [p.id, p]));
      const backlogItems = hypotheses
        .map((h) => {
          const targetPersonaId = h.personaId && personaMap.has(h.personaId)
            ? h.personaId
            : report.personaId ?? personas[0]?.id;
          if (!targetPersonaId) return null;
          return {
            personaId: targetPersonaId,
            productId,
            hypothesis: h.hypothesis,
            source: "agent" as const,
            status: "pending" as const,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      if (backlogItems.length > 0) {
        await prisma.hypothesisBacklogItem.createMany({ data: backlogItems });
      }
    }

    return NextResponse.json({ status: "done", result });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await prisma.marketReport.update({
      where: { id: marketReportId },
      data: { status: "failed", result: { error: msg } },
    });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

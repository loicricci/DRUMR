import { prisma } from "@drumr/db";
import { callClaude } from "../lib/claude.js";
import { buildContext, formatContextPrompt } from "../lib/context-builder.js";

export async function runMarketAnalysis(payload: {
  marketReportId: string;
  productId: string;
}): Promise<void> {
  const { marketReportId, productId } = payload;

  await prisma.marketReport.update({
    where: { id: marketReportId },
    data: { status: "running" },
  });

  const report = await prisma.marketReport.findUniqueOrThrow({
    where: { id: marketReportId },
    include: { product: true },
  });

  const ctx = await buildContext(productId, "market_analysis");
  const contextPrompt = formatContextPrompt(ctx);

  const systemPrompt = `${contextPrompt}

You are conducting market analysis for this product. The [PERSONAS] section above contains all proto personas defined for this product. Ground your analysis in these personas.

Research and synthesize findings into these 5 sections:

1. Category Trends — What's happening in this category right now?
2. Competitor Positioning — Who are the main competitors and how are they positioned?
3. Search Demand Signals — What are people searching for in this space?
4. Whitespace Opportunities — Where are the gaps competitors aren't filling?
5. Persona Adjustment Suggestions — For each proto persona, how should they be refined based on market data? Reference each persona by name.

After the analysis, propose 2-3 experiment hypotheses grounded in the proto persona(s). Each hypothesis MUST reference a specific persona by name.

Format each hypothesis as: "We believe [specific persona name] will [action] because [reason]. We will know this is true if [measurable outcome]."

Output as structured JSON with keys: categoryTrends, competitorPositioning, searchDemandSignals, whitespaceOpportunities, personaAdjustments, hypotheses (array of objects with keys: hypothesis (string), personaName (string), personaId (string or null)).`;

  const userMessage = `Product: ${report.product.name} — ${report.product.description}
Category: ${report.product.category}
Regions: ${report.region.join(", ")}
${report.competitorsInput.length > 0 ? `Known competitors: ${report.competitorsInput.join(", ")}` : ""}
${report.researchQuestion ? `Research focus: ${report.researchQuestion}` : ""}

Conduct the market analysis now.`;

  const callResult = await callClaude(systemPrompt, userMessage, {
    maxTokens: 4096,
  });
  const responseText = typeof callResult === "string" ? callResult : callResult.text;

  let result: Record<string, unknown>;
  let hypotheses: Array<{ hypothesis: string; personaName: string; personaId: string | null }>;

  try {
    const cleaned = responseText.replace(/```json\s*/g, "").replace(/```/g, "").trim();
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
    result = { raw: responseText };
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

  if (hypotheses.length > 0) {
    const personas = await prisma.persona.findMany({
      where: { productId },
    });
    const personaIds = new Set(personas.map((p) => p.id));
    const fallbackPersonaId = report.personaId ?? personas[0]?.id;

    const backlogItems = hypotheses
      .map((h) => {
        const targetPersonaId = h.personaId && personaIds.has(h.personaId)
          ? h.personaId
          : fallbackPersonaId;
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
}

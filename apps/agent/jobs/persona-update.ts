import { prisma } from "@drumr/db";

const HUMAN_EDIT_LOCK_MS = 24 * 60 * 60 * 1000; // 24h

export async function runPersonaUpdate(payload: {
  personaId: string;
  productId: string;
  experimentSlug: string;
  experimentId?: string;
  verdict: string;
  narrative: string;
  personaUpdates: Record<string, unknown>;
  nextHypotheses: string[];
}): Promise<void> {
  const {
    personaId,
    productId,
    experimentSlug,
    experimentId,
    verdict,
    narrative,
    personaUpdates,
    nextHypotheses,
  } = payload;

  const persona = await prisma.persona.findUnique({ where: { id: personaId } });
  if (!persona) return;

  // Respect human override: skip AI proposals if founder edited within 24h
  const humanEditRecent =
    persona.lastHumanEditAt &&
    Date.now() - new Date(persona.lastHumanEditAt).getTime() < HUMAN_EDIT_LOCK_MS;

  if (!humanEditRecent) {
    // Propose signal update for founder review — do NOT write directly to experimentSignals
    await prisma.persona.update({
      where: { id: personaId },
      data: {
        pendingAiUpdate: {
          experimentSlug,
          verdict,
          keyLearning: narrative.slice(0, 500),
          proposedChanges: personaUpdates,
          proposedAt: new Date().toISOString(),
        },
        pendingAiUpdateAt: new Date(),
      },
    });
  }

  // Write hypotheses to the backlog table (not JSONB on persona)
  if (nextHypotheses.length > 0) {
    await prisma.hypothesisBacklogItem.createMany({
      data: nextHypotheses.map((hypothesis) => ({
        personaId,
        productId,
        hypothesis,
        source: "agent" as const,
        sourceExpId: experimentId ?? null,
        status: "pending" as const,
      })),
    });
  }
}

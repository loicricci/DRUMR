"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatPanel, type ChatMessage } from "@/components/chat/chat-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createExperiment, activateExperiment } from "@/lib/actions/experiments";
import { StrategyProposalCard } from "@/components/experiments/strategy-proposal-card";
import type { ExperimentStrategy, KpiDefinition } from "@drumr/types";
import type { Persona, MarketReport, Product } from "@drumr/db";
import { toast } from "sonner";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface MarketReportWithHypotheses extends MarketReport {
  hypothesesProposed: string[] | null;
}

const STEPS = ["Context & Objective", "AI Strategy", "Review & Approve"];

export default function NewExperimentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [marketReports, setMarketReports] = useState<MarketReportWithHypotheses[]>([]);

  // Step 1: Context & Objective
  const [personaId, setPersonaId] = useState("");
  const [marketReportId, setMarketReportId] = useState<string | null>(null);
  const [objective, setObjective] = useState("");

  // Step 2: AI Strategy Chat
  const [strategyMessages, setStrategyMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<ExperimentStrategy | null>(null);

  // Step 3: Review (editable strategy + end date)
  const [editedStrategy, setEditedStrategy] = useState<ExperimentStrategy | null>(null);
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadProduct = useCallback(async () => {
    const res = await fetch(`/api/personas?productId=${productId}`);
    if (!res.ok) return;
    const personaList: Persona[] = await res.json();
    setPersonas(personaList);

    // Load product details via server action in a roundabout way:
    // we use the account API to get product info, but for simplicity,
    // fetch the product from a lightweight endpoint
    const prodRes = await fetch(`/api/account`);
    if (prodRes.ok) {
      // We already have productId from the URL; product context will be loaded
      // server-side in the strategy API call, so we just need basic display info.
      // For now, we fetch it from the personas' product relation if available.
    }
  }, [productId]);

  const loadMarketReports = useCallback(async () => {
    const res = await fetch(`/api/market-reports?productId=${productId}`);
    if (res.ok) {
      const all: MarketReportWithHypotheses[] = await res.json();
      setMarketReports(all.filter((r) => r.status === "done"));
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
    loadMarketReports();
  }, [loadProduct, loadMarketReports]);

  async function callStrategyApi(messages: ChatMessage[]) {
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat/experiment-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          productId,
          personaId,
          marketReportId,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to get AI response");
        return;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      };
      setStrategyMessages((prev) => [...prev, assistantMsg]);

      const strategyMatch = data.content.match(
        /<strategy>\s*([\s\S]*?)\s*<\/strategy>/
      );
      if (strategyMatch) {
        try {
          const parsed: ExperimentStrategy = JSON.parse(strategyMatch[1]);
          setGeneratedStrategy(parsed);
          setEditedStrategy(parsed);
          const recommendedDate = new Date();
          recommendedDate.setDate(
            recommendedDate.getDate() + (parsed.duration.recommendedDays || 14)
          );
          setEndDate(recommendedDate.toISOString().split("T")[0]);
        } catch {
          toast.error("Failed to parse strategy. Ask the AI to try again.");
        }
      }
    } catch {
      toast.error("Failed to get AI response");
    } finally {
      setChatLoading(false);
    }
  }

  function goToStep2() {
    setGeneratedStrategy(null);
    setEditedStrategy(null);
    setStep(1);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: objective,
    };
    setStrategyMessages([userMsg]);
    callStrategyApi([userMsg]);
  }

  async function handleStrategyChat(content: string) {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    const updated = [...strategyMessages, userMsg];
    setStrategyMessages(updated);
    callStrategyApi(updated);
  }

  async function handleSubmit(activate: boolean) {
    if (!editedStrategy) return;
    setSubmitting(true);

    try {
      const experiment = await createExperiment({
        productId,
        personaId,
        marketReportId,
        hypothesis: editedStrategy.hypothesis,
        objective: editedStrategy.objective,
        strategy: editedStrategy,
        channels: editedStrategy.channels.map((c) => c.channel),
        budget: editedStrategy.budget,
        kpiPrimary: editedStrategy.kpiPrimary,
        kpiSecondary: editedStrategy.kpiSecondary,
        endDate,
      });

      if (activate) {
        await activateExperiment(experiment.id);
        toast.success("Experiment activated!");
      } else {
        toast.success("Experiment saved as draft");
      }

      router.push(`/products/${productId}/experiments/${experiment.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create experiment"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const canProceedToStep2 = personaId && objective.trim().length >= 10;
  const canProceedToStep3 = !!generatedStrategy;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Experiment</h1>
        <p className="text-muted-foreground">
          Describe your objective and let AI design the strategy
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => {
              if (i < step) setStep(i);
            }}
            disabled={i > step}
            className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-colors ${
              i === step
                ? "bg-primary text-primary-foreground"
                : i < step
                  ? "bg-primary/20 text-primary cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ──── Step 1: Context & Objective ──── */}
      {step === 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Context selectors */}
          <Card>
            <CardHeader>
              <CardTitle>Experiment context</CardTitle>
              <CardDescription>
                Select the persona and market analysis to inform the strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Target persona *</Label>
                <Select value={personaId} onValueChange={setPersonaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a persona" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {personaId && (() => {
                  const p = personas.find((x) => x.id === personaId);
                  if (!p) return null;
                  return (
                    <div className="rounded-lg border bg-muted/30 p-3 text-xs space-y-1">
                      <p><span className="font-medium">Pain:</span> {p.primaryPain}</p>
                      <p><span className="font-medium">Channels:</span> {p.channels.join(", ") || "—"}</p>
                    </div>
                  );
                })()}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Market analysis (optional)</Label>
                <Select
                  value={marketReportId ?? "none"}
                  onValueChange={(v) => setMarketReportId(v === "none" ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No linked report" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No linked report</SelectItem>
                    {marketReports.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {new Date(r.createdAt).toLocaleDateString()} analysis
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Right: Objective */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Experiment objective
              </CardTitle>
              <CardDescription>
                What do you want to achieve? The AI will design the full
                strategy from this.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder={`Examples:\n• Run an email campaign to validate demand for our new feature\n• Test Google Ads to generate first revenue\n• Validate product usability with beta users\n• Measure if a LinkedIn outreach converts B2B leads`}
                className="min-h-[180px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={goToStep2}
                  disabled={!canProceedToStep2}
                  className="gap-2"
                >
                  Generate strategy
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ──── Step 2: AI Strategy Chat ──── */}
      {step === 1 && (
        <div className="space-y-4">
          <ChatPanel
            messages={strategyMessages}
            onSend={handleStrategyChat}
            isLoading={chatLoading}
            placeholder="Ask the AI to adjust channels, KPIs, timeline, or anything else..."
            className={generatedStrategy ? "h-[calc(100vh-600px)] min-h-[250px]" : "h-[calc(100vh-280px)] min-h-[400px]"}
          />

          {generatedStrategy && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4" />
                    Strategy proposal
                  </CardTitle>
                  <Button onClick={() => setStep(2)} className="gap-2">
                    Review & finalize
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Hypothesis</p>
                    <p className="text-sm leading-snug">{generatedStrategy.hypothesis}</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Channels</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {generatedStrategy.channels.map((ch, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ch.channel.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Budget</p>
                        <p className="text-sm font-semibold">
                          {generatedStrategy.budget.currency} {generatedStrategy.budget.totalAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Duration</p>
                        <p className="text-sm font-semibold">
                          {generatedStrategy.duration.recommendedDays} days
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Primary KPI</p>
                        <p className="text-sm font-semibold">
                          {generatedStrategy.kpiPrimary.metric}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Success criteria</p>
                      <ul className="mt-1 space-y-0.5">
                        {generatedStrategy.successCriteria.slice(0, 3).map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            {!generatedStrategy && !chatLoading && (
              <p className="text-xs text-muted-foreground">
                The AI will generate a strategy proposal...
              </p>
            )}
            {!generatedStrategy && chatLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating strategy...
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──── Step 3: Review & Approve ──── */}
      {step === 2 && editedStrategy && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm">
              <span className="font-medium">Objective:</span>{" "}
              {editedStrategy.objective}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Persona:{" "}
              {personas.find((p) => p.id === personaId)?.name ?? "—"}
              {marketReportId && " · Linked to market analysis"}
            </p>
          </div>

          <StrategyProposalCard
            strategy={editedStrategy}
            onChange={setEditedStrategy}
            endDate={endDate}
            onEndDateChange={setEndDate}
          />

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back to chat
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit(false)}
                disabled={submitting || !endDate}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save as draft
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={submitting || !endDate}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Activate experiment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

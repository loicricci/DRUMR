"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Loader2, RefreshCw } from "lucide-react";
import { triggerMarketAnalysis } from "@/lib/actions/market";
import { toast } from "sonner";
import type { MarketReport, Persona } from "@drumr/db";

export default function MarketPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [reports, setReports] = useState<MarketReport[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [competitors, setCompetitors] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("all");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    try {
      const res = await fetch(`/api/market-reports?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        if (!selectedReportId) {
          const firstDone = data.find((r: MarketReport) => r.status === "done");
          if (firstDone) setSelectedReportId(firstDone.id);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [productId, selectedReportId]);

  const loadPersonas = useCallback(async () => {
    const res = await fetch(`/api/personas?productId=${productId}`);
    if (res.ok) setPersonas(await res.json());
  }, [productId]);

  useEffect(() => {
    loadReports();
    loadPersonas();
    const interval = setInterval(loadReports, 10000);
    return () => clearInterval(interval);
  }, [loadReports, loadPersonas]);

  async function handleTrigger() {
    setTriggering(true);
    try {
      const report = await triggerMarketAnalysis({
        productId,
        personaId: selectedPersonaId !== "all" ? selectedPersonaId : undefined,
        regions: ["US"],
        competitors: competitors
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        researchQuestion: researchQuestion || undefined,
      });
      toast.success("Market analysis started! Results will appear shortly.");
      setSelectedReportId(report.id);
      loadReports();

      fetch("/api/market-analysis/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketReportId: report.id,
          productId,
        }),
      }).catch(() => {});
    } catch {
      toast.error("Failed to trigger analysis");
    } finally {
      setTriggering(false);
    }
  }

  const selectedReport = reports.find((r) => r.id === selectedReportId);
  const pending = reports.find(
    (r) => r.status === "queued" || r.status === "running"
  );
  const hasAnyDone = reports.some((r) => r.status === "done");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Market Intelligence
          </h1>
          <p className="text-muted-foreground">
            AI-powered market analysis for your product
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!!pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analysis running...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run analysis
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Run market analysis</DialogTitle>
              <DialogDescription>
                The AI agent will research your market and generate insights.
                Typically takes 1-2 minutes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {personas.length > 0 && (
                <div className="space-y-2">
                  <Label>Persona focus</Label>
                  <Select value={selectedPersonaId} onValueChange={setSelectedPersonaId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a persona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All personas (broad analysis)</SelectItem>
                      {personas.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose a specific persona to ground the analysis, or analyze across all.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Known competitors (optional)</Label>
                <Input
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="Competitor A, Competitor B"
                />
              </div>
              <div className="space-y-2">
                <Label>Research question (optional)</Label>
                <Textarea
                  value={researchQuestion}
                  onChange={(e) => setResearchQuestion(e.target.value)}
                  placeholder="What's the demand for X in market Y?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleTrigger} disabled={triggering}>
                {triggering ? "Queuing..." : "Start analysis"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : reports.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No market analysis yet
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Run your first market analysis to get AI-generated insights about
              your category, competitors, and opportunities.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => r.status === "done" && setSelectedReportId(r.id)}
                    className={`flex w-full items-center justify-between rounded border p-3 text-sm transition-colors text-left ${
                      r.id === selectedReportId
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : r.status === "done"
                          ? "hover:bg-muted/50 cursor-pointer"
                          : "opacity-60 cursor-default"
                    }`}
                  >
                    <span>
                      {new Date(r.createdAt).toLocaleDateString()} at{" "}
                      {new Date(r.createdAt).toLocaleTimeString()}
                    </span>
                    <Badge
                      variant={
                        r.status === "done"
                          ? "default"
                          : r.status === "running" || r.status === "queued"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {r.status === "running" || r.status === "queued" ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {r.status}
                        </span>
                      ) : (
                        r.status
                      )}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedReport && selectedReport.status === "done" && (
            <MarketReportView report={selectedReport} />
          )}

          {!hasAnyDone && !pending && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No completed analyses yet. Run one to see results.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v) => typeof v === "string" ? `• ${v}` : `• ${JSON.stringify(v)}`).join("\n");
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return Object.entries(obj)
      .map(([k, v]) => {
        if (Array.isArray(v))
          return `${k}:\n${v.map((item) => `  • ${typeof item === "string" ? item : JSON.stringify(item)}`).join("\n")}`;
        return `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`;
      })
      .join("\n\n");
  }
  return String(value);
}

function MarketReportView({ report }: { report: MarketReport }) {
  const result = report.result as Record<string, unknown> | null;
  const hypotheses = report.hypothesesProposed as string[] | null;

  const sections = [
    { key: "categoryTrends", title: "Category Trends" },
    { key: "competitorPositioning", title: "Competitor Positioning" },
    { key: "searchDemandSignals", title: "Search Demand Signals" },
    { key: "whitespaceOpportunities", title: "Whitespace Opportunities" },
    { key: "personaAdjustments", title: "Persona Adjustment Suggestions" },
  ];

  return (
    <>
      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map(({ key, title }) => {
            const raw = result[key];
            if (!raw) return null;
            const content = formatValue(raw);
            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {hypotheses && hypotheses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Proposed Experiment Hypotheses
            </CardTitle>
            <CardDescription>
              Based on market analysis findings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hypotheses.map((h, i) => (
                <div key={i} className="rounded-lg border p-4 text-sm">
                  {h}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

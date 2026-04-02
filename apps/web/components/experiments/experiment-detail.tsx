"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Download,
  Target,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { activateExperiment, pauseExperiment } from "@/lib/actions/experiments";
import { toast } from "sonner";
import type { KpiDefinition } from "@drumr/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
  draft: "secondary",
  running: "info",
  review: "warning",
  validated: "success",
  invalidated: "destructive",
  paused: "warning",
};

const recColors: Record<string, string> = {
  continue: "text-success",
  push: "text-warning",
  pause: "text-destructive",
};

interface ExperimentWithRelations {
  id: string;
  productId: string;
  slug: string;
  status: string;
  hypothesis: string;
  marketSignal: string | null;
  objective: string | null;
  strategy: unknown;
  channels: string[];
  budget: unknown;
  adPlatform: string | null;
  campaignName: string | null;
  adCopy: string | null;
  landingPageUrl: string | null;
  kpiPrimary: unknown;
  kpiSecondary: unknown;
  startedAt: Date | null;
  endsAt: Date | null;
  verdict: string | null;
  verdictNotes: string | null;
  persona: { id: string; name: string };
  snapshots: Array<{
    id: string;
    date: Date;
    kpiValues: unknown;
    deltaVsPrevious: unknown;
    recommendation: string;
    recommendationRationale: string;
  }>;
  reports: Array<{
    id: string;
    type: string;
    contentMd: string;
    createdAt: Date;
  }>;
}

export function ExperimentDetailClient({
  experiment,
}: {
  experiment: ExperimentWithRelations;
}) {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const primary = experiment.kpiPrimary as KpiDefinition;
  const latestSnapshot = experiment.snapshots[0];

  const progress =
    experiment.startedAt && experiment.endsAt
      ? Math.min(
          100,
          Math.round(
            ((Date.now() - new Date(experiment.startedAt).getTime()) /
              (new Date(experiment.endsAt).getTime() -
                new Date(experiment.startedAt).getTime())) *
              100
          )
        )
      : 0;

  const chartData = [...experiment.snapshots]
    .reverse()
    .map((s) => {
      const vals = s.kpiValues as Record<string, number>;
      return {
        date: new Date(s.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        ...vals,
      };
    });

  async function handleActivate() {
    try {
      await activateExperiment(experiment.id);
      toast.success("Experiment activated");
      window.location.reload();
    } catch {
      toast.error("Failed to activate");
    }
  }

  async function handlePause() {
    try {
      await pauseExperiment(experiment.id);
      toast.success("Experiment paused");
      window.location.reload();
    } catch {
      toast.error("Failed to pause");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold">{experiment.slug}</h1>
            <Badge variant={statusColors[experiment.status]}>
              {experiment.status}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {experiment.hypothesis}
          </p>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {experiment.persona.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {experiment.startedAt
                ? new Date(experiment.startedAt).toLocaleDateString()
                : "Not started"}{" "}
              — {experiment.endsAt ? new Date(experiment.endsAt).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {experiment.status === "draft" && (
            <Button onClick={handleActivate}>
              <Play className="mr-2 h-4 w-4" />
              Activate
            </Button>
          )}
          {experiment.status === "running" && (
            <Button variant="outline" onClick={handlePause}>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {experiment.startedAt && (
        <div>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* KPI Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            KPI Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Primary: {primary.metric}
                </p>
                <p className="text-xs text-muted-foreground">
                  Threshold: {primary.operator} {primary.threshold}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {primary.current ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {chartData.length > 1 && (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey={primary.metric}
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Recommendation */}
      {latestSnapshot && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span
                className={`text-xl font-bold uppercase ${recColors[latestSnapshot.recommendation] || ""}`}
              >
                {latestSnapshot.recommendation}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {latestSnapshot.recommendationRationale}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Verdict */}
      {experiment.verdict && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Verdict</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                experiment.verdict === "validated"
                  ? "success"
                  : experiment.verdict === "invalidated"
                    ? "destructive"
                    : "warning"
              }
              className="mb-3 text-sm"
            >
              {experiment.verdict.toUpperCase()}
            </Badge>
            {experiment.verdictNotes && (
              <p className="whitespace-pre-wrap text-sm">
                {experiment.verdictNotes}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Daily report timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Report Timeline</CardTitle>
          <CardDescription>
            {experiment.snapshots.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {experiment.snapshots.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Reports will appear here once the experiment is running.
            </p>
          ) : (
            <div className="space-y-2">
              {experiment.snapshots.map((snap) => (
                <div key={snap.id} className="rounded-lg border">
                  <button
                    className="flex w-full items-center justify-between p-3 text-left text-sm"
                    onClick={() =>
                      setExpandedReport(
                        expandedReport === snap.id ? null : snap.id
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span>
                        {new Date(snap.date).toLocaleDateString()}
                      </span>
                      <Badge
                        variant={
                          snap.recommendation === "continue"
                            ? "success"
                            : snap.recommendation === "push"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {snap.recommendation.toUpperCase()}
                      </Badge>
                    </div>
                    {expandedReport === snap.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedReport === snap.id && (
                    <div className="border-t px-3 py-2 text-sm">
                      <p className="mb-2">{snap.recommendationRationale}</p>
                      <p className="text-xs text-muted-foreground">
                        KPI values: {JSON.stringify(snap.kpiValues)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Downloads */}
      {experiment.reports.length > 0 && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Markdown
          </Button>
        </div>
      )}
    </div>
  );
}

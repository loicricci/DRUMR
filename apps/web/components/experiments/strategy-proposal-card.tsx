"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import type {
  ExperimentStrategy,
  KpiDefinition,
  ChannelStrategy,
} from "@drumr/types";
import {
  Target,
  DollarSign,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const CHANNEL_LABELS: Record<string, string> = {
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  linkedin_ads: "LinkedIn Ads",
  twitter_ads: "Twitter/X Ads",
  email: "Email",
  content_marketing: "Content Marketing",
  social_organic: "Social (Organic)",
  usability_testing: "Usability Testing",
  landing_page_test: "Landing Page Test",
  referral: "Referral",
  partnerships: "Partnerships",
  seo: "SEO",
};

function channelLabel(id: string) {
  return CHANNEL_LABELS[id] || id;
}

const OPERATOR_LABELS: Record<string, string> = {
  gte: ">=",
  lte: "<=",
  gt: ">",
  lt: "<",
  eq: "=",
};

interface StrategyProposalCardProps {
  strategy: ExperimentStrategy;
  onChange: (updated: ExperimentStrategy) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
}

export function StrategyProposalCard({
  strategy,
  onChange,
  endDate,
  onEndDateChange,
}: StrategyProposalCardProps) {
  const [narrativeOpen, setNarrativeOpen] = useState(false);

  function updateField<K extends keyof ExperimentStrategy>(
    key: K,
    value: ExperimentStrategy[K]
  ) {
    onChange({ ...strategy, [key]: value });
  }

  function updateKpiPrimary(partial: Partial<KpiDefinition>) {
    updateField("kpiPrimary", { ...strategy.kpiPrimary, ...partial });
  }

  function updateKpiSecondary(index: number, partial: Partial<KpiDefinition>) {
    const updated = [...strategy.kpiSecondary];
    updated[index] = { ...updated[index], ...partial };
    updateField("kpiSecondary", updated);
  }

  function removeKpiSecondary(index: number) {
    updateField(
      "kpiSecondary",
      strategy.kpiSecondary.filter((_, i) => i !== index)
    );
  }

  function addKpiSecondary() {
    updateField("kpiSecondary", [
      ...strategy.kpiSecondary,
      { metric: "", threshold: 0, operator: "gte" as const, current: null },
    ]);
  }

  function removeChannel(index: number) {
    updateField(
      "channels",
      strategy.channels.filter((_, i) => i !== index)
    );
    const removedChannel = strategy.channels[index].channel;
    updateField("budget", {
      ...strategy.budget,
      breakdown: strategy.budget.breakdown.filter(
        (b) => b.channel !== removedChannel
      ),
    });
  }

  function updateSuccessCriterion(index: number, value: string) {
    const updated = [...strategy.successCriteria];
    updated[index] = value;
    updateField("successCriteria", updated);
  }

  function removeSuccessCriterion(index: number) {
    updateField(
      "successCriteria",
      strategy.successCriteria.filter((_, i) => i !== index)
    );
  }

  function addSuccessCriterion() {
    updateField("successCriteria", [...strategy.successCriteria, ""]);
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);

  return (
    <div className="space-y-4">
      {/* Hypothesis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" />
            Hypothesis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={strategy.hypothesis}
            onChange={(e) => updateField("hypothesis", e.target.value)}
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>

      {/* Channels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Channels
          </CardTitle>
          <CardDescription>
            {strategy.channels.length} channel
            {strategy.channels.length !== 1 ? "s" : ""} selected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {strategy.channels.map((ch: ChannelStrategy, i: number) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{channelLabel(ch.channel)}</Badge>
                  <button
                    type="button"
                    onClick={() => removeChannel(i)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{ch.rationale}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {ch.tactics.map((t, ti) => (
                    <Badge key={ti} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Budget */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4" />
            Budget
          </CardTitle>
          <CardDescription>
            Total: {strategy.budget.currency}{" "}
            {strategy.budget.totalAmount.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="w-20 text-xs">Total</Label>
              <Input
                type="number"
                value={strategy.budget.totalAmount}
                onChange={(e) =>
                  updateField("budget", {
                    ...strategy.budget,
                    totalAmount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">
                {strategy.budget.currency}
              </span>
            </div>
            {strategy.budget.breakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Label className="w-20 truncate text-xs">
                  {channelLabel(item.channel)}
                </Label>
                <Input
                  type="number"
                  value={item.amount}
                  onChange={(e) => {
                    const updated = [...strategy.budget.breakdown];
                    updated[i] = {
                      ...item,
                      amount: parseFloat(e.target.value) || 0,
                    };
                    updateField("budget", {
                      ...strategy.budget,
                      breakdown: updated,
                    });
                  }}
                  className="w-32"
                />
                <span className="text-xs text-muted-foreground">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            KPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block text-xs font-semibold">
              Primary KPI
            </Label>
            <div className="grid gap-2 sm:grid-cols-3">
              <Input
                value={strategy.kpiPrimary.metric}
                onChange={(e) => updateKpiPrimary({ metric: e.target.value })}
                placeholder="Metric"
              />
              <Input
                type="number"
                step="0.1"
                value={strategy.kpiPrimary.threshold}
                onChange={(e) =>
                  updateKpiPrimary({
                    threshold: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Threshold"
              />
              <Select
                value={strategy.kpiPrimary.operator}
                onValueChange={(v) =>
                  updateKpiPrimary({
                    operator: v as KpiDefinition["operator"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gte">
                    {OPERATOR_LABELS.gte} Greater or equal
                  </SelectItem>
                  <SelectItem value="lte">
                    {OPERATOR_LABELS.lte} Less or equal
                  </SelectItem>
                  <SelectItem value="gt">
                    {OPERATOR_LABELS.gt} Greater than
                  </SelectItem>
                  <SelectItem value="lt">
                    {OPERATOR_LABELS.lt} Less than
                  </SelectItem>
                  <SelectItem value="eq">
                    {OPERATOR_LABELS.eq} Equal
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-xs font-semibold">Secondary KPIs</Label>
              <Button variant="outline" size="sm" onClick={addKpiSecondary}>
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>
            {strategy.kpiSecondary.map((kpi, i) => (
              <div key={i} className="mb-2 grid gap-2 sm:grid-cols-4">
                <Input
                  value={kpi.metric}
                  onChange={(e) =>
                    updateKpiSecondary(i, { metric: e.target.value })
                  }
                  placeholder="Metric"
                />
                <Input
                  type="number"
                  step="0.1"
                  value={kpi.threshold}
                  onChange={(e) =>
                    updateKpiSecondary(i, {
                      threshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Threshold"
                />
                <Select
                  value={kpi.operator}
                  onValueChange={(v) =>
                    updateKpiSecondary(i, {
                      operator: v as KpiDefinition["operator"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gte">
                      {OPERATOR_LABELS.gte} Greater or equal
                    </SelectItem>
                    <SelectItem value="lte">
                      {OPERATOR_LABELS.lte} Less or equal
                    </SelectItem>
                    <SelectItem value="gt">
                      {OPERATOR_LABELS.gt} Greater than
                    </SelectItem>
                    <SelectItem value="lt">
                      {OPERATOR_LABELS.lt} Less than
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeKpiSecondary(i)}
                  className="text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Duration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Duration
          </CardTitle>
          <CardDescription>{strategy.duration.rationale}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Label className="text-xs">End date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={minDate.toISOString().split("T")[0]}
              className="w-48"
            />
            <span className="text-xs text-muted-foreground">
              Recommended: {strategy.duration.recommendedDays} days
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Success Criteria */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-4 w-4" />
            Success Criteria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {strategy.successCriteria.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={c}
                onChange={(e) => updateSuccessCriterion(i, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSuccessCriterion(i)}
                className="text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addSuccessCriterion}
            className="mt-1"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add criterion
          </Button>
        </CardContent>
      </Card>

      {/* Risks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4" />
            Risks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {strategy.risks.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                {r}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Narrative (collapsible) */}
      <Card>
        <CardHeader className="pb-3">
          <button
            type="button"
            onClick={() => setNarrativeOpen(!narrativeOpen)}
            className="flex w-full items-center justify-between"
          >
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Strategy Narrative
            </CardTitle>
            {narrativeOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {narrativeOpen && (
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {strategy.narrative}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

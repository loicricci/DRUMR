export interface KpiDefinition {
  metric: string;
  threshold: number;
  operator: "gte" | "lte" | "gt" | "lt" | "eq";
  current: number | null;
}

export interface PersonaDemographics {
  ageRange?: string;
  location?: string;
  role?: string;
  context?: string;
}

export interface ExperimentSignalEntry {
  experiment_id: string;
  verdict: string;
  key_learning: string;
  updated_at: string;
}

export interface MarketReportResult {
  categoryTrends: string;
  competitorPositioning: string;
  searchDemandSignals: string;
  whitespaceOpportunities: string;
  personaAdjustments: string;
}

export interface DailyReportSection {
  experimentSlug: string;
  kpiCurrent: Record<string, number>;
  kpiThresholds: Record<string, number>;
  deltaVsYesterday: Record<string, number>;
  recommendation: "continue" | "push" | "pause";
  rationale: string;
  diagnosis?: string;
  proposedActions: string[];
}

export interface AccountSettings {
  emailDigest: boolean;
  timezone: string;
  notifications: boolean;
}

export type AgentTask =
  | "daily_report"
  | "market_analysis"
  | "verdict"
  | "persona_update"
  | "hypothesis_suggest"
  | "experiment_strategy";

export interface AgentContextBlock {
  role: string;
  market: string;
  persona: string;
  product: string;
  experiment: string;
  task: AgentTask;
}

export interface ClaudeCallResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  promptVersion: string;
}

export interface ChannelStrategy {
  channel: string;
  rationale: string;
  tactics: string[];
}

export interface BudgetAllocation {
  totalAmount: number;
  currency: string;
  breakdown: { channel: string; amount: number; percentage: number }[];
}

export interface ExperimentStrategy {
  objective: string;
  hypothesis: string;
  channels: ChannelStrategy[];
  budget: BudgetAllocation;
  kpiPrimary: KpiDefinition;
  kpiSecondary: KpiDefinition[];
  duration: { recommendedDays: number; rationale: string };
  successCriteria: string[];
  risks: string[];
  narrative: string;
}

export type OAuthProvider = "ga4" | "google_ads" | "twitter" | "github" | "linkedin_ads" | "resend";

export type HypothesisSource = "agent" | "human";

export type HypothesisStatus = "pending" | "in_progress" | "used" | "skipped";

export interface HypothesisBacklogItem {
  id: string;
  personaId: string;
  productId: string;
  hypothesis: string;
  source: HypothesisSource;
  sourceExpId?: string | null;
  status: HypothesisStatus;
  proposedAt: Date;
  createdAt: Date;
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "@/lib/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Globe,
  FlaskConical,
  FileText,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Github,
  BarChart3,
} from "lucide-react";
import { ProductEditDialog } from "@/components/product-edit-dialog";

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
  draft: "secondary",
  running: "info",
  review: "warning",
  validated: "success",
  invalidated: "destructive",
  paused: "warning",
};

export default async function ProductHubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const latestMarket = product.marketReports[0];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <Badge variant="secondary">
              {product.stage.replace("_", "-")}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{product.description}</p>
          <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
            <span>{product.url}</span>
            <span>·</span>
            <span>{product.regions.join(", ")}</span>
          </div>
        </div>
        <ProductEditDialog product={product} />
      </div>

      {/* Data sources status */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "GitHub",
            connected: !!product.githubRepo,
            icon: Github,
          },
          {
            label: "GA4",
            connected: !!product.ga4PropertyId,
            icon: BarChart3,
          },
          {
            label: "Google Ads",
            connected: !!product.googleAdsCustomerId,
            icon: Globe,
          },
          {
            label: "Twitter/X Ads",
            connected: !!product.twitterAdsAccountId,
            icon: Globe,
          },
          {
            label: "LinkedIn Ads",
            connected: !!product.linkedinAdsAccountId,
            icon: Globe,
          },
          {
            label: "Resend",
            connected: !!product.resendAudienceId,
            icon: BarChart3,
          },
        ].map(({ label, connected, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-lg border p-3 text-sm"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{label}</span>
            {connected ? (
              <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
            ) : (
              <XCircle className="ml-auto h-4 w-4 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Persona card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Personas
              </CardTitle>
              <CardDescription>
                {product.personas.length} persona
                {product.personas.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href={`/products/${product.id}/persona`}>
                {product.personas.length === 0 ? (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Create
                  </>
                ) : (
                  <>
                    View
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Link>
            </Button>
          </CardHeader>
          {product.personas.length > 0 && (
            <CardContent>
              <div className="space-y-2">
                {product.personas.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border p-3 text-sm"
                  >
                    <p className="font-medium">{p.name}</p>
                    <p className="text-muted-foreground line-clamp-1">
                      {p.segmentDescription}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Market intelligence */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                Market Intelligence
              </CardTitle>
              <CardDescription>
                {latestMarket
                  ? `Last updated ${new Date(latestMarket.createdAt).toLocaleDateString()}`
                  : "No analysis run yet"}
              </CardDescription>
            </div>
            <Button asChild size="sm" variant={latestMarket ? "outline" : "default"}>
              <Link href={`/products/${product.id}/market`}>
                {latestMarket ? "View report" : "Run analysis"}
              </Link>
            </Button>
          </CardHeader>
        </Card>
      </div>

      {/* Experiments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FlaskConical className="h-5 w-5" />
              Experiments
            </CardTitle>
            <CardDescription>
              {product.experiments.length} experiment
              {product.experiments.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href={`/products/${product.id}/experiments/new`}>
              <Plus className="mr-1 h-4 w-4" />
              New experiment
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {product.experiments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No experiments yet. Create one to start testing your hypotheses.
            </div>
          ) : (
            <div className="space-y-3">
              {product.experiments.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/products/${product.id}/experiments/${exp.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {exp.slug}
                      </span>
                      <Badge variant={statusColors[exp.status]}>
                        {exp.status}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {exp.hypothesis}
                    </p>
                  </div>
                  <ArrowRight className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Recent Reports
            </CardTitle>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/reports">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {product.reports.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Reports will appear here once experiments are running.
            </p>
          ) : (
            <div className="space-y-2">
              {product.reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <span>
                    Daily Report —{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <Badge variant="outline">{r.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

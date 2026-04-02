"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MarkdownRenderer } from "@/components/reports/markdown-renderer";
import { FileText, Download, Eye } from "lucide-react";

interface ReportRow {
  id: string;
  type: string;
  contentMd: string;
  contentPdfUrl: string | null;
  createdAt: Date;
  product: { name: string };
  experiment: { slug: string } | null;
}

export function ReportsListClient({
  initialReports,
  products,
}: {
  initialReports: ReportRow[];
  products: { id: string; name: string }[];
}) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");

  const filtered = initialReports.filter((r) => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (productFilter !== "all" && r.product.name !== productFilter)
      return false;
    if (dateFrom && new Date(r.createdAt) < new Date(dateFrom)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-7 w-7" />
          Reports
        </h1>
        <p className="text-muted-foreground">
          All daily reports, verdicts, and market analyses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <Label className="text-xs">Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="verdict">Verdict</SelectItem>
              <SelectItem value="market">Market</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Product</Label>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">From date</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[160px]"
          />
        </div>
      </div>

      {/* Report list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No reports found</h3>
            <p className="text-sm text-muted-foreground">
              Reports are generated automatically when experiments run.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((report) => (
            <Card key={report.id}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      report.type === "daily"
                        ? "info"
                        : report.type === "verdict"
                          ? "success"
                          : "secondary"
                    }
                  >
                    {report.type}
                  </Badge>
                  <CardTitle className="text-sm font-medium">
                    {report.product.name}
                    {report.experiment && (
                      <span className="ml-2 font-mono text-muted-foreground">
                        {report.experiment.slug}
                      </span>
                    )}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {report.type.charAt(0).toUpperCase() +
                            report.type.slice(1)}{" "}
                          Report — {report.product.name}
                        </DialogTitle>
                      </DialogHeader>
                      <MarkdownRenderer content={report.contentMd} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const blob = new Blob([report.contentMd], {
                        type: "text/markdown",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${report.type}-${new Date(report.createdAt).toISOString().split("T")[0]}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { getReports } from "@/lib/actions/reports";
import { getProducts } from "@/lib/actions/products";
import { ReportsListClient } from "@/components/reports/reports-list";

export default async function ReportsPage() {
  const [reports, products] = await Promise.all([
    getReports(),
    getProducts(),
  ]);

  return (
    <ReportsListClient
      initialReports={reports}
      products={products.map((p) => ({ id: p.id, name: p.name }))}
    />
  );
}

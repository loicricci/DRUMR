import Link from "next/link";
import { getProducts } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, ArrowRight } from "lucide-react";
import { ProductActiveBadge } from "@/components/product-active-badge";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your products and track their progress
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Register product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No products yet</h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Register your first product to start building personas, running
              market analysis, and designing experiments.
            </p>
            <Button asChild>
              <Link href="/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Register your first product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <Card key={product.id} className="transition-colors hover:border-foreground/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {product.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProductActiveBadge active={product.active} />
                    <Badge variant="secondary">
                      {product.stage.replace("_", "-")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{product._count.personas} personas</span>
                    <span>{product._count.experiments} running</span>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/products/${product.id}`}>
                      Open
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

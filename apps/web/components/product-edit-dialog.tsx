"use client";

import { useState, useTransition } from "react";
import { updateProduct } from "@/lib/actions/products";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductEditDialogProps {
  product: {
    id: string;
    name: string;
    url: string;
    description: string;
    category: string;
    stage: string;
    regions: string[];
    active: boolean;
    githubRepo: string | null;
    ga4PropertyId: string | null;
    googleAdsCustomerId: string | null;
    twitterAdsAccountId: string | null;
    linkedinAdsAccountId: string | null;
    resendAudienceId: string | null;
  };
}

export function ProductEditDialog({ product }: ProductEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(product.stage);
  const [active, setActive] = useState(product.active);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateProduct(product.id, formData);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Update your product details and data source connections.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Product name</Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={product.name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-url">Product URL</Label>
            <Input
              id="edit-url"
              name="url"
              type="url"
              defaultValue={product.url}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">One-line description</Label>
            <Textarea
              id="edit-description"
              name="description"
              defaultValue={product.description}
              maxLength={500}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                name="category"
                defaultValue={product.category}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select name="stage" value={stage} onValueChange={setStage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre_launch">Pre-launch</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="pre_revenue">Pre-revenue</SelectItem>
                  <SelectItem value="traction">Traction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <input type="hidden" name="active" value={active ? "true" : "false"} />
            <button
              type="button"
              onClick={() => setActive(!active)}
              className="flex w-full items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
            >
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  active
                    ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                    : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
                }`}
              />
              <span
                className={
                  active
                    ? "font-medium text-emerald-700 dark:text-emerald-400"
                    : "font-medium text-amber-700 dark:text-amber-400"
                }
              >
                {active ? "Active" : "Under construction"}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                Click to toggle
              </span>
            </button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-regions">Target regions</Label>
            <Input
              id="edit-regions"
              name="regions"
              defaultValue={product.regions.join(", ")}
              required
            />
          </div>

          <Separator />

          <p className="text-sm font-medium">Data sources</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-githubRepo">GitHub repository</Label>
              <Input
                id="edit-githubRepo"
                name="githubRepo"
                defaultValue={product.githubRepo ?? ""}
                placeholder="owner/repo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ga4PropertyId">GA4 property ID</Label>
              <Input
                id="edit-ga4PropertyId"
                name="ga4PropertyId"
                defaultValue={product.ga4PropertyId ?? ""}
                placeholder="properties/123456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-googleAdsCustomerId">
                Google Ads customer ID
              </Label>
              <Input
                id="edit-googleAdsCustomerId"
                name="googleAdsCustomerId"
                defaultValue={product.googleAdsCustomerId ?? ""}
                placeholder="123-456-7890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-twitterAdsAccountId">
                Twitter/X Ads account ID
              </Label>
              <Input
                id="edit-twitterAdsAccountId"
                name="twitterAdsAccountId"
                defaultValue={product.twitterAdsAccountId ?? ""}
                placeholder="abc123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-linkedinAdsAccountId">
                LinkedIn Ads account ID
              </Label>
              <Input
                id="edit-linkedinAdsAccountId"
                name="linkedinAdsAccountId"
                defaultValue={product.linkedinAdsAccountId ?? ""}
                placeholder="123456789"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="edit-resendAudienceId">
                Resend audience ID
              </Label>
              <Input
                id="edit-resendAudienceId"
                name="resendAudienceId"
                defaultValue={product.resendAudienceId ?? ""}
                placeholder="aud_..."
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

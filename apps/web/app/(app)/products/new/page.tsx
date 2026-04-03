"use client";

import { createProduct } from "@/lib/actions/products";
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
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function NewProductPage() {
  const [stage, setStage] = useState("pre_revenue");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Register a product
        </h1>
        <p className="text-muted-foreground">
          Tell DrumR about your product so the CEO agent can start working for
          you.
        </p>
      </div>

      <form action={createProduct}>
        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
            <CardDescription>
              Basic information about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                name="name"
                placeholder="My SaaS Product"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Product URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://myproduct.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">One-line description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A tool that helps founders validate product-market fit..."
                maxLength={500}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., SaaS, E-commerce, Fintech"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Stage</Label>
                <Select
                  name="stage"
                  value={stage}
                  onValueChange={setStage}
                >
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
              <Label htmlFor="regions">Target regions</Label>
              <Input
                id="regions"
                name="regions"
                placeholder="US, EU, UK (comma-separated)"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Data sources</CardTitle>
            <CardDescription>
              Connect your tools. All optional — the platform works with
              whatever data is available.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="githubRepo">GitHub repository</Label>
              <Input
                id="githubRepo"
                name="githubRepo"
                placeholder="owner/repo"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="ga4PropertyId">GA4 property ID</Label>
              <Input
                id="ga4PropertyId"
                name="ga4PropertyId"
                placeholder="properties/123456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleAdsCustomerId">
                Google Ads customer ID
              </Label>
              <Input
                id="googleAdsCustomerId"
                name="googleAdsCustomerId"
                placeholder="123-456-7890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterAdsAccountId">
                Twitter/X Ads account ID
              </Label>
              <Input
                id="twitterAdsAccountId"
                name="twitterAdsAccountId"
                placeholder="abc123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinAdsAccountId">
                LinkedIn Ads account ID
              </Label>
              <Input
                id="linkedinAdsAccountId"
                name="linkedinAdsAccountId"
                placeholder="123456789"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="resendAudienceId">Resend audience ID</Label>
              <Input
                id="resendAudienceId"
                name="resendAudienceId"
                placeholder="aud_..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg">
            Register product
          </Button>
        </div>
      </form>
    </div>
  );
}

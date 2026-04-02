"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

interface AccountData {
  id: string;
  name: string;
  email: string;
  plan: string;
  settings: {
    emailDigest?: boolean;
    timezone?: string;
    notifications?: boolean;
  };
}

export default function SettingsPage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [name, setName] = useState("");
  const [emailDigest, setEmailDigest] = useState(true);
  const [timezone, setTimezone] = useState("UTC");
  const [saving, setSaving] = useState(false);

  const loadAccount = useCallback(async () => {
    const res = await fetch("/api/account");
    if (res.ok) {
      const data = await res.json();
      setAccount(data);
      setName(data.name);
      setEmailDigest(data.settings?.emailDigest ?? true);
      setTimezone(data.settings?.timezone ?? "UTC");
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          settings: { emailDigest, timezone, notifications: true },
        }),
      });
      if (res.ok) {
        toast.success("Settings saved");
        loadAccount();
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (!account) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-7 w-7" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={account.email} disabled />
          </div>
          <div className="flex items-center gap-2">
            <Label>Plan</Label>
            <Badge variant={account.plan === "pro" ? "default" : "secondary"}>
              {account.plan.toUpperCase()}
            </Badge>
            {account.plan === "free" && (
              <span className="text-xs text-muted-foreground">
                1 product limit
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how and when you receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email digest</p>
              <p className="text-xs text-muted-foreground">
                Daily summary of all experiment recommendations
              </p>
            </div>
            <Select
              value={emailDigest ? "on" : "off"}
              onValueChange={(v) => setEmailDigest(v === "on")}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on">On</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern (US)</SelectItem>
                <SelectItem value="America/Chicago">Central (US)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific (US)</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Plan limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-sm">
            <div className="flex justify-between">
              <span>Products</span>
              <span>{account.plan === "free" ? "1" : "5"} max</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Persona } from "@drumr/db";
import { updatePersona } from "@/lib/actions/personas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface PersonaCardProps {
  persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(persona.name);
  const [segmentDescription, setSegmentDescription] = useState(
    persona.segmentDescription
  );
  const [primaryPain, setPrimaryPain] = useState(persona.primaryPain);
  const [currentSolution, setCurrentSolution] = useState(
    persona.currentSolution
  );
  const [triggerEvent, setTriggerEvent] = useState(persona.triggerEvent);
  const [painLanguage, setPainLanguage] = useState(
    persona.painLanguage.join(", ")
  );
  const [channels, setChannels] = useState(persona.channels.join(", "));

  async function handleSave() {
    try {
      await updatePersona(persona.id, {
        name,
        segmentDescription,
        primaryPain,
        currentSolution,
        triggerEvent,
        painLanguage: painLanguage.split(",").map((s) => s.trim()).filter(Boolean),
        channels: channels.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setEditing(false);
      toast.success("Persona updated");
    } catch {
      toast.error("Failed to update persona");
    }
  }

  const demographics = persona.demographics as Record<string, string> | null;
  const signals = persona.experimentSignals as Record<string, unknown> | null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          {editing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-semibold"
            />
          ) : (
            <CardTitle>{persona.name}</CardTitle>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Version: {new Date(persona.version).toLocaleDateString()}
          </p>
        </div>
        {editing ? (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Field
          label="Segment"
          value={segmentDescription}
          editing={editing}
          onChange={setSegmentDescription}
          multiline
        />
        <Field
          label="Primary pain"
          value={primaryPain}
          editing={editing}
          onChange={setPrimaryPain}
          multiline
        />
        <Field
          label="Current solution"
          value={currentSolution}
          editing={editing}
          onChange={setCurrentSolution}
          multiline
        />
        <Field
          label="Trigger event"
          value={triggerEvent}
          editing={editing}
          onChange={setTriggerEvent}
          multiline
        />
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Pain language
          </p>
          {editing ? (
            <Input
              value={painLanguage}
              onChange={(e) => setPainLanguage(e.target.value)}
              placeholder="Comma-separated phrases"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {persona.painLanguage.map((phrase) => (
                <Badge key={phrase} variant="outline" className="text-xs">
                  {phrase}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Channels
          </p>
          {editing ? (
            <Input
              value={channels}
              onChange={(e) => setChannels(e.target.value)}
              placeholder="Comma-separated channels"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {persona.channels.map((ch) => (
                <Badge key={ch} variant="secondary" className="text-xs">
                  {ch}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {demographics && Object.keys(demographics).length > 0 && (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Demographics
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(demographics).map(([k, v]) =>
                v ? (
                  <div key={k}>
                    <span className="text-muted-foreground capitalize">
                      {k.replace(/([A-Z])/g, " $1")}:{" "}
                    </span>
                    {v}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {signals && Object.keys(signals).length > 0 && (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Experiment signals
            </p>
            <div className="space-y-1 text-sm">
              {Object.entries(signals).map(([slug, data]) => (
                <div key={slug} className="rounded border p-2">
                  <span className="font-mono text-xs">{slug}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    — {JSON.stringify(data)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {editing ? (
        multiline ? (
          <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <Input value={value} onChange={(e) => onChange(e.target.value)} />
        )
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  );
}

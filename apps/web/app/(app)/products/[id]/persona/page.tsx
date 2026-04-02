"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ChatPanel, type ChatMessage } from "@/components/chat/chat-panel";
import { PersonaCard } from "@/components/personas/persona-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { createPersona } from "@/lib/actions/personas";
import { toast } from "sonner";
import type { Persona } from "@drumr/db";

export default function PersonaPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Let's build a persona card for your product. I'll ask you a series of questions to understand your target user.\n\nFirst: Who is this person? What's their job title or life situation?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);

  const loadPersonas = useCallback(async () => {
    try {
      const res = await fetch(`/api/personas?productId=${productId}`);
      if (res.ok) {
        setPersonas(await res.json());
      }
    } finally {
      setLoadingPersonas(false);
    }
  }, [productId]);

  useEffect(() => {
    loadPersonas();
  }, [loadPersonas]);

  async function handleSend(content: string) {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const jsonMatch = data.content.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const personaData = JSON.parse(jsonMatch[1]);
          const newPersona = await createPersona({
            productId,
            name: personaData.name || "Untitled Persona",
            segmentDescription: personaData.segmentDescription || "",
            primaryPain: personaData.primaryPain || "",
            currentSolution: personaData.currentSolution || "",
            triggerEvent: personaData.triggerEvent || "",
            painLanguage: personaData.painLanguage || [],
            channels: personaData.channels || [],
            demographics: personaData.demographics || {},
          });
          setPersonas((prev) => [newPersona, ...prev]);
          setShowChat(false);
          toast.success("Persona created successfully!");
        } catch {
          // JSON not valid yet — keep chatting
        }
      }
    } catch {
      toast.error("Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRebuild() {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Let's rebuild the persona card. I'll ask you a series of questions.\n\nWho is this person? What's their job title or life situation?",
      },
    ]);
    setShowChat(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6" />
            Personas
          </h1>
          <p className="text-muted-foreground">
            Build and refine your target user personas with AI assistance
          </p>
        </div>
        <Button onClick={() => setShowChat(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create persona
        </Button>
      </div>

      {showChat && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
            placeholder="Describe your target user..."
            className="h-[500px]"
          />
          <Card className="h-[500px] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-lg">Persona preview</CardTitle>
              <CardDescription>
                Fields will populate as you answer questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete the conversation to generate your persona card.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {loadingPersonas ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading personas...
        </div>
      ) : personas.length === 0 && !showChat ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No personas yet</h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Create your first persona with AI assistance. The assistant will
              guide you through structured questions.
            </p>
            <Button onClick={() => setShowChat(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first persona
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {personas.map((p) => (
            <div key={p.id}>
              <PersonaCard persona={p} />
              <div className="mt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={handleRebuild}>
                  Rebuild with AI
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

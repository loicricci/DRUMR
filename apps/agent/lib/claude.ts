import Anthropic from "@anthropic-ai/sdk";
import type { ClaudeCallResult } from "@drumr/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: {
    maxTokens?: number;
    tools?: Anthropic.Messages.Tool[];
    promptVersion?: string;
  }
): Promise<ClaudeCallResult> {
  let lastError: Error | null = null;
  const startMs = Date.now();
  const promptVersion = options?.promptVersion ?? "v1";

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const params: Anthropic.Messages.MessageCreateParamsNonStreaming = {
        model: "claude-sonnet-4-20250514",
        max_tokens: options?.maxTokens ?? 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      };

      if (options?.tools?.length) {
        params.tools = options.tools;
      }

      const response = await client.messages.create(params);

      const textBlock = response.content.find((block) => block.type === "text");
      return {
        text: textBlock?.type === "text" ? textBlock.text : "",
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        durationMs: Date.now() - startMs,
        promptVersion,
      };
    } catch (error) {
      lastError = error as Error;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

export async function callClaudeWithTools(
  systemPrompt: string,
  userMessage: string,
  tools: Anthropic.Messages.Tool[]
): Promise<Anthropic.Messages.Message> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
        tools,
      });
    } catch (error) {
      lastError = error as Error;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

export { client };

import Anthropic from "@anthropic-ai/sdk";

type AiProvider = "anthropic" | "openai";

interface GenerateAiTextInput {
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
  temperature?: number;
}

interface GenerateAiTextResult {
  text: string;
  provider: AiProvider;
  model: string;
}

function parseProvider(value: string): AiProvider | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "anthropic") return "anthropic";
  if (normalized === "openai") return "openai";
  return null;
}

function uniqueProviders(providers: AiProvider[]) {
  return Array.from(new Set(providers));
}

function getProviderOrder(): AiProvider[] {
  const configuredOrder = process.env.AI_PROVIDER_ORDER
    ?.split(",")
    .map((provider) => parseProvider(provider))
    .filter((provider): provider is AiProvider => Boolean(provider));

  const primaryProvider = parseProvider(process.env.AI_PRIMARY_PROVIDER || "");

  if (configuredOrder && configuredOrder.length > 0) {
    if (primaryProvider) {
      return uniqueProviders([primaryProvider, ...configuredOrder]);
    }
    return uniqueProviders(configuredOrder);
  }

  if (primaryProvider) {
    const fallback = primaryProvider === "anthropic" ? "openai" : "anthropic";
    return [primaryProvider, fallback];
  }

  return ["anthropic", "openai"];
}

async function generateWithAnthropic(input: GenerateAiTextInput): Promise<GenerateAiTextResult> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";
  const anthropic = new Anthropic({ apiKey: key });
  const response = await anthropic.messages.create({
    model,
    max_tokens: input.maxTokens,
    temperature: input.temperature,
    system: input.systemPrompt,
    messages: [{ role: "user", content: input.userPrompt }],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) {
    throw new Error("Anthropic returned an empty response.");
  }

  return { text, provider: "anthropic", model };
}

function extractOpenAiMessageContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => {
      if (!part || typeof part !== "object") return "";
      const text = (part as { text?: unknown }).text;
      return typeof text === "string" ? text : "";
    })
    .join("")
    .trim();
}

async function generateWithOpenAi(input: GenerateAiTextInput): Promise<GenerateAiTextResult> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: input.temperature ?? 0.2,
      max_tokens: input.maxTokens,
      messages: [
        { role: "system", content: input.systemPrompt },
        { role: "user", content: input.userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed with status ${response.status}. ${details}`.trim());
  }

  const payload = await response.json() as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
  };

  const text = extractOpenAiMessageContent(payload.choices?.[0]?.message?.content);
  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  return { text, provider: "openai", model };
}

export async function generateAiText(input: GenerateAiTextInput): Promise<GenerateAiTextResult> {
  const order = getProviderOrder();
  const errors: string[] = [];

  for (const provider of order) {
    try {
      if (provider === "anthropic") {
        return await generateWithAnthropic(input);
      }
      return await generateWithOpenAi(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${provider}: ${message}`);
    }
  }

  throw new Error(
    `No AI provider succeeded. ${errors.join(" | ")}`
  );
}


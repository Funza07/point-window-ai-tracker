import { env } from "../config/env.js";

const DEFAULT_MODEL = "gemini-2.0-flash";

const isProviderConfigured = () => {
  const key = env.GEMINI_API_KEY || env.AI_PROVIDER_API_KEY;
  return Boolean(String(key || "").trim());
};

const resolveModel = () => String(env.GEMINI_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL;

export const getAiProviderStatus = () => ({
  providerConfigured: isProviderConfigured(),
  provider: "gemini",
  model: resolveModel(),
});

const fallbackReply = ({ spoilerSafe = true }) =>
  spoilerSafe
    ? "Spoiler-safe mode is on. I can help with concise anime/manga/manhwa guidance using your available metadata."
    : "I can help with concise anime/manga/manhwa guidance using your available metadata.";

export async function generateAiResponse({ systemPrompt = "", userPrompt = "", context = {}, maxTokens = 400 } = {}) {
  if (!isProviderConfigured()) {
    return {
      ok: false,
      code: "AI_NOT_CONFIGURED",
      message: "AI provider is not configured",
      reply: fallbackReply({ spoilerSafe: context?.spoilerSafe !== false }),
    };
  }

  const apiKey = String(env.GEMINI_API_KEY || env.AI_PROVIDER_API_KEY).trim();
  const model = resolveModel();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: String(systemPrompt || "").slice(0, 8000) }],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${String(userPrompt || "").slice(0, 4000)}\n\nContext:\n${JSON.stringify(context).slice(0, 12000)}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: Math.max(120, Math.min(Number(maxTokens) || 400, 1200)),
        temperature: 0.5,
      },
    }),
  });

  if (response.status === 429) {
    return { ok: false, code: "AI_RATE_LIMITED", message: "AI provider is temporarily rate-limited" };
  }

  if (!response.ok) {
    return { ok: false, code: "AI_PROVIDER_ERROR", message: "AI provider request failed" };
  }

  const data = await response.json().catch(() => null);
  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => String(part?.text || ""))
      .join("\n")
      .trim() || "";

  if (!reply) {
    return { ok: false, code: "AI_EMPTY_RESPONSE", message: "AI provider returned an empty response" };
  }

  return { ok: true, reply, provider: "gemini", model };
}

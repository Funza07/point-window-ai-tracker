import { env } from "../config/env.js";
import { getAniListSearchStatus } from "./anilist.service.js";

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

const isProviderConfigured = () => {
  const key = env.GEMINI_API_KEY || env.AI_PROVIDER_API_KEY;
  return Boolean(String(key || "").trim());
};

const resolveModel = () => String(env.GEMINI_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL;

export const getAiProviderStatus = () => ({
  providerConfigured: isProviderConfigured(),
  provider: "gemini",
  model: resolveModel(),
  cooldownActive: Boolean(getAniListSearchStatus()?.cooldownActive),
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
  const hasContext = context && typeof context === "object" && Object.keys(context).length > 0;
  const finalSystemPrompt = String(systemPrompt || "").trim().slice(0, 8000);
  const finalUserPrompt = hasContext
    ? `Context:\n${JSON.stringify(context).slice(0, 12000)}\n\nUser question:\n${String(userPrompt || "").trim().slice(0, 4000)}`
    : String(userPrompt || "").trim().slice(0, 4000);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: finalUserPrompt,
            },
          ],
        },
      ],
      systemInstruction: {
        parts: [
          {
            text: finalSystemPrompt,
          },
        ],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: Number(maxTokens) || 700,
      },
    }),
  });

  if (!response.ok) {
    const status = Number(response.status) || 500;
    const rawText = await response.text().catch(() => "");
    let parsed = null;
    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsed = null;
    }

    const providerStatus = String(parsed?.error?.status || "").trim() || null;
    const providerMessage = String(parsed?.error?.message || "").trim() || null;
    const providerCode = parsed?.error?.code ?? null;

    console.error("[aiProvider] Gemini request failed", {
      status,
      providerStatus,
      providerCode,
      providerMessage,
    });

    let code = "AI_PROVIDER_ERROR";
    if (status === 429) code = "AI_RATE_LIMITED";
    else if (status === 401 || status === 403) code = "AI_AUTH_ERROR";
    else if (status === 404) code = "AI_MODEL_NOT_FOUND";
    else if (status === 400) code = "AI_BAD_REQUEST";

    let safeMessage = "AI provider request failed";
    if (code === "AI_RATE_LIMITED") safeMessage = "AI provider is temporarily rate-limited";
    else if (code === "AI_AUTH_ERROR") safeMessage = "AI provider authentication failed";
    else if (code === "AI_MODEL_NOT_FOUND") safeMessage = "Configured Gemini model was not found";
    else if (code === "AI_BAD_REQUEST") safeMessage = "AI provider rejected request format";

    const error = new Error(safeMessage);
    error.code = code;
    error.status = status;
    error.safeMessage = safeMessage;
    error.providerMessage = providerMessage || null;
    error.providerStatus = providerStatus || null;
    error.providerCode = providerCode;
    throw error;
  }

  const data = await response.json().catch(() => null);
  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => String(part?.text || ""))
      .join("")
      .trim() || "";

  if (!reply) {
    const error = new Error("AI provider returned empty response");
    error.code = "AI_EMPTY_RESPONSE";
    error.status = 200;
    error.safeMessage = "AI provider returned empty response";
    throw error;
  }

  return { ok: true, reply, provider: "gemini", model };
}

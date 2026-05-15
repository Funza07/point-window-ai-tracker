import { buildAiContext } from "../services/aiContext.service.js";
import { generateAiResponse } from "../services/aiProvider.service.js";

const MAX_MESSAGE_LENGTH = 1200;
const MAX_MOOD_LENGTH = 160;

const isValidTitleId = (titleId) => /^[A-Za-z0-9_-]{2,120}$/.test(String(titleId || "").trim());
const trimText = (value = "", max = 1200) => String(value || "").trim().slice(0, max);

const buildSystemPrompt = ({ mode = "chat", spoilerSafe = true } = {}) =>
  [
    "You are Point Window AI, a concise assistant focused on anime, manga, and manhwa.",
    "Use only provided context and generally known franchise-level knowledge.",
    spoilerSafe ? "Spoiler-safe mode is ON: avoid major spoilers and twist reveals." : "Spoilers are allowed, but still be concise and relevant.",
    "If details are unknown from context, explicitly say uncertainty instead of inventing facts.",
    mode === "recommendations" ? "Prioritize recommendations tailored to user's library and progress." : null,
    mode === "title" ? "Focus on the selected title metadata and the user's question." : null,
  ]
    .filter(Boolean)
    .join(" ");

const sendAiResult = async ({ res, mode, userId, prompt, titleId, title, spoilerSafe, maxTokens = 450 }) => {
  try {
    const context = await buildAiContext({ userId, titleId, title, spoilerSafe });
    const result = await generateAiResponse({
      systemPrompt: buildSystemPrompt({ mode, spoilerSafe: context.spoilerSafe }),
      userPrompt: prompt,
      context,
      maxTokens,
    });

    if (!result.ok && result.code === "AI_NOT_CONFIGURED") {
      return res.status(200).json({ success: false, message: "AI provider is not configured" });
    }

    if (!result.ok) {
      return res.status(200).json({
        success: false,
        message: result.message || "AI response unavailable right now",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        reply: result.reply,
        provider: result.provider,
        model: result.model,
      },
    });
  } catch {
    return res.status(200).json({
      success: false,
      message: "AI response unavailable right now",
    });
  }
};

export const chat = async (req, res) => {
  const message = trimText(req.body?.message, MAX_MESSAGE_LENGTH);
  if (!message) return res.status(400).json({ success: false, message: "message is required" });
  if (message.length > MAX_MESSAGE_LENGTH) return res.status(400).json({ success: false, message: "message is too long" });

  return sendAiResult({
    res,
    mode: "chat",
    userId: req.user?.id,
    prompt: message,
    spoilerSafe: req.body?.spoilerSafe !== false,
    maxTokens: 420,
  });
};

export const titleChat = async (req, res) => {
  const titleId = String(req.body?.titleId || "").trim();
  const question = trimText(req.body?.question || req.body?.message, MAX_MESSAGE_LENGTH);
  if (!titleId || !isValidTitleId(titleId)) return res.status(400).json({ success: false, message: "valid titleId is required" });
  if (!question) return res.status(400).json({ success: false, message: "question is required" });

  return sendAiResult({
    res,
    mode: "title",
    userId: req.user?.id,
    prompt: question,
    titleId,
    title: req.body?.title,
    spoilerSafe: req.body?.spoilerSafe !== false,
    maxTokens: 420,
  });
};

export const recommendations = async (req, res) => {
  const mood = trimText(req.body?.mood, MAX_MOOD_LENGTH);
  const preferences = trimText(req.body?.preferences, 500);
  const prompt = `Recommend anime/manga/manhwa for this user.${mood ? ` Mood: ${mood}.` : ""}${preferences ? ` Preferences: ${preferences}.` : ""}`;

  return sendAiResult({
    res,
    mode: "recommendations",
    userId: req.user?.id,
    prompt,
    spoilerSafe: req.body?.spoilerSafe !== false,
    maxTokens: 500,
  });
};

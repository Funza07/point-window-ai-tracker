import { env } from "../config/env.js";

export async function generateSafeReply(mode, payload) {
  const spoilerFree = payload?.context?.spoiler_free !== false;
  const title = payload?.context?.title?.title || payload?.title?.title || "this title";
  if (!env.AI_PROVIDER_API_KEY || env.AI_PROVIDER_API_KEY === "replace_me") {
    return spoilerFree
      ? `Spoiler-free mode is on. Based on metadata and synopsis, ${title} is a strong fit. (Dev fallback response)`
      : `High-level summary only for ${title}. (Dev fallback response)`;
  }
  // TODO: implement provider SDK/API call on server only. Never expose key to client.
  return `AI ${mode} response placeholder for ${title}.`;
}

export const sanitizeText = (value="") => String(value).replace(/[<>]/g, "").trim().slice(0, 4000);
export const sanitizeLink = (value="") => {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.toString();
  } catch {
    return "";
  }
};

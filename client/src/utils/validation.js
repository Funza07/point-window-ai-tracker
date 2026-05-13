export const isValidUrl = (value) => {
  if (!value) return true;
  try { new URL(value); return true; } catch { return false; }
};

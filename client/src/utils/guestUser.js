const GUEST_KEY = "pw_guest_id";

const randomToken = () => Math.random().toString(36).slice(2, 10);

export const getGuestUserId = () => {
  const existing = localStorage.getItem(GUEST_KEY);
  if (existing) return existing;
  const next = `guest_${randomToken()}_${Date.now()}`;
  localStorage.setItem(GUEST_KEY, next);
  return next;
};

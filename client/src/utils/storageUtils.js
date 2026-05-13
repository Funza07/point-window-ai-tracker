export const getLib = () => { try { return JSON.parse(localStorage.getItem("pw_lib") || "[]"); } catch { return []; } };
export const saveLib = (l) => localStorage.setItem("pw_lib", JSON.stringify(l));
export const upsertItem = (item, lib) => { const next = lib.filter(x => x.id !== item.id); next.unshift(item); saveLib(next); return next; };
export const removeItem = (id, lib) => { const n = lib.filter(x => x.id !== id); saveLib(n); return n; };
export const getChat = () => { try { return JSON.parse(localStorage.getItem("pw_chat") || "[]"); } catch { return []; } };
export const saveChat = (c) => localStorage.setItem("pw_chat", JSON.stringify(c));


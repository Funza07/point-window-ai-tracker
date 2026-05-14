import { listLibrary, openLibraryLink, removeLibraryItem, sanitizeLibraryPatch, sanitizeLibraryPayload, updateLibraryItem, upsertLibraryItem } from "../services/library.service.js";
export const getLibrary = async (req, res) => {
  const data = await listLibrary(req.user.id);
  res.json({ success: true, data });
};

export const createLibraryItem = async (req, res) => {
  const payload = sanitizeLibraryPayload(req.body);
  if (!payload.id) return res.status(400).json({ success: false, message: "title id is required", data: null });
  const data = await upsertLibraryItem(req.user.id, payload);
  res.status(201).json({ success: true, data, message: "Library item saved" });
};

export const patchLibraryItem = async (req, res) => {
  const payload = sanitizeLibraryPatch(req.body);
  const data = await updateLibraryItem(req.user.id, req.params.titleId, payload);
  res.json({ success: true, data, message: "Library item updated" });
};

export const deleteLibraryItem = async (req, res) => {
  const data = await removeLibraryItem(req.user.id, req.params.titleId);
  res.json({ success: true, data, message: "Library item removed" });
};

export const openSavedLink = async (req, res) => {
  const result = await openLibraryLink(req.user.id, req.params.titleId);
  res.json({
    success: true,
    data: { titleId: req.params.titleId, openedAt: result.openedAt, item: result.item },
    message: "Open-link event tracked",
  });
};

import { libraryStore, sanitizeLibraryPayload } from "../services/library.service.js";
export const getLibrary = async (req, res) => {
  res.json({ success: true, data: libraryStore.get(req.user.id) });
};

export const createLibraryItem = async (req, res) => {
  const payload = sanitizeLibraryPayload(req.body);
  if (!payload.id) return res.status(400).json({ success: false, message: "title id is required", data: null });
  const data = libraryStore.upsert(req.user.id, payload);
  res.status(201).json({ success: true, data, message: "Library item saved" });
};

export const patchLibraryItem = async (req, res) => {
  const payload = sanitizeLibraryPayload({ ...req.body, id: req.params.titleId });
  const data = libraryStore.patch(req.user.id, req.params.titleId, payload);
  res.json({ success: true, data, message: "Library item updated" });
};

export const deleteLibraryItem = async (req, res) => {
  libraryStore.remove(req.user.id, req.params.titleId);
  res.json({ success: true, data: libraryStore.get(req.user.id), message: "Library item removed" });
};

export const openSavedLink = async (req, res) => {
  const result = libraryStore.markOpened(req.user.id, req.params.titleId);
  res.json({
    success: true,
    data: { titleId: req.params.titleId, openedAt: result.openedAt, item: result.item },
    message: "Open-link event tracked",
  });
};

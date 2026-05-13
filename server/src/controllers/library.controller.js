import { libraryStore, sanitizeLibraryPayload } from "../services/library.service.js";
export const getLibrary = async (req,res)=>res.json({ data: libraryStore.get(req.user.id) });
export const createLibraryItem = async (req,res)=>res.status(201).json({ data: libraryStore.upsert(req.user.id, sanitizeLibraryPayload(req.body)) });
export const patchLibraryItem = async (req,res)=>res.json({ data: libraryStore.patch(req.user.id, req.params.titleId, sanitizeLibraryPayload(req.body)) });
export const deleteLibraryItem = async (req,res)=>{ libraryStore.remove(req.user.id, req.params.titleId); res.json({ data: libraryStore.get(req.user.id) }); };
export const openSavedLink = async (req,res)=>res.json({ data: { titleId:req.params.titleId, openedAt:new Date().toISOString() } });

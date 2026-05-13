import { createContext, useContext, useEffect, useState } from "react";
import { libraryService } from "../services/libraryService";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState([]);
  useEffect(() => { libraryService.list().then((r) => setLibrary(r.data || [])); }, []);
  const addToLibrary = async (item) => setLibrary((await libraryService.upsert({ ...item, progress: item.progress || 0, score: item.score || 0 })).data || []);
  const removeFromLibrary = async (titleId) => setLibrary((await libraryService.remove(titleId)).data || []);
  const updateLibraryItem = async (titleId, patch) => setLibrary((await libraryService.update(titleId, patch)).data || []);
  return <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary, updateLibraryItem }}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => useContext(LibraryContext);

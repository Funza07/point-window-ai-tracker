import { useEffect, useState } from "react";
import { titleService } from "../services/titleService";
export function useTitles(query = "") { const [titles,setTitles]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); useEffect(()=>{setLoading(true); titleService.search({q:query}).then((r)=>setTitles(r.data||[])).catch((e)=>setError(e.message)).finally(()=>setLoading(false));},[query]); return { titles, loading, error }; }

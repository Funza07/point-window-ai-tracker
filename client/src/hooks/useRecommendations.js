import { useEffect, useState } from "react";
import { recommendationService } from "../services/recommendationService";
export function useRecommendations(){ const [recommendations,setRecommendations]=useState([]); useEffect(()=>{recommendationService.list().then((r)=>setRecommendations(r.data||[]));},[]); return { recommendations, setRecommendations }; }

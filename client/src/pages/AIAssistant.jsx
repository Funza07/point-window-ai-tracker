import React, { useState } from "react";
import { useAIChat } from "../hooks/useAIChat";
import AIChatBox from "../components/ai/AIChatBox";
import AIMessageBubble from "../components/ai/AIMessageBubble";
import AIPromptChips from "../components/ai/AIPromptChips";
import SpoilerToggle from "../components/ai/SpoilerToggle";

export default function AIAssistant(){ const [text,setText]=useState(""); const [spoilerFree,setSpoilerFree]=useState(true); const {messages,send,loading}=useAIChat(); const quick=["Recommend 3 hype anime","Spoiler-free summary","What to watch next?"]; return <div className="page-enter"><SpoilerToggle value={spoilerFree} onChange={setSpoilerFree}/><AIPromptChips chips={quick} onPick={setText}/><AIChatBox>{messages.map((m,i)=><AIMessageBubble key={i} role={m.role} content={m.content}/>)}{loading&&<AIMessageBubble role="assistant" content="Thinking..."/>}</AIChatBox><div style={{display:"flex",gap:8,marginTop:10}}><input className="input" value={text} onChange={(e)=>setText(e.target.value)}/><button onClick={()=>{if(text.trim()) send(text,{spoiler_free:spoilerFree}); setText("");}}>Send</button></div></div>; }

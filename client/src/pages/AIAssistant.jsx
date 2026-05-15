import { useEffect, useRef, useState } from "react";
import { aiService } from "../services/aiService";
import GlassCard from "../components/common/GlassCard";
import Btn from "../components/common/Button";
import { mockTitles } from "../data/mockTitles";
import { getChat, saveChat } from "../utils/storageUtils";

export default function AIAssistant({ lib, isMobile = false }) {
  const [messages, setMessages] = useState(getChat);
  const [text, setText] = useState("");
  const [spoiler, setSpoiler] = useState(true);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const prompts = ["Recommend something like Solo Leveling", "What should I read next?", "Best short completed anime?", "Manhwa with OP MC", "Compare AoT vs Death Note"];
  const recentTitles = lib.slice(0, 3).map((x) => mockTitles.find((t) => t.id === x.id)?.title).filter(Boolean);

  const send = async (content) => {
    if (!content.trim() || loading) return;
    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setText("");
    setLoading(true);
    try {
      const aiResponse = await aiService.chat({
        message: content,
        context: { spoiler_free: spoiler, recent_titles: recentTitles, library_size: lib.length },
      });
      const reply = aiResponse?.data?.reply || "Error getting response.";
      const updated = [...newMessages, { role: "ai", content: reply }];
      setMessages(updated);
      saveChat(updated);
    } catch {
      const updated = [...newMessages, { role: "ai", content: "Connection error. Please try again." }];
      setMessages(updated);
    }
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="page-enter" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 260px", gap: 16, alignItems: "start", paddingBottom: isMobile ? 90 : 0 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 10, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 900, fontSize: isMobile ? 28 : 34, color: "#f0ebff", margin: "0 0 4px" }}>AI Assistant</h1>
            <p style={{ fontSize: isMobile ? 12 : 13, color: "#7a6b84", margin: 0 }}>Powered by Claude - Your personal anime sage</p>
          </div>
          <button onClick={() => setSpoiler((v) => !v)} style={{ padding: "8px 16px", minHeight: 40, borderRadius: 99, fontSize: 11, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", border: `1px solid ${spoiler ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.12)"}`, background: spoiler ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.04)", color: spoiler ? "#22d3ee" : "#7a6b84", transition: "all 0.25s", boxShadow: spoiler ? "0 0 12px rgba(34,211,238,0.2)" : "none" }}>
            {spoiler ? "Spoiler-Free ON" : "Spoilers Allowed"}
          </button>
        </div>
        <GlassCard hover={false} style={{ padding: 0, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ height: isMobile ? 360 : 400, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            {!messages.length && (
              <div style={{ textAlign: "center", paddingTop: 48, opacity: 0, animation: "fadeSlideUp 0.5s ease 0.2s forwards" }}>
                <div style={{ fontSize: 52, marginBottom: 14, filter: "drop-shadow(0 0 20px rgba(168,85,247,0.6))" }}>AI</div>
                <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, color: "#d8b4fe", marginBottom: 6 }}>Aetheris is ready</p>
                <p style={{ fontSize: 13, color: "#7a6b84" }}>Ask for recommendations, summaries, or anything anime/manga/manhwa</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, justifyContent: m.role === "user" ? "flex-end" : "flex-start", opacity: 0, animation: "fadeSlideUp 0.3s ease forwards" }}>
                {m.role === "ai" && <div style={{ width: 32, height: 32, borderRadius: 99, background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800, flexShrink: 0, boxShadow: "0 0 12px rgba(168,85,247,0.4)" }}>A</div>}
                <div style={{ maxWidth: "78%", padding: "11px 15px", borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: m.role === "user" ? "rgba(6,182,212,0.13)" : "rgba(168,85,247,0.11)", border: `1px solid ${m.role === "user" ? "rgba(6,182,212,0.28)" : "rgba(168,85,247,0.22)"}`, fontSize: 13, color: "#e2d9f3", lineHeight: 1.7 }}>{m.content}</div>
                {m.role === "user" && <div style={{ width: 32, height: 32, borderRadius: 99, background: "rgba(6,182,212,0.18)", border: "1px solid rgba(6,182,212,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#22d3ee", fontWeight: 800, flexShrink: 0 }}>U</div>}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 99, background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800 }}>A</div>
                <div style={{ padding: "11px 15px", borderRadius: "4px 16px 16px 16px", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
                  <span className="dot-1" style={{ width: 6, height: 6, borderRadius: 99, background: "#a855f7", display: "inline-block" }} />
                  <span className="dot-2" style={{ width: 6, height: 6, borderRadius: 99, background: "#a855f7", display: "inline-block" }} />
                  <span className="dot-3" style={{ width: 6, height: 6, borderRadius: 99, background: "#a855f7", display: "inline-block" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "0 16px 10px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {prompts.map((p) => (
              <button key={p} onClick={() => send(p)} style={{ padding: "5px 12px", borderRadius: 99, fontSize: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#8a7898", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>{p}</button>
            ))}
          </div>
          <div style={{ padding: "10px 16px 16px", display: "flex", gap: 8 }}>
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(text)} placeholder="Ask Aetheris anything..." style={{ flex: 1, padding: "12px 14px", minHeight: 44, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, color: "#f0ebff", fontSize: 13, fontFamily: "inherit", outline: "none", transition: "border 0.2s" }} />
            <Btn onClick={() => send(text)} disabled={!text.trim() || loading}>Send</Btn>
          </div>
        </GlassCard>
      </div>
      {!isMobile && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <GlassCard hover={false} style={{ padding: 18 }} delay={100}>
            <p style={{ fontSize: 10, color: "#a855f7", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 10 }}>YOUR CONTEXT</p>
            <p style={{ fontSize: 11, color: "#7a6b84", marginBottom: 6 }}>Library titles:</p>
            {recentTitles.length ? recentTitles.map((t) => <p key={t} style={{ fontSize: 12, color: "#d8b4fe", margin: "2px 0" }}>- {t}</p>) : <p style={{ fontSize: 12, color: "#7a6b84" }}>No tracked titles yet</p>}
          </GlassCard>
          <GlassCard hover={false} style={{ padding: 18 }} delay={150}>
            <p style={{ fontSize: 10, color: "#22d3ee", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 10 }}>AI STATUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="status-dot" style={{ width: 8, height: 8, borderRadius: 99, background: "#4ade80", display: "block" }} /><span style={{ fontSize: 12, color: "#4ade80" }}>Connected to Claude</span></div>
            <p style={{ fontSize: 11, color: "#7a6b84", marginTop: 6 }}>Powered by Claude Sonnet</p>
          </GlassCard>
          <GlassCard hover={false} style={{ padding: 18 }} delay={200}>
            <p style={{ fontSize: 10, color: "#fbbf24", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 8 }}>TIPS</p>
            <p style={{ fontSize: 11, color: "#7a6b84", lineHeight: 1.7 }}>Try: "What makes Solo Leveling's art style unique?" or "Recommend something with slow-burn romance."</p>
          </GlassCard>
          {messages.length > 0 && <Btn variant="ghost" small onClick={() => { setMessages([]); saveChat([]); }}>Clear Chat</Btn>}
        </div>
      )}
    </div>
  );
}

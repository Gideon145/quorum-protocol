"use client";

import { useState, useRef, useEffect } from "react";
import type { Persona, PersonaChatMessage } from "@/lib/types";

const SENTIMENT_COLOR: Record<Persona["sentiment"], string> = {
  positive: "text-green-400",
  neutral: "text-yellow-400",
  negative: "text-red-400",
};

const SENTIMENT_BG: Record<Persona["sentiment"], string> = {
  positive: "bg-green-500/10 border-green-500/20",
  neutral: "bg-yellow-500/10 border-yellow-500/20",
  negative: "bg-red-500/10 border-red-500/20",
};

interface Props {
  persona: Persona;
  idea: string;
  onClose: () => void;
}

export default function PersonaDeepDive({ persona, idea, onClose }: Props) {
  const [messages, setMessages] = useState<PersonaChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newHistory: PersonaChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/persona-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, idea, history: messages, message: text }),
      });
      const data = await res.json();
      setMessages([...newHistory, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newHistory, { role: "assistant", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-[#0c1220] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/50 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm ${SENTIMENT_BG[persona.sentiment]} ${SENTIMENT_COLOR[persona.sentiment]}`}>
              {persona.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{persona.name}</p>
              <p className="text-white/40 text-xs">{persona.age} · {persona.occupation} · {persona.income}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors text-lg leading-none mt-0.5"
          >
            ✕
          </button>
        </div>

        {/* Persona quick stats */}
        <div className="px-5 py-3 border-b border-white/5 flex gap-2 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full border ${persona.wouldUse ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
            {persona.wouldUse ? "Would use" : "Won't use"}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${persona.wouldPay ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/5 border-white/10 text-white/40"}`}>
            {persona.wouldPay ? `Pays ${persona.suggestedPrice}` : "Won't pay"}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/40">
            Tech: {persona.techLiteracy}
          </span>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-[240px]">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/25 text-sm italic mb-1">&quot;{persona.quote}&quot;</p>
              <p className="text-white/15 text-xs mt-4">Ask {persona.name.split(" ")[0]} anything about your idea</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mr-2 mt-0.5 ${SENTIMENT_BG[persona.sentiment]} ${SENTIMENT_COLOR[persona.sentiment]}`}>
                  {persona.name[0]}
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm"
                    : "bg-white/6 border border-white/8 text-white/80 rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start items-center gap-2">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${SENTIMENT_BG[persona.sentiment]} ${SENTIMENT_COLOR[persona.sentiment]}`}>
                {persona.name[0]}
              </div>
              <div className="bg-white/6 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/8 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Ask ${persona.name.split(" ")[0]} a question...`}
            className="flex-1 bg-white/5 border border-white/12 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 hover:border-white/20 transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

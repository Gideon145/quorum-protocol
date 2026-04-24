"use client";

import { useEffect, useRef, useState } from "react";
import type { Tier } from "@/lib/types";
import { TIERS } from "@/lib/types";

const PLACEHOLDERS = [
  "A DEX aggregator with built-in MEV protection...",
  "An AI copilot for Solidity smart contract audits...",
  "A yield optimizer that auto-rebalances DeFi positions...",
  "A no-code tool for launching token-gated communities...",
  "A B2B SaaS for automating procurement workflows...",
  "A mobile app that turns voice notes into structured tasks...",
  "A marketplace for fractional ownership of music royalties...",
  "An API that detects and blocks prompt injection attacks...",
];

const TIER_ORDER: Tier[] = ["quick", "full", "deep-dive"];

interface IdeaFormProps {
  onSubmit: (description: string, tier: Tier) => void;
  isLoading: boolean;
  defaultValue?: string;
}

export default function IdeaForm({ onSubmit, isLoading, defaultValue }: IdeaFormProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [tier, setTier] = useState<Tier>("full");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length >= 5 && !isLoading) {
      onSubmit(value.trim(), tier);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* Tier selector */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {TIER_ORDER.map((t) => {
          const cfg = TIERS[t];
          const isSelected = tier === t;
          const isDeepDive = t === "deep-dive";
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={[
                "relative flex flex-col items-center text-center px-3 py-3 rounded-xl border transition-all duration-200 select-none",
                isSelected
                  ? isDeepDive
                    ? "bg-purple-500/15 border-purple-500/50 shadow-lg shadow-purple-500/10"
                    : "bg-blue-500/15 border-blue-500/50 shadow-lg shadow-blue-500/10"
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]",
              ].join(" ")}
            >
              {isDeepDive && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                  Live Data
                </span>
              )}
              <span
                className={[
                  "font-semibold text-xs mb-1",
                  isSelected
                    ? isDeepDive
                      ? "text-purple-300"
                      : "text-blue-300"
                    : "text-white/70",
                ].join(" ")}
              >
                {cfg.label}
              </span>
              <span className="text-white/35 text-[10px] leading-tight">{cfg.description}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 500))}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          rows={4}
          className="w-full bg-white/5 border border-white/12 rounded-2xl px-5 py-4 text-white placeholder-white/25 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-200 text-sm leading-relaxed hover:border-white/20"
          disabled={isLoading}
        />
        <div className="absolute bottom-3 right-4 text-white/25 text-xs tabular-nums">
          {value.length}/500
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-white/35 text-xs">
          {TIERS[tier].personaCount} synthetic users
        </p>
        <button
          type="submit"
          disabled={value.trim().length < 5 || isLoading}
          className={[
            "font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-95 text-sm shadow-lg disabled:opacity-40 disabled:cursor-not-allowed",
            tier === "deep-dive"
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-600/25 hover:scale-105"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-600/25 hover:scale-105",
          ].join(" ")}
        >
          Run Quorum
          <span className="ml-1.5">→</span>
        </button>
      </div>
    </form>
  );
}


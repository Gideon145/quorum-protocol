"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import IdeaForm from "@/components/IdeaForm";
import GenerationStepper from "@/components/GenerationStepper";
import ReportView from "@/components/ReportView";
import type { QuorumReport, Tier } from "@/lib/types";

type State = "idle" | "loading" | "done" | "error";

function RunPageInner() {
  const searchParams = useSearchParams();
  const prefillIdea = searchParams.get("idea") ?? "";
  const prefillTier = (searchParams.get("tier") ?? "full") as Tier;
  const paid = searchParams.get("paid") === "true";

  const [state, setState] = useState<State>("idle");
  const [report, setReport] = useState<QuorumReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [ideaValue, setIdeaValue] = useState(prefillIdea);
  const [tierValue, setTierValue] = useState<Tier>(prefillTier);

  // Run generation directly (post-payment redirect or re-run from RefinePanel)
  const runGeneration = async (description: string, tier: Tier) => {
    setIdeaValue(description);
    setTierValue(tier);
    setErrorMsg("");
    setReport(null);
    setState("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, tier }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Generation failed");
      setReport(data.report);
      setState("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setState("error");
    }
  };

  // From IdeaForm — create checkout session then redirect to hosted Locus page
  const handleSubmit = async (description: string, tier: Tier) => {
    setIdeaValue(description);
    setTierValue(tier);
    setErrorMsg("");
    setState("loading");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, tier }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Failed to create checkout session");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setReport(null);
    setErrorMsg("");
    setIdeaValue("");
  };

  // Auto-run after payment redirect (?paid=true) or from RefinePanel (?idea=...)
  useEffect(() => {
    if (prefillIdea) {
      runGeneration(prefillIdea, paid ? prefillTier : "full");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/6 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#060b14]/85 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/30">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="5.5"/><path d="m19 19-3.5-3.5"/><circle cx="10" cy="8.5" r="1.5"/><path d="M7.5 13c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5"/></svg>
          </div>
          <span className="font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">Quorum Protocol</span>
        </Link>
        {state === "done" && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 text-white/60 hover:text-blue-300 px-4 py-2 rounded-xl text-sm transition-all duration-200"
          >
            ← New Quorum
          </button>
        )}
      </nav>

      <main className="px-4 py-12">
        {state === "idle" && (
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Synthetic User Research
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Describe your idea
            </h1>
            <p className="text-white/45 text-sm mb-10 max-w-md leading-relaxed">
              Be specific — what the product does, who it&apos;s for, how it makes money. The more
              detail you give, the sharper the feedback.
            </p>
            <IdeaForm onSubmit={handleSubmit} isLoading={false} defaultValue={prefillIdea} />
          </div>
        )}

        {state === "loading" && (
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Running your quorum
            </div>
            <p className="text-white/40 text-sm mb-8 max-w-sm text-center italic">
              &quot;{ideaValue.slice(0, 80)}{ideaValue.length > 80 ? "…" : ""}&quot;
            </p>
            <GenerationStepper />
          </div>
        )}

        {state === "done" && report && (
          <div className="flex flex-col items-center">
            <ReportView report={report} tier={tierValue} />
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center text-center max-w-md mx-auto py-16">
            <div className="bg-red-500/8 border border-red-500/20 rounded-2xl p-6 mb-6 w-full">
              <p className="text-red-400 font-semibold mb-2">Quorum failed</p>
              <p className="text-white/50 text-sm">{errorMsg}</p>
            </div>
            <button
              onClick={() => setState("idle")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-blue-600/25"
            >
              Try again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/8 px-6 py-5 mt-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-white/25 text-xs">Quorum Protocol · Powered by Locus</span>
          <a
            href="https://github.com/Gideon145"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/35 hover:text-white transition-colors text-xs group"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Built by <strong className="text-white/55 font-bold group-hover:text-white ml-1" style={{ fontFamily: "var(--font-playfair)" }}>Gideon145</strong>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function RunPage() {
  return (
    <Suspense>
      <RunPageInner />
    </Suspense>
  );
}

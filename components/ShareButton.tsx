"use client";

import { useState } from "react";
import type { QuorumReport } from "@/lib/types";
import { getShareUrl } from "@/lib/share";

export default function ShareButton({ report }: { report: QuorumReport }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = getShareUrl(report);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: open the URL directly
      window.open(url, "_blank");
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
        copied
          ? "bg-green-500/10 border-green-500/30 text-green-400"
          : "bg-white/5 border-white/12 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Link copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share report
        </>
      )}
    </button>
  );
}

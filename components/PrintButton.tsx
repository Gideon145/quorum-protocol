"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      data-no-print
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 bg-white/5 border-white/12 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Export PDF
    </button>
  );
}

import type { QuorumReport } from "@/lib/types";
import PMFGauge from "./PMFGauge";
import VerdictBadge from "./VerdictBadge";
import PersonaCard from "./PersonaCard";
import InsightsPanel from "./InsightsPanel";
import ReinterviewChat from "./ReinterviewChat";
import ShareButton from "./ShareButton";
import CohortBreakdown from "./CohortBreakdown";
import RefinePanel from "./RefinePanel";

export default function ReportView({ report }: { report: QuorumReport }) {
  const positive = report.personas.filter((p) => p.sentiment === "positive").length;
  const neutral = report.personas.filter((p) => p.sentiment === "neutral").length;
  const negative = report.personas.filter((p) => p.sentiment === "negative").length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top row: gauge + verdict + summary */}
      <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/15 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
        <PMFGauge score={report.pmfScore} />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <VerdictBadge verdict={report.verdict} />
            <div className="flex gap-2 flex-wrap">
              <ShareButton report={report} />
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{report.summary}</p>
          <p className="text-white/35 text-xs italic">Idea: &quot;{report.idea}&quot;</p>
        </div>
      </div>

      {/* Target segment + pivot */}
      <div data-no-print className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5">
          <h3 className="text-blue-400 text-xs uppercase tracking-wide font-semibold mb-2">Best Target Segment</h3>
          <p className="text-white/75 text-sm leading-relaxed">{report.targetSegment}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-yellow-400 text-xs uppercase tracking-wide font-semibold mb-2">Pivot Suggestion</h3>
          <p className="text-white/75 text-sm leading-relaxed">{report.pivotSuggestion}</p>
        </div>
      </div>

      {/* Insights */}
      <div data-no-print><InsightsPanel report={report} /></div>

      {/* Cohort breakdown */}
      <CohortBreakdown report={report} />

      {/* Refine & re-run */}
      <div data-no-print><RefinePanel report={report} /></div>

      {/* Persona grid */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-white font-bold text-lg">20 Personas</h2>
          <div className="flex-1 h-px bg-white/8" />
          <div className="flex gap-2">
            <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">{positive} positive</span>
            <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{neutral} neutral</span>
            <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">{negative} negative</span>
          </div>
          <p className="text-white/30 text-xs ml-auto">Click any card to expand</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {report.personas.map((p) => (
            <PersonaCard key={p.id} persona={p} idea={report.idea} />
          ))}
        </div>
      </div>

      {/* Re-interview */}
      <div data-no-print><ReinterviewChat report={report} /></div>
    </div>
  );
}

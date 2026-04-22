import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Describe your idea",
    desc: "Write one paragraph about what you're building, who it's for, and how it makes money. The more detail, the sharper the feedback.",
  },
  {
    num: "02",
    title: "Simulate 20 users",
    desc: "The Quorum engine generates 20 realistic archetypes — across ages, incomes, and tech literacy — and stress-tests your idea with each one.",
  },
  {
    num: "03",
    title: "Make a data-backed decision",
    desc: "Get your PMF score, top objections, feature requests, and pay willingness. Then re-interview the quorum with follow-up questions.",
  },
];

const FEATURES = [
  {
    title: "PMF Score",
    desc: "A 0–100 product-market fit score computed from willingness to use, pay, and realistic adoption signals.",
  },
  {
    title: "20 Diverse Personas",
    desc: "Every run generates unique archetypes spanning different ages, incomes, backgrounds, and tech literacy levels.",
  },
  {
    title: "Re-interview Mode",
    desc: "Ask the quorum follow-up questions. Get collective responses grounded in each persona's perspective.",
  },
  {
    title: "Actionable Insights",
    desc: "Top objections, killer features users want, and a specific pivot suggestion if your idea needs work.",
  },
  {
    title: "Verdict + Segment",
    desc: "A clear verdict (Strong Fit → Don't Build) and the best target segment to focus your go-to-market on.",
  },
  {
    title: "Willingness to Pay",
    desc: "Know exactly what % of users would pay and what average price they'd accept before you write a line of code.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white overflow-x-hidden fade-in">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#060b14]/85 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
            Q
          </div>
          <span className="font-bold text-white tracking-tight text-lg" style={{fontFamily: "var(--font-playfair)"}}>Quorum Protocol</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-white/40 text-sm">Free · No login required</span>
          <Link
            href="/run"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35"
          >
            Run a Quorum →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 md:pt-36 md:pb-28 text-center">
        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            AI-Powered Synthetic User Research
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Don&apos;t build blind.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              Run a quorum.
            </span>
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Before you waste 3 months building the wrong thing, stress-test your idea against{" "}
            <span className="text-white/80 font-medium">20 synthetic user archetypes</span> — and
            get a full product-market fit report in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href="/run"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
            >
              Test my idea for free
              <span className="text-base">→</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-2xl text-sm transition-all duration-200"
            >
              See how it works ↓
            </a>
          </div>

          <p className="text-white/20 text-xs">No account needed · Powered by Locus AI</p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-blue-400/70 text-xs uppercase tracking-widest mb-3">The Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">How it works</h2>
          <p className="text-white/40 text-sm mt-3 max-w-md mx-auto">
            From idea to full research report in three steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="relative bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 group"
            >
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-blue-500/40 to-transparent z-10" />
              )}
              <p className="text-blue-400/60 font-bold text-xs tracking-widest mb-2">{step.num}</p>
              <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="relative px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-blue-400/70 text-xs uppercase tracking-widest mb-3">What you get</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Everything in one report</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white/[0.03] hover:bg-blue-500/5 border border-white/8 hover:border-blue-500/25 rounded-2xl p-5 transition-all duration-300 group"
            >
              <h3 className="text-white font-semibold mb-1.5 group-hover:text-blue-300 transition-colors">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preview card */}
      <section className="relative px-6 py-16 max-w-2xl mx-auto">
        <div className="bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-8 text-center">
          <p className="text-blue-400/60 text-xs uppercase tracking-wide mb-6">Live example output</p>
          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p className="text-6xl font-extrabold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">73</p>
              <p className="text-white/35 text-xs mt-1">/ 100 PMF Score</p>
            </div>
            <div className="text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/15 text-yellow-400 text-sm font-semibold mb-2 block">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                Niche Viable
              </span>
              <p className="text-white/40 text-xs">14/20 would use</p>
              <p className="text-white/40 text-xs">9/20 would pay · Avg $22/mo</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {["Security concerns", "Too complex", "Need free tier"].map((o) => (
              <div key={o} className="bg-red-500/10 border border-red-500/15 rounded-lg px-2 py-1.5">
                <p className="text-red-400/70 text-xs">{o}</p>
              </div>
            ))}
          </div>
          <Link
            href="/run"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200"
          >
            Get this for your idea →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Your next idea deserves real feedback.
        </h2>
        <p className="text-white/40 text-base mb-10 max-w-xl mx-auto">
          Stop guessing. Run a quorum and let 20 synthetic archetypes tell you the hard truth — before you spend a single hour building.
        </p>
        <Link
          href="/run"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-10 py-4 rounded-2xl text-sm transition-all duration-300 shadow-xl shadow-blue-600/30 hover:scale-105"
        >
          Run your first quorum — it&apos;s free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/8 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold shadow-md shadow-blue-500/30">
              Q
            </div>
            <span className="text-white/50 text-sm">Quorum Protocol · Powered by Locus</span>
          </div>
          <a
            href="https://github.com/Gideon145"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm group"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Built by <strong className="text-white font-bold text-base group-hover:text-blue-300 transition-colors" style={{fontFamily: "var(--font-playfair)"}}>Gideon145</strong>
          </a>
        </div>
      </footer>
    </div>
  );
}


"use client";

interface PMFGaugeProps {
  score: number;
}

export default function PMFGauge({ score }: PMFGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Arc math: half circle from left (180°) to right (0°)
  // Score 0 = left endpoint, Score 100 = right endpoint
  const angle = Math.PI * (1 - clampedScore / 100);
  const endX = 100 + 80 * Math.cos(angle);
  const endY = 100 - 80 * Math.sin(angle);
  const largeArcFlag = clampedScore > 50 ? 1 : 0;

  const color =
    clampedScore >= 70
      ? "#22c55e"  // green-500
      : clampedScore >= 50
      ? "#eab308"  // yellow-500
      : clampedScore >= 30
      ? "#f97316"  // orange-500
      : "#ef4444"; // red-500

  const scoreArcPath =
    clampedScore === 0
      ? ""
      : clampedScore === 100
      ? "M 20 100 A 80 80 0 0 1 180 100"
      : `M 20 100 A 80 80 0 ${largeArcFlag} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 130" className="w-48 h-32">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Score arc */}
        {scoreArcPath && (
          <path
            d={scoreArcPath}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        )}
        {/* Score text */}
        <text
          x="100"
          y="92"
          textAnchor="middle"
          fill="white"
          fontSize="28"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {clampedScore}
        </text>
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          / 100 PMF Score
        </text>
      </svg>
    </div>
  );
}

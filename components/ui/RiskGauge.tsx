"use client";

import React from "react";

interface RiskGaugeProps {
  cvss: number;   // 0–10
  epss: number;   // 0–1
  kev: boolean;   // Known Exploited Vulnerability
  size?: number;
}

/**
 * Semi-circle gauge visualizing combined risk score.
 * Combined = CVSS * 0.5 + EPSS*10 * 0.3 + (KEV ? 10 : 0) * 0.2
 * Result normalized to 0–10
 */
export function RiskGauge({ cvss, epss, kev, size = 160 }: RiskGaugeProps) {
  const combined = Math.min(10, cvss * 0.5 + epss * 10 * 0.3 + (kev ? 10 : 0) * 0.2);
  const combinedPct = combined / 10; // 0–1

  const r = size * 0.38;
  const cx = size / 2;
  const cy = size * 0.58;

  // Semi-circle path (left → right through bottom, 180°)
  const startAngle = -180; // degrees
  const endAngle   = 0;
  const totalArc   = endAngle - startAngle; // 180 deg
  const filledArc  = totalArc * combinedPct;

  function polarToXY(deg: number) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const start  = polarToXY(startAngle);
  const end    = polarToXY(endAngle);
  const filled = polarToXY(startAngle + filledArc);

  const trackPath  = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  const filledPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${filledArc > 180 ? 1 : 0} 1 ${filled.x} ${filled.y}`;

  const color =
    combined >= 9 ? "var(--risk-critical)" :
    combined >= 7 ? "var(--risk-high)" :
    combined >= 4 ? "var(--risk-medium)" : "var(--risk-low)";

  const label =
    combined >= 9 ? "Critical" :
    combined >= 7 ? "High" :
    combined >= 4 ? "Medium" : "Low";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        {/* Track */}
        <path d={trackPath} fill="none" stroke="var(--border)" strokeWidth={size * 0.07} strokeLinecap="round" />
        {/* Filled */}
        <path d={filledPath} fill="none" stroke={color} strokeWidth={size * 0.07} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        {/* Center score */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize={size * 0.175} fontWeight="700">
          {combined.toFixed(1)}
        </text>
        <text x={cx} y={cy + size * 0.1} textAnchor="middle" fill="var(--text-muted)" fontSize={size * 0.09}>
          / 10
        </text>
      </svg>

      {/* Score breakdown pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <ScorePill label="CVSS" value={cvss.toFixed(1)} color="var(--accent-blue)" />
        <ScorePill label="EPSS" value={(epss * 100).toFixed(1) + "%"} color="var(--accent-cyan)" />
        <ScorePill label="KEV" value={kev ? "Yes" : "No"} color={kev ? "var(--risk-critical)" : "var(--text-muted)"} />
      </div>

      <span style={{ fontSize: 13, fontWeight: 700, color, letterSpacing: 1, textTransform: "uppercase" }}>
        {label} Risk
      </span>
    </div>
  );
}

function ScorePill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: 999,
      padding: "3px 10px",
      display: "flex",
      gap: 5,
      alignItems: "center",
      fontSize: 12,
    }}>
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

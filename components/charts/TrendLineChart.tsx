"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DATA = [
  { date: "02/24", critical: 5,  high: 18, medium: 52 },
  { date: "03/03", critical: 6,  high: 21, medium: 55 },
  { date: "03/10", critical: 7,  high: 20, medium: 58 },
  { date: "03/17", critical: 6,  high: 22, medium: 60 },
  { date: "03/24", critical: 8,  high: 23, medium: 61 },
  { date: "03/27", critical: 8,  high: 23, medium: 61 },
];

export function TrendLineChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }}
          labelStyle={{ color: "var(--text-primary)" }}
          itemStyle={{ color: "var(--text-secondary)" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
        />
        <Line type="monotone" dataKey="critical" name="Critical" stroke="var(--risk-critical)" strokeWidth={2} dot={{ r: 3, fill: "var(--risk-critical)" }} />
        <Line type="monotone" dataKey="high"     name="High"     stroke="var(--risk-high)"     strokeWidth={2} dot={{ r: 3, fill: "var(--risk-high)" }} />
        <Line type="monotone" dataKey="medium"   name="Medium"   stroke="var(--risk-medium)"   strokeWidth={2} dot={{ r: 3, fill: "var(--risk-medium)" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

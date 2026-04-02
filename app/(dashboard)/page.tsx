import type { Metadata } from "next";
import Link from "next/link";
import { Badge, levelFromScore, getCombinedScore } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { RiskPieChart } from "@/components/charts/RiskPieChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";

export const metadata: Metadata = {
  title: "Overview — ASM Platform",
  description: "Attack Surface 전체 보안 현황 대시보드",
};

const METRICS = [
  { label: "총 외부 자산",       value: "312",  sub: "+14 from last scan", colorClass: "text-accent-blue",   icon: "◈" },
  { label: "활성 포트",          value: "1,847", sub: "across 312 assets",  colorClass: "text-accent-cyan",   icon: "◉" },
  { label: "통합 위험도 점수",   value: "7.4",  sub: "High — ↑0.3",          colorClass: "text-risk-high",     icon: "◎" },
  { label: "즉시 조치 필요",     value: "8",    sub: "Critical severity",   colorClass: "text-risk-critical", icon: "◆", pulse: true },
];

const TOP5 = [
  { id: "1", asset: "api.example.com",    ip: "203.0.113.10", cvss: 9.8,  epss: 0.92, kev: true,  cve: "CVE-2024-21762" },
  { id: "2", asset: "vpn.example.com",    ip: "203.0.113.22", cvss: 9.1,  epss: 0.76, kev: true,  cve: "CVE-2024-3400"  },
  { id: "3", asset: "gitlab.example.com", ip: "203.0.113.45", cvss: 8.7,  epss: 0.41, kev: false, cve: "CVE-2023-7028"  },
  { id: "4", asset: "smtp.example.com",   ip: "203.0.113.67", cvss: 7.5,  epss: 0.29, kev: false, cve: "CVE-2024-1234"  },
  { id: "5", asset: "dev.example.com",    ip: "10.0.1.15",    cvss: 7.2,  epss: 0.18, kev: false, cve: "CVE-2023-5678"  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Page title */}
      <div>
        <h1 className="m-0 text-[22px] font-bold text-text-primary">Overview</h1>
        <p className="mt-1 mb-0 text-[13px] text-text-muted">
          전체 공격 표면 현황 요약 — 2026-03-27
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-3.5">
        {METRICS.map((m) => (
          <Card key={m.label} className={m.pulse ? "shadow-[0_0_20px_rgba(255,77,79,0.2)] border-[rgba(255,77,79,0.35)]" : ""}>
            <div className="flex justify-between items-start">
              <div>
                <p className="m-0 text-[11px] text-text-muted uppercase tracking-[0.8px]">{m.label}</p>
                <p className={`mt-2 mb-1 text-[28px] font-extrabold leading-none ${m.colorClass}`}>{m.value}</p>
                <p className="m-0 text-[11px] text-text-muted">{m.sub}</p>
              </div>
              <span className={`text-[22px] opacity-60 ${m.colorClass}`}>{m.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Top 5 High-Risk Assets */}
      <Card>
        <CardHeader
          title="위험 자산 Top 5 (High-Risk Assets)"
          subtitle="CVSS × EPSS × KEV 종합 리스크 모델 기준"
          action={
            <Link href="/risk" className="text-xs text-text-secondary no-underline hover:text-text-primary transition-colors">
              전체 보기 →
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">#</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Asset / Host</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">IP Address</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">CVE</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">CVSS</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">EPSS</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">KEV</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Risk Level</th>
                <th className="pb-2 border-b border-border"></th>
              </tr>
            </thead>
            <tbody>
              {TOP5.map((row, i) => {
                const finalScore = getCombinedScore(row.cvss, row.epss, row.kev);
                return (
                  <tr key={row.id} className="border-b border-border-subtle hover:bg-bg-hover transition-colors">
                    <td className="py-3 pr-4 text-text-muted w-8">{i + 1}</td>
                    <td className="py-3 pr-4 text-text-primary font-medium">{row.asset}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{row.ip}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-text-secondary">{row.cve}</td>
                    <td className="py-3 pr-4">
                      <span className={`font-bold ${row.cvss >= 9 ? "text-risk-critical" : row.cvss >= 7 ? "text-risk-high" : "text-risk-medium"}`}>
                        {row.cvss.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{(row.epss * 100).toFixed(0)}%</td>
                    <td className="py-3 pr-4">
                      {row.kev
                        ? <span className="text-risk-critical font-bold">● Yes</span>
                        : <span className="text-text-muted">No</span>
                      }
                    </td>
                    <td className="py-3 pr-4"><Badge level={levelFromScore(finalScore)} /></td>
                    <td className="py-3 pl-4 text-right">
                      <Link href={`/risk/${row.id}`} className="text-[11px] text-text-primary no-underline px-2 py-1 border border-[rgba(0,199,169,0.35)] rounded hover:bg-[rgba(0,199,169,0.1)] transition-colors inline-block">
                        분석 →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <Card className="col-span-1">
          <CardHeader title="위험도 분포" subtitle="현재 스캔 기준" />
          <RiskPieChart />
        </Card>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader title="취약점 증감 추이" subtitle="최근 5주 스캔 비교" />
          <TrendLineChart />
        </Card>
      </div>
    </>
  );
}

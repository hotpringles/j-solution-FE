import type { Metadata } from "next";
import Link from "next/link";
import { Badge, levelFromScore } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { RiskPieChart } from "@/components/charts/RiskPieChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";

export const metadata: Metadata = {
  title: "Overview — ASM Platform",
  description: "Attack Surface 전체 보안 현황 대시보드",
};

const METRICS = [
  { label: "총 외부 자산",       value: "312",  sub: "+14 from last scan", color: "var(--accent-blue)",   icon: "◈" },
  { label: "활성 포트",          value: "1,847", sub: "across 312 assets",  color: "var(--accent-cyan)",   icon: "◉" },
  { label: "통합 위험도 점수",   value: "7.4",  sub: "High — ↑0.3",          color: "var(--risk-high)",     icon: "◎" },
  { label: "즉시 조치 필요",     value: "8",    sub: "Critical severity",   color: "var(--risk-critical)", icon: "◆", pulse: true },
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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Overview</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
          전체 공격 표면 현황 요약 — 2026-03-27
        </p>
      </div>

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {METRICS.map((m) => (
          <Card key={m.label} style={{
            boxShadow: m.pulse ? "var(--glow-red)" : undefined,
            borderColor: m.pulse ? "rgba(255,77,79,0.35)" : undefined,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>{m.label}</p>
                <p style={{ margin: "8px 0 4px", fontSize: 28, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{m.sub}</p>
              </div>
              <span style={{ fontSize: 22, color: m.color, opacity: 0.6 }}>{m.icon}</span>
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
            <Link href="/risk" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none" }}>
              전체 보기 →
            </Link>
          }
        />
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Asset / Host</th>
                <th>IP Address</th>
                <th>CVE</th>
                <th>CVSS</th>
                <th>EPSS</th>
                <th>KEV</th>
                <th>Risk Level</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {TOP5.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ color: "var(--text-muted)", width: 32 }}>{i + 1}</td>
                  <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{row.asset}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{row.ip}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{row.cve}</td>
                  <td>
                    <span style={{ color: row.cvss >= 9 ? "var(--risk-critical)" : row.cvss >= 7 ? "var(--risk-high)" : "var(--risk-medium)", fontWeight: 700 }}>
                      {row.cvss.toFixed(1)}
                    </span>
                  </td>
                  <td>{(row.epss * 100).toFixed(0)}%</td>
                  <td>
                    {row.kev
                      ? <span style={{ color: "var(--risk-critical)", fontWeight: 700 }}>● Yes</span>
                      : <span style={{ color: "var(--text-muted)" }}>No</span>
                    }
                  </td>
                  <td><Badge level={levelFromScore(row.cvss)} /></td>
                  <td>
                    <Link href={`/risk/${row.id}`} style={{
                      fontSize: 11, color: "var(--text-primary)", textDecoration: "none",
                      padding: "3px 8px", border: "1px solid rgba(0,199,169,0.35)", borderRadius: 4,
                    }}>
                      분석 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
        <Card>
          <CardHeader title="위험도 분포" subtitle="현재 스캔 기준" />
          <RiskPieChart />
        </Card>
        <Card>
          <CardHeader title="취약점 증감 추이" subtitle="최근 5주 스캔 비교" />
          <TrendLineChart />
        </Card>
      </div>
    </>
  );
}

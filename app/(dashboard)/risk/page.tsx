import Link from "next/link";
import { Badge, levelFromScore } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";

const RISKS = [
  { id: "1",  asset: "api.example.com",    ip: "203.0.113.10", cvss: 9.8,  epss: 0.92, kev: true,  cve: "CVE-2024-21762", service: "FortiOS SSL-VPN" },
  { id: "2",  asset: "vpn.example.com",    ip: "203.0.113.22", cvss: 9.1,  epss: 0.76, kev: true,  cve: "CVE-2024-3400",  service: "PAN-OS" },
  { id: "3",  asset: "gitlab.example.com", ip: "203.0.113.45", cvss: 8.7,  epss: 0.41, kev: false, cve: "CVE-2023-7028",  service: "GitLab CE" },
  { id: "4",  asset: "smtp.example.com",   ip: "203.0.113.67", cvss: 7.5,  epss: 0.29, kev: false, cve: "CVE-2024-1234",  service: "Exim SMTP" },
  { id: "5",  asset: "dev.example.com",    ip: "10.0.1.15",    cvss: 7.2,  epss: 0.18, kev: false, cve: "CVE-2023-5678",  service: "Apache HTTP" },
  { id: "6",  asset: "mail.example.com",   ip: "203.0.113.80", cvss: 5.3,  epss: 0.08, kev: false, cve: "CVE-2023-9012",  service: "Dovecot IMAP" },
  { id: "7",  asset: "stage.example.com",  ip: "10.0.1.20",    cvss: 4.9,  epss: 0.05, kev: false, cve: "CVE-2023-3456",  service: "Nginx" },
  { id: "8",  asset: "cdn.example.com",    ip: "203.0.113.99", cvss: 3.2,  epss: 0.02, kev: false, cve: "CVE-2023-2345",  service: "Cloudflare Worker" },
];

export default function RiskListPage() {
  return (
    <>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Risk Analysis</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>식별된 취약점 및 위험 자산 전체 목록</p>
      </div>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { level: "critical" as const, count: 2, label: "Critical" },
          { level: "high"     as const, count: 3, label: "High" },
          { level: "medium"   as const, count: 2, label: "Medium" },
          { level: "low"      as const, count: 1, label: "Low" },
        ].map(({ level, count, label }) => (
          <div key={level} style={{
            flex: 1, padding: "12px 16px",
            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
            <span style={{ fontSize: 22, fontWeight: 800,
              color: level === "critical" ? "var(--risk-critical)" :
                     level === "high"     ? "var(--risk-high)" :
                     level === "medium"   ? "var(--risk-medium)" : "var(--risk-low)"
            }}>{count}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="취약점 목록" subtitle="CVSS × EPSS × KEV 종합 위험 점수 기준 정렬" />
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>IP</th>
              <th>Service</th>
              <th>CVE</th>
              <th>CVSS</th>
              <th>EPSS</th>
              <th>KEV</th>
              <th>Risk</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {RISKS.map((r) => (
              <tr key={r.id}>
                <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{r.asset}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.ip}</td>
                <td style={{ fontSize: 12 }}>{r.service}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{r.cve}</td>
                <td style={{ fontWeight: 700, color: r.cvss >= 9 ? "var(--risk-critical)" : r.cvss >= 7 ? "var(--risk-high)" : "var(--text-primary)" }}>
                  {r.cvss.toFixed(1)}
                </td>
                <td>{(r.epss * 100).toFixed(0)}%</td>
                <td>{r.kev ? <span style={{ color: "var(--risk-critical)", fontWeight: 700 }}>● Yes</span> : <span style={{ color: "var(--text-muted)" }}>No</span>}</td>
                <td><Badge level={levelFromScore(r.cvss)} /></td>
                <td>
                  <Link href={`/risk/${r.id}`} style={{
                    fontSize: 11, color: "var(--text-primary)", textDecoration: "none",
                    padding: "3px 8px", border: "1px solid rgba(0,199,169,0.35)", borderRadius: 4,
                  }}>
                    상세 →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

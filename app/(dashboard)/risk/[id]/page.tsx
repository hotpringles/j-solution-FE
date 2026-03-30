import { notFound } from "next/navigation";
import Link from "next/link";
import { RiskGauge } from "@/components/ui/RiskGauge";
import { Badge, levelFromScore } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";

const RISK_DATA: Record<string, {
  asset: string; ip: string; cvss: number; epss: number; kev: boolean;
  cve: string; service: string; description: string;
  ports: { port: number; protocol: string; service: string; version: string; state: string }[];
  cveList: { id: string; cvss: number; summary: string }[];
}> = {
  "1": {
    asset: "api.example.com", ip: "203.0.113.10", cvss: 9.8, epss: 0.92, kev: true,
    cve: "CVE-2024-21762", service: "FortiOS SSL-VPN",
    description: "FortiOS 및 FortiProxy의 웹 관리 인터페이스에서 인증 없이 임의 코드를 실행할 수 있는 원격 코드 실행(RCE) 취약점. CISA KEV에 등재되어 현재 실제 공격에 악용 중.",
    ports: [
      { port: 443,  protocol: "TCP", service: "HTTPS", version: "FortiOS 7.2.4", state: "open" },
      { port: 8443, protocol: "TCP", service: "HTTPS", version: "FortiOS MGMT", state: "open" },
      { port: 22,   protocol: "TCP", service: "SSH",   version: "OpenSSH 8.2",   state: "open" },
    ],
    cveList: [
      { id: "CVE-2024-21762", cvss: 9.8, summary: "FortiOS Out-of-bounds Write leads to RCE via crafted HTTP request" },
      { id: "CVE-2023-27997", cvss: 9.8, summary: "FortiOS SSL-VPN heap buffer overflow — pre-auth RCE" },
    ],
  },
  "2": {
    asset: "vpn.example.com", ip: "203.0.113.22", cvss: 9.1, epss: 0.76, kev: true,
    cve: "CVE-2024-3400", service: "PAN-OS",
    description: "Palo Alto Networks PAN-OS GlobalProtect 기능에서 OS Command Injection이 가능한 취약점. 인증 없이 root 권한으로 임의 명령 실행 가능.",
    ports: [
      { port: 443,  protocol: "TCP", service: "GlobalProtect", version: "PAN-OS 11.0.2", state: "open" },
      { port: 4443, protocol: "TCP", service: "SSL-VPN",       version: "PAN-OS 11.0.2", state: "open" },
    ],
    cveList: [
      { id: "CVE-2024-3400", cvss: 9.1, summary: "OS Command Injection in PAN-OS GlobalProtect — unauthenticated RCE" },
    ],
  },
};

export default async function RiskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = RISK_DATA[id];
  if (!data) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
        <Link href="/risk" style={{ color: "var(--accent-blue)", textDecoration: "none" }}>Risk Analysis</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{data.asset}</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{data.asset}</h1>
          <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
            <Badge level={levelFromScore(data.cvss)} />
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--accent-blue)" }}>{data.cve}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{data.service}</span>
          </div>
        </div>
        <Link href="/reports" style={{
          padding: "8px 16px", background: "rgba(88,166,255,0.1)",
          border: "1px solid rgba(88,166,255,0.3)", borderRadius: 8,
          color: "var(--accent-blue)", fontSize: 13, textDecoration: "none", fontWeight: 600,
        }}>
          ✦ AI 보고서 생성
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
        {/* Risk Scorecard */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <p style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>
            종합 리스크 스코어카드
          </p>
          <RiskGauge cvss={data.cvss} epss={data.epss} kev={data.kev} size={180} />
        </Card>

        {/* Vulnerability Description */}
        <Card>
          <CardHeader title="취약점 개요" />
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>{data.description}</p>

          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "IP Address", value: data.ip },
              { label: "Service",    value: data.service },
              { label: "KEV Status", value: data.kev ? "⚠ 실제 악용 중" : "미등재", danger: data.kev },
            ].map(({ label, value, danger }) => (
              <div key={label} style={{
                background: "var(--bg-surface)", borderRadius: 8,
                border: `1px solid ${danger ? "rgba(255,77,79,0.25)" : "var(--border)"}`,
                padding: "10px 14px",
              }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: danger ? "var(--risk-critical)" : "var(--text-primary)", fontFamily: label === "IP Address" ? "monospace" : "inherit" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Port & Service Info */}
      <Card>
        <CardHeader title="포트 및 서비스 정보" subtitle="Nmap 스캔 결과" />
        <table>
          <thead>
            <tr>
              <th>Port</th><th>Protocol</th><th>Service</th><th>Version</th><th>State</th>
            </tr>
          </thead>
          <tbody>
            {data.ports.map((p) => (
              <tr key={p.port}>
                <td style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent-cyan)" }}>{p.port}</td>
                <td>{p.protocol}</td>
                <td style={{ color: "var(--text-primary)" }}>{p.service}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.version}</td>
                <td><span style={{ color: "var(--risk-low)", fontSize: 12, fontWeight: 600 }}>● {p.state}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* CVE List */}
      <Card>
        <CardHeader title="관련 CVE 목록" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.cveList.map((c) => (
            <div key={c.id} style={{
              background: "var(--bg-surface)", borderRadius: 8,
              border: "1px solid var(--border)", padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: "var(--accent-blue)", minWidth: 140 }}>{c.id}</span>
              <Badge level={levelFromScore(c.cvss)} />
              <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>{c.summary}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: c.cvss >= 9 ? "var(--risk-critical)" : "var(--risk-high)" }}>{c.cvss.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

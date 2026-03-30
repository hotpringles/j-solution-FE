"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, levelFromScore } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";

const ASSETS = [
  { id: "1",  subdomain: "api.example.com",     ip: "203.0.113.10", port: 443,  service: "HTTPS",  cvss: 9.8,  status: "open" },
  { id: "2",  subdomain: "vpn.example.com",     ip: "203.0.113.22", port: 4443, service: "SSL-VPN", cvss: 9.1, status: "open" },
  { id: "3",  subdomain: "gitlab.example.com",  ip: "203.0.113.45", port: 80,   service: "HTTP",    cvss: 8.7, status: "open" },
  { id: "4",  subdomain: "smtp.example.com",    ip: "203.0.113.67", port: 25,   service: "SMTP",    cvss: 7.5, status: "open" },
  { id: "5",  subdomain: "dev.example.com",     ip: "10.0.1.15",    port: 8080, service: "HTTP-Alt",cvss: 7.2, status: "open" },
  { id: "6",  subdomain: "mail.example.com",    ip: "203.0.113.80", port: 993,  service: "IMAPS",   cvss: 5.3, status: "open" },
  { id: "7",  subdomain: "stage.example.com",   ip: "10.0.1.20",    port: 443,  service: "HTTPS",   cvss: 4.9, status: "filtered" },
  { id: "8",  subdomain: "cdn.example.com",     ip: "203.0.113.99", port: 80,   service: "HTTP",    cvss: 3.2, status: "open" },
  { id: "9",  subdomain: "docs.example.com",    ip: "203.0.113.12", port: 443,  service: "HTTPS",   cvss: 2.1, status: "open" },
  { id: "10", subdomain: "static.example.com",  ip: "203.0.113.15", port: 443,  service: "HTTPS",   cvss: 0,   status: "open" },
];

type FilterLevel = "all" | "critical" | "high" | "medium" | "low";

export default function AssetsPage() {
  const [domain, setDomain]     = useState("");
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter]     = useState<FilterLevel>("all");
  const [search, setSearch]     = useState("");

  const handleScan = () => {
    if (!domain) return;
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  const filtered = ASSETS.filter((a) => {
    const matchSearch = a.subdomain.includes(search) || a.ip.includes(search) || a.service.toLowerCase().includes(search.toLowerCase());
    const level = levelFromScore(a.cvss);
    const matchFilter = filter === "all" || level === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Asset Discovery</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>도메인 스캔 파이프라인 제어 및 수집된 외부 자산 관리</p>
      </div>

      {/* Scan Input */}
      <Card>
        <CardHeader title="스캔 파이프라인 제어" subtitle="Nmap → Naabu → HTTPX 순서로 실행됩니다" />
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            placeholder="example.com 또는 192.168.1.0/24"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            style={{ flex: 1 }}
          />
          <button
            className={scanning ? "btn-danger" : "btn-primary"}
            onClick={scanning ? () => setScanning(false) : handleScan}
            style={{ whiteSpace: "nowrap", minWidth: 110 }}
          >
            {scanning ? "⬛ 중지" : "▶ 스캔 시작"}
          </button>
        </div>

        {scanning && (
          <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--bg-surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--risk-high)", display: "inline-block", animation: "pulse-glow 1s infinite" }} />
              <span style={{ fontSize: 13, color: "var(--risk-high)", fontWeight: 600 }}>스캔 진행 중...</span>
            </div>
            <div style={{ display: "flex", gap: 24, fontSize: 12, color: "var(--text-muted)" }}>
              <span>✅ Naabu (포트 스캔)</span>
              <span style={{ color: "var(--accent-blue)" }}>⟳ Nmap (서비스 탐지)</span>
              <span>◻ HTTPX (HTTP 프로브)</span>
            </div>
          </div>
        )}
      </Card>

      {/* Asset List */}
      <Card>
        <CardHeader
          title={`자산 목록 (${filtered.length}개)`}
          subtitle="수집된 외부 서브도메인 및 서비스"
          action={
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="search"
                placeholder="검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 160, padding: "6px 10px", fontSize: 12 }}
              />
              {(["all","critical","high","medium","low"] as FilterLevel[]).map((f) => (
                <button key={f} className="btn-ghost" onClick={() => setFilter(f)}
                  style={{
                    padding: "4px 10px", fontSize: 11,
                    borderColor: filter === f ? "var(--accent-blue)" : "var(--border)",
                    color: filter === f ? "var(--accent-blue)" : "var(--text-muted)",
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          }
        />
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Subdomain</th>
                <th>IP Address</th>
                <th>Port</th>
                <th>Service</th>
                <th>Status</th>
                <th>CVSS</th>
                <th>Risk</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{a.subdomain}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.ip}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.port}</td>
                  <td>{a.service}</td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: a.status === "open" ? "var(--risk-low)" : "var(--text-muted)",
                    }}>
                      ● {a.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{a.cvss > 0 ? a.cvss.toFixed(1) : "—"}</td>
                  <td><Badge level={levelFromScore(a.cvss)} /></td>
                  <td>
                    <Link href={`/risk/${a.id}`} style={{
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
    </>
  );
}

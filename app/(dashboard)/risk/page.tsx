"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, levelFromScore, getCombinedScore } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";

const RISKS = [
  { id: "1",  asset: "api.example.com",    ip: "203.0.113.10", cvss: 9.8,  epss: 0.92, kev: true,  cve: "CVE-2024-21762", service: "FortiOS SSL-VPN" },
  { id: "2",  asset: "vpn.example.com",    ip: "203.0.113.22", cvss: 9.1,  epss: 0.76, kev: true,  cve: "CVE-2024-3400",  service: "PAN-OS" },
  { id: "3",  asset: "gitlab.example.com", ip: "203.0.113.45", cvss: 8.7,  epss: 0.41, kev: false, cve: "CVE-2023-7028",  service: "GitLab CE" },
  { id: "4",  asset: "smtp.example.com",   ip: "203.0.113.67", cvss: 7.5,  epss: 0.29, kev: false, cve: "CVE-2024-1234",  service: "Exim SMTP" },
  { id: "5",  asset: "dev.example.com",    ip: "10.0.1.15",    cvss: 7.2,  epss: 0.18, kev: false, cve: "CVE-2023-5678",  service: "Apache HTTP" },
  { id: "6",  asset: "mail.example.com",   ip: "203.0.113.80", cvss: 5.3,  epss: 0.08, kev: false, cve: "CVE-2023-9012",  service: "Dovecot IMAP" },
  { id: "7",  asset: "stage.example.com",  ip: "10.0.1.20",    cvss: 4.9,  epss: 0.05, kev: false, cve: "CVE-2023-3456",  service: "Nginx" },
  { id: "8",  asset: "cdn.example.com",    ip: "203.0.113.99", cvss: 3.2,  epss: 0.02, kev: false, cve: "CVE-2023-2345",  service: "Cloudflare Worker" },
  { id: "9",  asset: "auth.example.com",   ip: "10.0.1.22",    cvss: 3.1,  epss: 0.01, kev: false, cve: "CVE-2023-1212",  service: "OAuth Proxy" },
  { id: "10", asset: "files.example.com",  ip: "203.0.113.11", cvss: 2.1,  epss: 0.01, kev: false, cve: "CVE-2023-0001",  service: "Samba" },
  { id: "11", asset: "proxy.example.com",  ip: "203.0.113.19", cvss: 8.2,  epss: 0.65, kev: true,  cve: "CVE-2024-5555",  service: "HAProxy" },
  { id: "12", asset: "backup.example.com", ip: "10.0.1.66",    cvss: 6.8,  epss: 0.12, kev: false, cve: "CVE-2023-4444",  service: "Rsync" },
  { id: "13", asset: "test.example.com",   ip: "203.0.113.88", cvss: 4.5,  epss: 0.04, kev: false, cve: "CVE-2023-8888",  service: "Node.js" },
];

const ITEMS_PER_PAGE = 5;

export default function RiskListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedRisks = [...RISKS].sort((a, b) => {
    const scoreA = getCombinedScore(a.cvss, a.epss, a.kev);
    const scoreB = getCombinedScore(b.cvss, b.epss, b.kev);
    return scoreB - scoreA; // descending
  });

  const totalPages = Math.ceil(sortedRisks.length / ITEMS_PER_PAGE);
  const paginated = sortedRisks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const summary = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  RISKS.forEach((r) => {
    const finalScore = getCombinedScore(r.cvss, r.epss, r.kev);
    summary[levelFromScore(finalScore)]++;
  });

  return (
    <>
      <div>
        <h1 className="m-0 text-[22px] font-bold text-text-primary">Risk Analysis</h1>
        <p className="mt-1 mb-0 text-[13px] text-text-muted">식별된 취약점 및 위험 자산 전체 목록</p>
      </div>

      {/* Summary bar */}
      <div className="flex gap-2.5">
        {[
          { level: "critical" as const, count: summary.critical, label: "Critical" },
          { level: "high"     as const, count: summary.high,     label: "High" },
          { level: "medium"   as const, count: summary.medium,   label: "Medium" },
          { level: "low"      as const, count: summary.low,      label: "Low" },
        ].map(({ level, count, label }) => (
          <div key={level} className="flex-1 py-3 px-4 bg-bg-card border border-border rounded-xl flex items-center justify-between">
            <span className="text-xs text-text-muted">{label}</span>
            <span className={`text-[22px] font-extrabold ${
              level === "critical" ? "text-risk-critical" :
              level === "high"     ? "text-risk-high" :
              level === "medium"   ? "text-risk-medium" : "text-risk-low"
            }`}>{count}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="취약점 목록" subtitle="CVSS × EPSS × KEV 종합 위험 점수 기준 정렬" />
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Asset</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">IP</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Service</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">CVE</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">CVSS</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">EPSS</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">KEV</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Risk</th>
                <th className="pb-2 border-b border-border"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => {
                const finalScore = getCombinedScore(r.cvss, r.epss, r.kev);
                return (
                  <tr key={r.id} className="border-b border-border-subtle hover:bg-bg-hover transition-colors">
                    <td className="py-3 pr-4 text-text-primary font-medium">{r.asset}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{r.ip}</td>
                    <td className="py-3 pr-4 text-xs">{r.service}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-text-secondary">{r.cve}</td>
                    <td className="py-3 pr-4 font-bold text-text-primary">{r.cvss.toFixed(1)}</td>
                    <td className="py-3 pr-4">{(r.epss * 100).toFixed(0)}%</td>
                    <td className="py-3 pr-4">{r.kev ? <span className="text-risk-critical font-bold">● Yes</span> : <span className="text-text-muted">No</span>}</td>
                    <td className="py-3 pr-4"><Badge level={levelFromScore(finalScore)} /></td>
                    <td className="py-3 pl-4 text-right">
                      <Link href={`/risk/${r.id}`} className="text-[11px] text-text-primary no-underline px-2 py-1 border border-[rgba(0,199,169,0.35)] rounded hover:bg-[rgba(0,199,169,0.1)] transition-colors inline-block whitespace-nowrap">
                        상세 →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-text-muted text-sm">
                    해당 조건의 취약점이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </>
  );
}

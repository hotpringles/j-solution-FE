"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, levelFromScore } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";

const ASSETS = [
  { id: "1",  subdomain: "api.example.com",     ip: "203.0.113.10", port: 443,  service: "HTTPS",  cvss: 9.8,  status: "open" },
  { id: "2",  subdomain: "vpn.example.com",     ip: "203.0.113.22", port: 4443, service: "SSL-VPN", cvss: 9.1, status: "open" },
  { id: "3",  subdomain: "gitlab.example.com",  ip: "203.0.113.45", port: 80,   service: "HTTP",    cvss: 8.7, status: "open" },
  { id: "4",  subdomain: "smtp.example.com",    ip: "203.0.113.67", port: 25,   service: "SMTP",    cvss: 7.5, status: "open" },
  { id: "5",  subdomain: "dev.example.com",     ip: "10.0.1.15",    port: 8080, service: "HTTP-Alt",cvss: 7.2, status: "open" },
  { id: "6",  subdomain: "mail.example.com",    ip: "203.0.113.80", port: 993,  service: "IMAPS",   cvss: 5.3, status: "open" },
  { id: "7",  subdomain: "stage.example.com",   ip: "10.0.1.20",    port: 443,  service: "HTTPS",   cvss: 4.9, status: "filtered" },
  { id: "8",  subdomain: "cdn.example.com",     ip: "203.0.113.99", port: 80,   service: "HTTP",    cvss: 3.2, status: "open" },
  { id: "9",  subdomain: "auth.example.com",    ip: "10.0.1.22",    port: 443,  service: "OAuth Proxy", cvss: 3.1, status: "open" },
  { id: "10", subdomain: "files.example.com",   ip: "203.0.113.11", port: 445,  service: "SMB",     cvss: 2.1, status: "open" },
  { id: "11", subdomain: "proxy.example.com",   ip: "203.0.113.19", port: 80,   service: "HAProxy", cvss: 8.2, status: "open" },
  { id: "12", subdomain: "backup.example.com",  ip: "10.0.1.66",    port: 873,  service: "Rsync",   cvss: 6.8, status: "open" },
  { id: "13", subdomain: "test.example.com",    ip: "203.0.113.88", port: 9229, service: "Node.js", cvss: 4.5, status: "open" },
  { id: "14", subdomain: "portal.example.com",  ip: "203.0.113.44", port: 443,  service: "HTTPS",   cvss: 0,   status: "open" },
  { id: "15", subdomain: "static.example.com",  ip: "203.0.113.15", port: 443,  service: "HTTPS",   cvss: 0,   status: "open" },
];

type FilterLevel = "all" | "critical" | "high" | "medium" | "low";
const ITEMS_PER_PAGE = 6;

export default function AssetsPage() {
  const [domain, setDomain]     = useState("");
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter]     = useState<FilterLevel>("all");
  const [search, setSearch]     = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <div>
        <h1 className="m-0 text-[22px] font-bold text-text-primary">Asset Discovery</h1>
        <p className="mt-1 mb-0 text-[13px] text-text-muted">도메인 스캔 파이프라인 제어 및 수집된 외부 자산 관리</p>
      </div>

      {/* Scan Input */}
      <Card>
        <CardHeader title="스캔 파이프라인 제어" subtitle="Nmap → Naabu → HTTPX 순서로 실행됩니다" />
        <div className="flex gap-2.5">
          <input
            type="text"
            placeholder="example.com 또는 192.168.1.0/24"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            className="flex-1"
          />
          <button
            className={`${scanning ? "btn-danger" : "btn-primary"} whitespace-nowrap min-w-[110px]`}
            onClick={scanning ? () => setScanning(false) : handleScan}
          >
            {scanning ? "⬛ 중지" : "▶ 스캔 시작"}
          </button>
        </div>

        {scanning && (
          <div className="mt-3.5 px-3.5 py-3 bg-bg-surface rounded-lg border border-border">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-risk-high inline-block animate-[pulse-glow_1s_infinite]" />
              <span className="text-[13px] text-risk-high font-semibold">스캔 진행 중...</span>
            </div>
            <div className="flex gap-6 text-xs text-text-muted">
              <span>✅ Naabu (포트 스캔)</span>
              <span className="text-accent-blue">⟳ Nmap (서비스 탐지)</span>
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
            <div className="flex gap-2 items-center">
              <input
                type="search"
                placeholder="검색..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-40 px-2.5 py-1.5 text-xs"
              />
              {(["all","critical","high","medium","low"] as FilterLevel[]).map((f) => (
                <button 
                  key={f} 
                  className={`btn-ghost px-2.5 py-1 text-[11px] ${filter === f ? 'border-accent-blue text-accent-blue' : 'border-border text-text-muted'}`} 
                  onClick={() => { setFilter(f); setCurrentPage(1); }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          }
        />
        <div className="overflow-x-auto min-h-[345px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Subdomain</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">IP Address</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Port</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Service</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Status</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">CVSS</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border">Risk</th>
                <th className="pb-2 border-b border-border"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr key={a.id} className="border-b border-border-subtle hover:bg-bg-hover transition-colors">
                  <td className="py-3 pr-4 text-text-primary font-medium">{a.subdomain}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{a.ip}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{a.port}</td>
                  <td className="py-3 pr-4">{a.service}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[11px] font-semibold ${a.status === "open" ? "text-risk-low" : "text-text-muted"}`}>
                      ● {a.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-text-primary font-semibold">{a.cvss > 0 ? a.cvss.toFixed(1) : "—"}</td>
                  <td className="py-3 pr-4"><Badge level={levelFromScore(a.cvss)} /></td>
                  <td className="py-3 pl-4 text-right">
                    {a.cvss > 0 ? (
                      <Link href={`/risk/${a.id}`} className="text-[11px] text-text-primary no-underline px-2 py-1 border border-[rgba(0,199,169,0.35)] rounded hover:bg-[rgba(0,199,169,0.1)] transition-colors inline-block whitespace-nowrap">
                        분석 →
                      </Link>
                    ) : (
                      <span className="text-[10px] text-text-muted px-2 py-1 uppercase tracking-[0.8px]">안전함</span>
                    )}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted text-sm">
                    해당 조건의 자산이 없습니다.
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

import { notFound } from "next/navigation";
import Link from "next/link";
import { RiskGauge } from "@/components/ui/RiskGauge";
import { Badge, levelFromScore, getCombinedScore } from "@/components/ui/Badge";
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
  "3": {
    asset: "gitlab.example.com", ip: "203.0.113.45", cvss: 8.7, epss: 0.41, kev: false,
    cve: "CVE-2023-7028", service: "GitLab CE",
    description: "GitLab 환경에서 사용자의 비밀번호 변경 메일이 인증되지 않은 주소로 발송될 수 있는 취약점(계정 탈취 가능성).",
    ports: [
      { port: 80,  protocol: "TCP", service: "HTTP", version: "Nginx", state: "open" },
    ],
    cveList: [
      { id: "CVE-2023-7028", cvss: 8.7, summary: "Account Takeover via Password Reset without user interaction" },
    ],
  },
  "4": {
    asset: "smtp.example.com", ip: "203.0.113.67", cvss: 7.5, epss: 0.29, kev: false,
    cve: "CVE-2024-1234", service: "Exim SMTP",
    description: "Exim 메일 서버에서 메시지 검사 중 발생할 수 있는 메모리 손상 버그.",
    ports: [
      { port: 25,  protocol: "TCP", service: "SMTP", version: "Exim 4.96", state: "open" },
    ],
    cveList: [
      { id: "CVE-2024-1234", cvss: 7.5, summary: "Memory corruption in message parsing" },
    ],
  },
  "5": {
    asset: "dev.example.com", ip: "10.0.1.15", cvss: 7.2, epss: 0.18, kev: false,
    cve: "CVE-2023-5678", service: "Apache HTTP",
    description: "오래된 버전의 Apache 서버에서 발견된 로컬 권한 상승(LPE) 및 DoS 취약점.",
    ports: [
      { port: 8080, protocol: "TCP", service: "HTTP-Alt", version: "Apache 2.4.40", state: "open" },
    ],
    cveList: [
      { id: "CVE-2023-5678", cvss: 7.2, summary: "Local privilege escalation possible via symlinks" },
    ],
  },
  "6": {
    asset: "mail.example.com", ip: "203.0.113.80", cvss: 5.3, epss: 0.08, kev: false,
    cve: "CVE-2023-9012", service: "Dovecot IMAP",
    description: "IMAP 서버의 자원 소모성(Denial of Service) 취약점.",
    ports: [
      { port: 993, protocol: "TCP", service: "IMAPS", version: "Dovecot", state: "open" },
    ],
    cveList: [
      { id: "CVE-2023-9012", cvss: 5.3, summary: "Resource exhaustion via multiple concurrent IMAP sessions" },
    ],
  },
  "7": {
    asset: "stage.example.com", ip: "10.0.1.20", cvss: 4.9, epss: 0.05, kev: false,
    cve: "CVE-2023-3456", service: "Nginx",
    description: "Nginx 설정의 미스컨피규레이션으로 인한 정보 노출(Information Disclosure) 위험.",
    ports: [
      { port: 443, protocol: "TCP", service: "HTTPS", version: "Nginx 1.22.0", state: "filtered" },
    ],
    cveList: [
      { id: "CVE-2023-3456", cvss: 4.9, summary: "Information disclosure via detailed error messages" },
    ],
  },
  "8": {
    asset: "cdn.example.com", ip: "203.0.113.99", cvss: 3.2, epss: 0.02, kev: false,
    cve: "CVE-2023-2345", service: "Cloudflare Worker",
    description: "서드파티 워커 로직의 캐싱 이슈로 인한 단순 캐시 교란.",
    ports: [
      { port: 80, protocol: "TCP", service: "HTTP", version: "Cloudflare", state: "open" },
    ],
    cveList: [
      { id: "CVE-2023-2345", cvss: 3.2, summary: "Low-impact cache poisoning vulnerability" },
    ],
  },
  "9": {
    asset: "auth.example.com", ip: "10.0.1.22", cvss: 3.1, epss: 0.01, kev: false,
    cve: "CVE-2023-1212", service: "OAuth Proxy",
    description: "OAuth 인증 프록시에서 만료된 토큰이 리다이렉트되는 중 리퍼러 정보에 유출되는 현상.",
    ports: [
      { port: 443, protocol: "TCP", service: "HTTPS", version: "OAuth2 Proxy", state: "open" },
    ],
    cveList: [
      { id: "CVE-2023-1212", cvss: 3.1, summary: "Information exposure via HTTP Referer header" },
    ],
  },
  "10": {
    asset: "files.example.com", ip: "203.0.113.11", cvss: 2.1, epss: 0.01, kev: false,
    cve: "CVE-2023-0001", service: "Samba",
    description: "매우 한정된 환경에서의 Samba 경로 오류. 실질적인 외부 타격 가능성은 희박함.",
    ports: [
      { port: 445, protocol: "TCP", service: "SMB", version: "Samba 4.10", state: "open" },
    ],
    cveList: [
      { id: "CVE-2023-0001", cvss: 2.1, summary: "Minor edge case in parsing symbolic links" },
    ],
  },
  "11": {
    asset: "proxy.example.com", ip: "203.0.113.19", cvss: 8.2, epss: 0.65, kev: true,
    cve: "CVE-2024-5555", service: "HAProxy",
    description: "HTTP Request Smuggling 취약점으로, 악의적인 페이로드를 숨겨 내부 망의 다른 서버를 우회 타격할 수 있음. CISA KEV 등재됨.",
    ports: [
      { port: 443, protocol: "TCP", service: "HTTPS", version: "HAProxy 2.4", state: "open" },
      { port: 80, protocol: "TCP", service: "HTTP", version: "HAProxy 2.4", state: "open" },
    ],
    cveList: [
      { id: "CVE-2024-5555", cvss: 8.2, summary: "HTTP Request Smuggling leading to internal service bypass" },
    ],
  },
  "12": {
    asset: "backup.example.com", ip: "10.0.1.66", cvss: 6.8, epss: 0.12, kev: false,
    cve: "CVE-2023-4444", service: "Rsync",
    description: "잘못된 권한 설정으로 인해 익명 유저가 백업 모듈 리스트를 열람할 수 있는 상태.",
    ports: [
      { port: 873, protocol: "TCP", service: "Rsync", version: "Rsync 3.1", state: "open" },
    ],
    cveList: [
      { id: "CVE-2023-4444", cvss: 6.8, summary: "Insecure module configuration exposing backup lists" },
    ],
  },
  "13": {
    asset: "test.example.com", ip: "203.0.113.88", cvss: 4.5, epss: 0.04, kev: false,
    cve: "CVE-2023-8888", service: "Node.js",
    description: "개발용 Node.js 환경에서 디버깅 포트가 외부에 노출되어 있어 코드 주입 등 2차 타격 위험 존재.",
    ports: [
      { port: 9229, protocol: "TCP", service: "Node Debug", version: "V8 Inspector", state: "open" },
    ],
    cveList: [
      { id: "CVE-2023-8888", cvss: 4.5, summary: "V8 Inspector protocol exposed leading to code injection vectors" },
    ],
  },
};

export default async function RiskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = RISK_DATA[id];
  if (!data) notFound();

  const finalScore = getCombinedScore(data.cvss, data.epss, data.kev);

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link href="/risk" className="text-accent-blue no-underline hover:text-accent-cyan">Risk Analysis</Link>
        <span>/</span>
        <span className="text-text-secondary">{data.asset}</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="m-0 text-[22px] font-bold text-text-primary">{data.asset}</h1>
          <div className="flex gap-2 mt-1.5 items-center">
            <Badge level={levelFromScore(finalScore)} />
            <span className="text-xs font-mono text-accent-blue">{data.cve}</span>
            <span className="text-xs text-text-muted">{data.service}</span>
          </div>
        </div>
        <Link 
          href="/reports" 
          className="px-4 py-2 bg-[rgba(88,166,255,0.1)] border border-[rgba(88,166,255,0.3)] rounded-lg text-accent-blue text-[13px] font-semibold no-underline hover:bg-[rgba(88,166,255,0.15)] transition-colors"
        >
          ✦ AI 보고서 생성
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Risk Scorecard */}
        <Card className="flex flex-col items-center justify-center">
          <p className="m-0 mb-4 text-xs font-semibold text-text-muted uppercase tracking-[0.8px]">
            종합 리스크 스코어카드
          </p>
          <RiskGauge cvss={data.cvss} epss={data.epss} kev={data.kev} size={180} />
        </Card>

        {/* Vulnerability Description */}
        <Card>
          <CardHeader title="취약점 개요" />
          <p className="m-0 text-sm leading-[1.8] text-text-secondary">{data.description}</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {[
              { label: "IP Address", value: data.ip },
              { label: "Service",    value: data.service },
              { label: "KEV Status", value: data.kev ? "⚠ 실제 악용 중" : "미등재", danger: data.kev },
            ].map(({ label, value, danger }) => (
              <div 
                key={label} 
                className={`bg-bg-surface rounded-lg border p-2.5 ${danger ? 'border-[rgba(255,77,79,0.25)]' : 'border-border'}`}
              >
                <div className="text-[10px] text-text-muted uppercase tracking-[0.8px] mb-1">{label}</div>
                <div className={`text-[13px] font-semibold ${danger ? 'text-risk-critical' : 'text-text-primary'} ${label === "IP Address" ? "font-mono" : ""}`}>
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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border px-4">Port</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border px-4">Protocol</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border px-4">Service</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border px-4">Version</th>
                <th className="font-semibold text-[11px] uppercase tracking-[0.8px] text-text-muted pb-2 border-b border-border px-4">State</th>
              </tr>
            </thead>
            <tbody>
              {data.ports.map((p) => (
                <tr key={p.port} className="border-b border-border-subtle hover:bg-bg-hover transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-accent-cyan">{p.port}</td>
                  <td className="py-3 px-4 text-text-secondary">{p.protocol}</td>
                  <td className="py-3 px-4 text-text-primary">{p.service}</td>
                  <td className="py-3 px-4 font-mono text-xs text-text-secondary">{p.version}</td>
                  <td className="py-3 px-4"><span className="text-risk-low text-xs font-semibold">● {p.state}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CVE List */}
      <Card>
        <CardHeader title="관련 CVE 목록" />
        <div className="flex flex-col gap-2.5">
          {data.cveList.map((c) => (
            <div 
              key={c.id} 
              className="bg-bg-surface rounded-lg border border-border p-3 flex flex-wrap md:flex-nowrap items-center gap-3.5"
            >
              <span className="font-mono text-[13px] text-accent-blue min-w-[140px]">{c.id}</span>
              <Badge level={levelFromScore(c.cvss)} />
              <span className="text-[13px] text-text-secondary flex-1">{c.summary}</span>
              <span className={`text-xl font-extrabold ${c.cvss >= 9 ? 'text-risk-critical' : 'text-risk-high'}`}>
                {c.cvss.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

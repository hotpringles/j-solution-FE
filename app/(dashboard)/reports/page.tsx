"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";

const SCANS = [
  { id: "scan-20260327", label: "2026-03-27 18:30 — api.example.com (Critical)" },
  { id: "scan-20260324", label: "2026-03-24 09:15 — vpn.example.com (Critical)" },
  { id: "scan-20260317", label: "2026-03-17 14:00 — gitlab.example.com (High)" },
];

const SAMPLE_REPORTS: Record<string, string> = {
  "scan-20260327": `# 보안 취약점 분석 보고서
**생성일**: 2026-03-27 | **대상**: api.example.com | **위험도**: Critical

## 요약 (Executive Summary)

api.example.com (203.0.113.10)에서 운영 중인 FortiOS SSL-VPN 서비스에서 **CVE-2024-21762** (CVSS 9.8) 취약점이 발견되었습니다. 해당 취약점은 CISA KEV(Known Exploited Vulnerabilities)에 등재되어 **현재 실제 공격이 진행 중**이며, EPSS 점수 92%로 악용 가능성이 매우 높습니다.

## 기술적 분석

- **취약점 유형**: Out-of-Bounds Write → Remote Code Execution
- **인증 필요**: 불필요 (Pre-Authentication)
- **영향 범위**: 전체 네트워크 접근 권한 탈취 가능

## 대응 권고사항

1. 즉시 FortiOS를 7.4.3 이상으로 업데이트
2. 외부 노출된 관리 포트(8443) 방화벽 차단
3. SSL-VPN 접근 IP 허용 목록(Allowlist) 적용
4. 접근 로그 즉시 검토 및 이상 접속 확인`,

  "scan-20260324": `# 보안 취약점 분석 보고서
**생성일**: 2026-03-24 | **대상**: vpn.example.com | **위험도**: Critical

## 요약 (Executive Summary)

vpn.example.com에서 운영 중인 PAN-OS GlobalProtect 서비스에서 **CVE-2024-3400** (CVSS 9.1) 취약점이 확인되었습니다.

## 대응 권고사항

1. PAN-OS 11.0.4-h1 이상으로 즉시 패치
2. GlobalProtect Telemetry 기능 비활성화
3. 의심 명령 실행 로그 조사`,
};

const REMEDIATION: Record<string, string[]> = {
  "scan-20260327": [
    "이 취약점(CVE-2024-21762)은 현재 KEV에 등재되어 실제 공격이 발생 중입니다. FortiOS를 7.4.3 이상으로 즉시 업그레이드하세요.",
    "외부 노출된 관리 인터페이스(포트 8443)를 방화벽 규칙으로 차단하고, 신뢰할 수 있는 IP에서만 접근 허용하도록 ACL을 업데이트하세요.",
    "SSL-VPN 인증 로그에서 비정상적인 접속 패턴, 특히 인증 이전 대용량 요청을 즉시 확인하세요.",
  ],
  "scan-20260324": [
    "CVE-2024-3400는 OS Command Injection으로 root 권한 탈취가 가능합니다. PAN-OS 11.0.4-h1 이상으로 즉시 패치하세요.",
    "GlobalProtect Telemetry 기능을 비활성화하면 임시로 공격 벡터를 제거할 수 있습니다.",
  ],
};

export default function ReportsPage() {
  const [selectedScan, setSelectedScan] = useState(SCANS[0].id);
  const [loading, setLoading]           = useState(false);
  const [report, setReport]             = useState<string | null>(null);

  const handleGenerate = () => {
    setLoading(true);
    setReport(null);
    setTimeout(() => {
      setReport(SAMPLE_REPORTS[selectedScan] ?? "# 보고서를 생성할 수 없습니다.\n\n선택한 스캔 데이터가 없습니다.");
      setLoading(false);
    }, 2200);
  };

  const remediation = REMEDIATION[selectedScan] ?? [];

  return (
    <>
      <div>
        <h1 className="m-0 text-[22px] font-bold text-text-primary">AI Reports</h1>
        <p className="mt-1 mb-0 text-[13px] text-text-muted">Gemini 기반 보안 보고서 자동 생성 및 대응 가이드</p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader title="보고서 생성 설정" />
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-[11px] text-text-muted mb-1.5 uppercase tracking-[0.8px]">
              스캔 결과 선택
            </label>
            <select
              value={selectedScan}
              onChange={(e) => { setSelectedScan(e.target.value); setReport(null); }}
              className="w-full px-3.5 py-2.5 bg-bg-surface border border-border rounded-lg text-text-primary text-sm outline-none focus:border-accent-blue focus:shadow-[0_0_0_3px_rgba(88,166,255,0.1)] transition-all"
            >
              {SCANS.map((s) => (
                <option key={s.id} value={s.id} className="bg-bg-surface">{s.label}</option>
              ))}
            </select>
          </div>
          <button
            className={`btn-primary flex items-center justify-center gap-2 min-w-[160px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-[rgba(0,0,0,0.3)] border-t-[#0d1117] rounded-full animate-spin-slow" />
                생성 중...
              </>
            ) : (
              "✦ 보고서 생성"
            )}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        {/* Report Editor */}
        <Card>
          <CardHeader
            title="생성된 보고서 초안"
            subtitle={report ? "Gemini 1.5 Pro 생성" : "보고서를 생성하면 여기에 표시됩니다"}
            action={report ? (
              <button className="btn-ghost text-[11px] px-2.5 py-1.5" onClick={() => navigator.clipboard.writeText(report)}>
                복사
              </button>
            ) : undefined}
          />
          {loading && (
            <div className="flex flex-col gap-2.5">
              {[80, 60, 90, 50, 70].map((w, i) => (
                <div key={i} className="skeleton h-4" style={{ width: `${w}%` }} />
              ))}
            </div>
          )}
          {!loading && !report && (
            <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 text-text-muted text-[13px]">
              <span className="text-4xl text-accent-purple">✦</span>
              <p className="m-0">스캔 결과를 선택하고 보고서 생성을 클릭하세요</p>
            </div>
          )}
          {report && !loading && (
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="min-h-[380px] w-full resize-y font-mono text-[13px] leading-[1.8] p-4 bg-bg-surface border border-border rounded-lg text-text-primary focus:border-accent-blue focus:shadow-[0_0_0_3px_rgba(88,166,255,0.1)] transition-all"
            />
          )}
        </Card>

        {/* Remediation Guide */}
        <Card>
          <CardHeader title="대응 가이드" subtitle="Remediation Guide" />
          {remediation.length === 0 ? (
            <p className="text-[13px] text-text-muted">보고서를 생성하면 대응 가이드가 표시됩니다.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {remediation.map((item, i) => (
                <div key={i} className="bg-bg-surface rounded-lg border border-border border-l-3 border-l-accent-blue py-3 px-3.5 flex gap-2.5">
                  <span className="min-w-[22px] h-[22px] rounded-full bg-[rgba(88,166,255,0.15)] text-accent-blue flex items-center justify-center text-[11px] font-bold">
                    {i + 1}
                  </span>
                  <p className="m-0 text-xs leading-[1.7] text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          )}

          {/* Gemini badge */}
          <div className="mt-4 py-2.5 px-3.5 bg-[rgba(0,199,169,0.08)] border border-[rgba(0,199,169,0.25)] rounded-lg flex items-center gap-2">
            <span className="text-base text-accent-purple">✦</span>
            <div>
              <div className="text-[11px] font-bold text-accent-purple">Powered by Gemini</div>
              <div className="text-[10px] text-text-muted">AI 가이드는 참고용입니다. 전문가 검토 후 적용하세요.</div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

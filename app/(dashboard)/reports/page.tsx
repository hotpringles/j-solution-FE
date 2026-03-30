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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>AI Reports</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>Gemini 기반 보안 보고서 자동 생성 및 대응 가이드</p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader title="보고서 생성 설정" />
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
              스캔 결과 선택
            </label>
            <select
              value={selectedScan}
              onChange={(e) => { setSelectedScan(e.target.value); setReport(null); }}
              style={{
                width: "100%", padding: "10px 14px",
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                borderRadius: 8, color: "var(--text-primary)", fontSize: 14, outline: "none",
              }}
            >
              {SCANS.map((s) => (
                <option key={s.id} value={s.id} style={{ background: "var(--bg-surface)" }}>{s.label}</option>
              ))}
            </select>
          </div>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160, justifyContent: "center", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0d1117", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
                생성 중...
              </>
            ) : (
              "✦ 보고서 생성"
            )}
          </button>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        {/* Report Editor */}
        <Card>
          <CardHeader
            title="생성된 보고서 초안"
            subtitle={report ? "Gemini 1.5 Pro 생성" : "보고서를 생성하면 여기에 표시됩니다"}
            action={report ? (
              <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => navigator.clipboard.writeText(report)}>
                복사
              </button>
            ) : undefined}
          />
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[80, 60, 90, 50, 70].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: 16, width: `${w}%` }} />
              ))}
            </div>
          )}
          {!loading && !report && (
            <div style={{
              minHeight: 300, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 12,
              color: "var(--text-muted)", fontSize: 13,
            }}>
              <span style={{ fontSize: 36 }}>✦</span>
              <p style={{ margin: 0 }}>스캔 결과를 선택하고 보고서 생성을 클릭하세요</p>
            </div>
          )}
          {report && !loading && (
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              style={{
                minHeight: 380, resize: "vertical", fontFamily: "monospace",
                fontSize: 13, lineHeight: 1.8, padding: 16,
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                borderRadius: 8, color: "var(--text-primary)", width: "100%",
              }}
            />
          )}
        </Card>

        {/* Remediation Guide */}
        <Card>
          <CardHeader title="대응 가이드" subtitle="Remediation Guide" />
          {remediation.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>보고서를 생성하면 대응 가이드가 표시됩니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {remediation.map((item, i) => (
                <div key={i} style={{
                  background: "var(--bg-surface)", borderRadius: 8,
                  border: "1px solid var(--border)", borderLeft: "3px solid var(--accent-blue)",
                  padding: "12px 14px", display: "flex", gap: 10,
                }}>
                  <span style={{
                    minWidth: 22, height: 22, borderRadius: "50%",
                    background: "rgba(88,166,255,0.15)", color: "var(--accent-blue)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                  }}>{i + 1}</span>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: "var(--text-secondary)" }}>{item}</p>
                </div>
              ))}
            </div>
          )}

          {/* Gemini badge */}
          <div style={{
            marginTop: 16, padding: "10px 14px",
            background: "rgba(0,199,169,0.08)", border: "1px solid rgba(0,199,169,0.25)",
            borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>✦</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-purple)" }}>Powered by Gemini</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>AI 가이드는 참고용입니다. 전문가 검토 후 적용하세요.</div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

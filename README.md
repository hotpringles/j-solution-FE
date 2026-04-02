# 🛡️ 외부 통합 위험도 평가 시스템 (External Integrated Risk Assessment System)

> 외부 노출 자산의 위험도를 자동으로 평가하고 시각화하는 통합 보안 진단 PoC

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [화면 구성](#-화면-구성)
- [설치 및 실행](#-설치-및-실행)
- [환경 변수 설정](#-환경-변수-설정)
- [테스트](#-테스트)
- [제약 사항](#-제약-사항)
- [기대 효과](#-기대-효과)
- [팀 구성](#-팀-구성)

---

## 🔍 프로젝트 개요

DX·AX 가속화로 클라우드 및 제3자 연계 서비스가 급증하면서 IT 인프라의 공격 표면(Attack Surface)이 방대해졌습니다. 기존의 수동 점검 방식으로는 얽혀있는 전체 공격 표면을 효율적으로 관리하기 어렵습니다.

본 프로젝트는 **외부 노출 자산의 위험도를 자동으로 수집·분석·시각화하는 통합 보안 진단 PoC(Proof of Concept)** 개발을 목표로 합니다.

| 항목              | 내용                                                  |
| ----------------- | ----------------------------------------------------- |
| **프로젝트 유형** | PoC (Proof of Concept)                                |
| **대상 사용자**   | 기업 보안 담당자 및 IT 인프라 관리자                  |
| **수행 기간**     | 2026년 3월 1일 ~ 7월 31일 (총 4개월)                  |
| **참여 인원**     | 8명 (기업체 멘토 1, 지도교수 1, 대학원생 2, 학부생 4) |

---

## ✨ 주요 기능

시스템은 **수집 → 분석 → 시각화** 3단계 모듈로 구성됩니다.

### Module 1: 외부 자산 정보 수집 엔진

- **도메인 탐색 및 스캐닝**: 서브도메인 식별 및 Nmap, Naabu, HTTPX 파이프라인 구축
- **외부 데이터 연동**: Shodan, Censys 등 OSINT 외부 API 활용
- **데이터 정규화**: 비정형 서비스 정보를 취약점 DB 매칭에 적합한 포맷으로 변환

### Module 2: 리스크 추론 및 분석 모듈

- **통합 리스크 모델**: CVSS·EPSS·KEV 상관관계 분석 기반의 정량적 위험도 산정
- **도메인 특화 수식 모델링**: 과거 KEV 데이터를 활용한 커스텀 리스크 산정 수식

### Module 3: 통합 대시보드 및 리포팅

- **웹 기반 대시보드**: 자산 정보 및 위험도를 직관적으로 파악할 수 있는 UI
- **AI 기반 자동 리포팅**: Gemini API 연동을 통한 스캔 결과 요약 및 대응 가이드 자동 생성

---

## 🛠 기술 스택

| 분류            | 기술                                  |
| --------------- | ------------------------------------- |
| **Backend**     | Python 3                              |
| **Frontend**    | JavaScript, Next.js                   |
| **Database**    | MySQL (DBeaver 관리)                  |
| **스캐닝 도구** | Nmap, Naabu, HTTPX                    |
| **외부 API**    | Shodan, Censys, NVD, EPSS, Gemini API |
| **설계 도구**   | Figma, Notion                         |

---

## 🏗 시스템 아키텍처

```
[도메인 입력]
     │
     ▼
┌─────────────────────────────┐
│  Module 1: 수집 엔진         │
│  Nmap / Naabu / HTTPX        │
│  + Shodan / Censys OSINT     │
│  → 데이터 정규화              │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Module 2: 리스크 분석       │
│  CVSS + EPSS + KEV 통합 모델 │
│  NVD / KEV / EPSS API 연동   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Module 3: 대시보드 & 리포팅  │
│  Next.js 웹 대시보드          │
│  Gemini API 자동 보고서 생성  │
└─────────────────────────────┘
```

---

## 🖥 화면 구성

**UX 핵심 원칙**: 직관성(Intuitive) · 행동 유도(Actionable) · 자동화 요약(Automated & Summarized)

> 기본 테마: 다크 모드 (Dark Mode) — 보안 실무자의 장시간 작업 피로도 최소화

| 화면                 | 주요 내용                                                               |
| -------------------- | ----------------------------------------------------------------------- |
| **통합 대시보드 홈** | 전체 위험도 점수, Critical 건수, 위험 자산 Top 5, 위험도 분포/추이 차트 |
| **외부 자산 관리**   | 도메인 스캔 제어, 서브도메인 트리/리스트 뷰, 자산 필터링                |
| **위험도 분석 상세** | CVSS·KEV·EPSS 통합 게이지, 포트·서비스·취약점 DB 상세 정보              |
| **AI 리포팅**        | Gemini 기반 자동 요약 보고서, 실질적 대응 가이드(Remediation Guide)     |

> 차트 드릴다운(Drill-down) 기능: 클릭 시 해당 위험도 자산 목록으로 즉시 필터링

---

## 🚀 설치 및 실행

### 사전 요구사항

- Python 3.x
- Node.js 18+
- MySQL
- Docker (가상 환경 테스트용)

### 백엔드 설치

```bash
# 저장소 클론
git clone https://github.com/your-org/risk-assessment-system.git
cd risk-assessment-system

# Python 의존성 설치
pip install -r requirements.txt

# 스캐닝 엔진 실행
python main.py
```

### 프론트엔드 설치

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## ⚙️ 환경 변수 설정

`.env` 파일을 생성하고 아래 항목을 설정하세요.

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=risk_assessment
DB_USER=your_user
DB_PASSWORD=your_password

# External APIs
SHODAN_API_KEY=your_shodan_key
CENSYS_API_ID=your_censys_id
CENSYS_API_SECRET=your_censys_secret
NVD_API_KEY=your_nvd_key
GEMINI_API_KEY=your_gemini_key
```

---

## 🧪 테스트

### 가상 환경 테스트 (Docker)

```bash
# 가상 취약 환경 구축
docker-compose up -d

# 스캔 실행
python scanner.py --target localhost
```

### 실무 환경 테스트

- iM bank 협의하에 인가된 범위 내에서 제한적으로 수행

---

## ⚠️ 제약 사항

- **PoC 수준**: 상용화 완제품이 아닌 개념 증명 단계의 시스템입니다.
- **외부 API 의존성**: Shodan, Censys, NVD, EPSS, Gemini API의 Rate Limit 및 서비스 상태에 영향을 받습니다.
- **테스트 환경**: 실제 운영망 테스트는 사전 협의된 인가 범위 내에서만 수행됩니다.

---

## 💡 기대 효과

- **보안 수준 향상**: 주기적인 통합 평가 체계로 외부 노출 자산 보안 수준 강화
- **우선순위 효율화**: CVSS·EPSS·KEV 종합 정량적 모델로 의사결정 속도 향상
- **산학협력 성과**: KIIT 등 관련 학회 논문 발표 및 SW 등록 추진

---

## 👥 팀 구성

| 역할        | 인원 |
| ----------- | ---- |
| 기업체 멘토 | 1명  |
| 지도교수    | 1명  |
| 대학원생    | 2명  |
| 학부생      | 4명  |

---

## 📄 관련 문서

- [PRD (제품 요구사항 문서)](https://www.notion.so/PRD-3304ef7a92e88059ae3aec5622083e2a)
- [UI/UX 설계](https://www.notion.so/UI-UX-3304ef7a92e8802ebb4bcdc31f9e4274)

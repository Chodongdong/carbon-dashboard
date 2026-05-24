# Carbon Dashboard — Claude Code Context

## 과제 개요
하나루프 프론트엔드 채용 과제. PCF(제품 탄소 발자국) 계산 및 시각화 대시보드.

## 기술 스택
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Recharts (차트)
- Zustand v5 (상태 관리)
- React Hook Form + Zod (폼/유효성 검증)
- xlsx/SheetJS (Excel 임포트 — 보너스)
- Vitest + Testing Library (테스트)

## 도메인 지식
- **PCF** = Product Carbon Footprint. 활동 데이터 × 배출계수 = kgCO2e
- **GHG Scope 분류**:
  - Scope 2: 전기 (간접 에너지)
  - Scope 3: 원소재, 운송 (가치사슬)
- **배출계수**: DB 별도 테이블, 버전 이력 추적 필요

## 실제 시드 데이터 (Excel에서 추출)
활동 유형: 전기(kWh), 원소재(kg), 운송(ton-km)
기간: 2025-01 ~ 2025-08

배출계수:
- 전기 (한국전력): 0.456 kgCO2e/kWh
- 원소재 플라스틱 1: 2.3 kgCO2e/kg
- 원소재 플라스틱 2: 3.2 kgCO2e/kg
- 운송 트럭: 3.5 kgCO2e/ton-km

## 폴더 구조
```
src/
  app/                    # Next.js App Router 페이지
    layout.tsx
    page.tsx              # 대시보드 메인
    activities/page.tsx   # 활동 데이터 입력/조회
    emissions/page.tsx    # PCF 계산 결과
    emission-factors/page.tsx
  components/
    layout/               # NavigationDrawer, Header
    dashboard/            # KPI 카드, 트렌드 차트, Scope 파이
    activities/           # ActivityTable, ActivityForm
    emissions/            # PCFTable, EmissionChart
    ui/                   # 공통 Button, Input, Badge 등
  lib/
    api.ts                # 가짜 백엔드 (지연+실패 시뮬레이션)
    pcf.ts                # PCF 계산 로직 (테스트 대상)
    data/
      seed.ts             # 시드 데이터
      emission-factors.ts
  store/
    activities.ts         # Zustand store
    emission-factors.ts
  types/
    index.ts
  test/
    setup.ts
```

## 평가 기준 (배점)
- 도메인 이해 (PCF, GHG Scope): 25%
- 시스템 설계 (모듈성, 확장성): 30%
- UX (비전문가도 이해 가능): 25%
- 논리적 설명 (trade-off, AI 활용): 20%

## 체크리스트 필수 항목
- PCF 계산 결과 시각화
- 데이터 입력 에러 메시지
- README: yarn start 5단계 이내
- README: AI 도구 사용 내역
- GitHub public + 커밋 히스토리

## 보너스
- Excel 직접 임포트 (xlsx 파싱 — 구현 예정)
- ERD/스키마 다이어그램 in README

## 커밋 컨벤션
`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

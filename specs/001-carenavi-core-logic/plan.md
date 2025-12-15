# Implementation Plan: CareNavi Core Logic

**Branch**: `001-carenavi-core-logic` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-carenavi-core-logic/spec.md`

## Summary

CareNavi(Helddi) 앱의 핵심 로직 구현: 일일 컨디션 체크 → AI 미션 생성 → 자동 육성 시스템 → 하이브리드 커머스. React Native 기반 모바일 앱으로 Supabase 백엔드와 Gemini AI를 활용한 개인화 건강 관리 서비스.

## Technical Context

**Language/Version**: TypeScript 5.x, React Native 0.83+
**Primary Dependencies**: React Navigation, Zustand, Lottie, Reanimated, @google/generative-ai, @supabase/supabase-js
**Storage**: Supabase (PostgreSQL), AsyncStorage (로컬 캐시)
**Testing**: Jest, React Native Testing Library, Detox (E2E)
**Target Platform**: iOS 15+, Android 10+ (API 29+)
**Project Type**: Mobile (React Native)
**Performance Goals**: 앱 로드 < 3초, AI 응답 < 5초, 애니메이션 60fps
**Constraints**: 오프라인 시 로컬 캐시 활용, 메모리 < 200MB
**Scale/Scope**: 초기 1,000명 → 10,000명 확장, 5개 주요 화면

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with CareNavi Constitution (`.specify/memory/constitution.md` v1.0.0):

- [x] **Security & Privacy First**: 건강 컨디션 데이터 처리 - Supabase RLS로 사용자별 데이터 격리, Auth로 인증, 전송 시 HTTPS 암호화
- [x] **Test-Driven Development**: 각 User Story별 테스트 작성 후 구현. Jest 단위 테스트 + Detox E2E 테스트
- [x] **Code Maintainability**: 기능별 모듈 분리 (screens/, components/, stores/, services/), 명확한 네이밍 규칙
- [x] **Performance & Scalability**: Supabase 인덱싱, React Query 캐싱, 이미지/애니메이션 최적화
- [x] **Data Integrity & Validation**: Zod 스키마 검증, Supabase 제약조건, 클라이언트/서버 이중 검증
- [x] **Healthcare-Specific**: 컨디션 데이터 접근 로깅, 데이터 익명화 고려 (향후), 에러 시 안전한 폴백

Any violations MUST be documented in "Complexity Tracking" section with justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-carenavi-core-logic/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
CareNavi/
├── src/
│   ├── App.tsx                    # 앱 진입점
│   ├── navigation/
│   │   └── RootNavigator.tsx      # 탭 네비게이션 설정
│   ├── screens/
│   │   ├── HomeScreen.tsx         # 메인 화면 (컨디션 체크 + 미션)
│   │   ├── CharacterScreen.tsx    # 캐릭터 육성 화면
│   │   ├── StoreScreen.tsx        # 스토어 화면
│   │   └── ProfileScreen.tsx      # 프로필/설정
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatBubble.tsx     # 대화 말풍선
│   │   │   └── ChatInput.tsx      # 입력 필드
│   │   ├── mission/
│   │   │   ├── MissionCard.tsx    # 미션 카드
│   │   │   └── MissionList.tsx    # 미션 목록
│   │   ├── character/
│   │   │   ├── CharacterView.tsx  # 캐릭터 표시
│   │   │   └── FeedingAnimation.tsx # 밥 먹기 애니메이션
│   │   └── store/
│   │       ├── ProductCard.tsx    # 상품 카드
│   │       └── RecommendationCard.tsx # AI 추천 카드
│   ├── stores/
│   │   ├── useAuthStore.ts        # 인증 상태
│   │   ├── useDailyStore.ts       # 일일 상태 (Before_Check, In_Progress, etc.)
│   │   ├── useConditionStore.ts   # 컨디션 데이터
│   │   ├── useMissionStore.ts     # 미션 상태
│   │   └── useCharacterStore.ts   # 캐릭터 XP/레벨
│   ├── services/
│   │   ├── supabase.ts            # Supabase 클라이언트
│   │   ├── geminiService.ts       # Gemini AI 서비스
│   │   ├── conditionService.ts    # 컨디션 분석 로직
│   │   └── missionService.ts      # 미션 생성 로직
│   ├── types/
│   │   └── index.ts               # TypeScript 타입 정의
│   └── utils/
│       ├── constants.ts           # 상수 정의
│       └── helpers.ts             # 유틸리티 함수
├── assets/
│   ├── animations/                # Lottie 애니메이션 파일
│   └── images/                    # 이미지 에셋
├── __tests__/
│   ├── unit/
│   │   ├── services/
│   │   └── stores/
│   ├── integration/
│   └── e2e/
├── ios/
├── android/
├── package.json
└── tsconfig.json
```

**Structure Decision**: Mobile (React Native) 단일 프로젝트 구조. 백엔드는 Supabase BaaS 활용으로 별도 서버 코드 불필요.

## Complexity Tracking

> **No violations - all constitution principles satisfied**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

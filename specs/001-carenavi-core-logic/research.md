# Research: CareNavi Core Logic

**Date**: 2025-12-16
**Feature**: 001-carenavi-core-logic

## Technology Decisions

### 1. React Native Setup

**Decision**: React Native CLI (not Expo)
**Rationale**:
- 네이티브 모듈에 대한 완전한 제어 필요 (Lottie, Reanimated 최적화)
- 향후 네이티브 기능 확장 가능성
- 이미 테스트 앱에서 CLI 방식 검증 완료

**Alternatives Considered**:
- Expo: 빠른 개발 가능하나 네이티브 모듈 제약

### 2. State Management - Zustand

**Decision**: Zustand
**Rationale**:
- 가벼운 번들 크기 (~2KB)
- 보일러플레이트 최소화
- React 외부에서도 상태 접근 가능 (서비스 레이어)
- TypeScript 지원 우수

**Alternatives Considered**:
- Redux Toolkit: 과도한 보일러플레이트, 학습 곡선
- Jotai: 원자적 상태에 적합하나 복잡한 상태 관리 어려움
- Context API: 리렌더링 이슈

### 3. Navigation - React Navigation

**Decision**: React Navigation v6
**Rationale**:
- React Native 생태계 표준
- 탭 네비게이션, 스택 네비게이션 모두 지원
- TypeScript 타입 안전성

**Implementation**:
```typescript
// Bottom Tab Navigator
- Home (컨디션 체크 + 미션)
- Character (육성)
- Store (커머스)
- Profile (설정)
```

### 4. Animation - Lottie + Reanimated Hybrid

**Decision**: 하이브리드 접근
**Rationale**:
- **Lottie**: 복잡한 캐릭터 애니메이션 (밥 먹기, 레벨업)
  - 디자이너가 After Effects에서 제작 가능
  - JSON 기반 벡터 애니메이션
- **Reanimated**: UI 인터랙션 애니메이션 (버튼 피드백, 트랜지션)
  - 네이티브 스레드 실행 (60fps 보장)
  - 제스처와 연동

**Best Practices**:
- Lottie 파일 크기 < 100KB 유지
- Reanimated worklet으로 무거운 계산 오프로드
- 메모리 누수 방지: 컴포넌트 언마운트 시 애니메이션 정리

### 5. AI Integration - Gemini

**Decision**: Google Gemini (gemini-2.0-flash-lite)
**Rationale**:
- 빠른 응답 속도 (flash-lite 모델)
- 한국어 지원 우수
- 비용 효율적

**Integration Pattern**:
```typescript
// 컨디션 분석 프롬프트 구조
{
  systemPrompt: "건강 컨디션 분석 AI. 사용자 입력에서 Mood, Physical, Main_Issue 추출",
  userInput: "{사용자 자연어 입력}",
  expectedOutput: { mood: string, physical: string, mainIssue: string }
}

// 미션 생성 프롬프트 구조
{
  systemPrompt: "개인화 건강 미션 생성 AI",
  conditionData: "{컨디션 분석 결과}",
  expectedOutput: {
    easy: { title, description, duration: "1min" },
    normal: { title, description, duration: "10-20min" },
    challenge: { title, description, duration: "varies" }
  }
}
```

**Rate Limiting**: 사용자당 일일 10회 AI 호출 제한 (초과 시 기본 미션)

### 6. Backend - Supabase

**Decision**: Supabase (PostgreSQL + Auth + Realtime)
**Rationale**:
- 빠른 개발 속도 (BaaS)
- Row Level Security로 데이터 격리
- 인증 내장
- 실시간 구독 지원 (향후 소셜 기능)

**Key Features Used**:
- **Auth**: 이메일/소셜 로그인
- **Database**: PostgreSQL 테이블
- **RLS**: 사용자별 데이터 접근 제어
- **Storage**: 프로필 이미지 (향후)

### 7. Offline Support

**Decision**: AsyncStorage + Optimistic Updates
**Rationale**:
- 네트워크 불안정 시에도 앱 사용 가능
- 미션 완료 상태 로컬 저장 후 동기화

**Implementation**:
- AsyncStorage에 캐시: 오늘의 컨디션, 미션 목록, 캐릭터 상태
- 온라인 복귀 시 Supabase와 동기화
- 충돌 해결: 서버 데이터 우선 (last-write-wins)

### 8. Testing Strategy

**Decision**: 3단계 테스트 피라미드
**Rationale**: Constitution의 TDD 원칙 준수

**Test Layers**:
1. **Unit Tests (Jest)**: 서비스 로직, 스토어, 유틸리티
2. **Component Tests (RNTL)**: 컴포넌트 렌더링, 이벤트 핸들링
3. **E2E Tests (Detox)**: 핵심 사용자 플로우

**Coverage Target**: 80% 이상 (핵심 비즈니스 로직)

## Security Considerations

### Data Protection

1. **전송 암호화**: Supabase 기본 HTTPS
2. **저장 암호화**: AsyncStorage는 민감 데이터용 SecureStore 대체 검토
3. **인증 토큰**: Supabase Auth JWT, Secure Storage 저장

### Input Validation

1. **클라이언트**: Zod 스키마 검증
2. **서버**: Supabase RLS 정책 + PostgreSQL 제약조건

## Performance Optimization

### App Startup
- 지연 로딩: 스토어/캐릭터 화면 lazy import
- 스플래시 스크린 동안 초기 데이터 프리페치

### Animation Performance
- Lottie: 캐시 활성화, 반복 애니메이션 최적화
- Reanimated: useAnimatedStyle에서 불필요한 재계산 방지

### Network
- 이미지 캐싱: react-native-fast-image 고려
- API 응답 캐싱: react-query 또는 SWR

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| XP 레벨업 임계값은? | 레벨 1→2: 100XP, 이후 레벨당 +50XP 증가 |
| 캐릭터 외형 변경 단계는? | 5단계 (Egg → Baby → Child → Teen → Adult) |
| 상품 추천 알고리즘은? | 컨디션 키워드 매칭 (피로→영양제, 스트레스→힐링) |
| 자정 리셋 시점 기준은? | 사용자 로컬 타임존 기준 |

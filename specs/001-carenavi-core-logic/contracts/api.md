# API Contracts: CareNavi Core Logic

**Date**: 2025-12-16
**Feature**: 001-carenavi-core-logic

## Overview

CareNavi는 Supabase를 BaaS로 사용하므로 별도 REST API 서버가 없습니다.
이 문서는 클라이언트 서비스 레이어의 함수 시그니처와 Supabase 쿼리 패턴을 정의합니다.

---

## Authentication Service

### `authService.signUp`

신규 사용자 가입.

```typescript
interface SignUpRequest {
  email: string;
  password: string;
  displayName?: string;
}

interface SignUpResponse {
  user: User;
  character: Character;
  session: Session;
}

async function signUp(request: SignUpRequest): Promise<SignUpResponse>
```

**Side Effects**:
- users 테이블에 프로필 생성
- characters 테이블에 기본 캐릭터 생성
- daily_states에 오늘 상태 생성 (before_check)

---

### `authService.signIn`

로그인.

```typescript
interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  user: User;
  session: Session;
}

async function signIn(request: SignInRequest): Promise<SignInResponse>
```

---

### `authService.signOut`

로그아웃.

```typescript
async function signOut(): Promise<void>
```

---

## Daily State Service

### `dailyStateService.getTodayState`

오늘의 상태 조회. 없으면 생성.

```typescript
interface GetTodayStateResponse {
  state: DailyState;
  isNewDay: boolean;  // 자정 리셋 여부
}

async function getTodayState(userId: string): Promise<GetTodayStateResponse>
```

**Logic**:
1. 오늘 날짜로 daily_states 조회
2. 없으면 새로 생성 (state: 'before_check')
3. 있고 어제 날짜면 리셋 처리

---

### `dailyStateService.updateState`

상태 전이.

```typescript
type StateTransition =
  | { from: 'before_check'; to: 'in_progress' }
  | { from: 'in_progress'; to: 'daily_completed' };

async function updateState(
  userId: string,
  transition: StateTransition
): Promise<DailyState>
```

**Validation**:
- 유효한 전이만 허용
- 이미 해당 상태면 무시

---

## Condition Service

### `conditionService.analyzeCondition`

AI로 컨디션 분석.

```typescript
interface AnalyzeConditionRequest {
  userId: string;
  rawInput: string;  // 사용자 자연어 입력
}

interface ConditionAnalysis {
  mood: string;
  physical: string;
  mainIssue: string;
  confidence: number;  // 0-1
  shouldRecommendProducts: boolean;
  productKeywords: string[];
}

interface AnalyzeConditionResponse {
  record: ConditionRecord;
  analysis: ConditionAnalysis;
}

async function analyzeCondition(
  request: AnalyzeConditionRequest
): Promise<AnalyzeConditionResponse>
```

**AI Prompt Structure**:
```
System: 당신은 건강 컨디션 분석 AI입니다.
사용자의 자연어 입력을 분석하여 다음을 추출하세요:
- mood: 기분 상태 (피로, 우울, 활기, 불안, 평온 등)
- physical: 신체 상태 (두통, 어깨결림, 소화불량, 좋음 등)
- mainIssue: 가장 중요한 이슈 요약

User: {rawInput}

Output: JSON 형식
```

**Error Handling**:
- AI 분석 실패 시 기본값 반환: { mood: '보통', physical: '보통', mainIssue: '일반' }

---

### `conditionService.getTodayCondition`

오늘 컨디션 조회.

```typescript
async function getTodayCondition(userId: string): Promise<ConditionRecord | null>
```

---

## Mission Service

### `missionService.generateMissions`

컨디션 기반 미션 생성.

```typescript
interface GenerateMissionsRequest {
  userId: string;
  conditionRecordId: string;
}

interface GenerateMissionsResponse {
  missions: Mission[];  // 항상 3개 (easy, normal, challenge)
}

async function generateMissions(
  request: GenerateMissionsRequest
): Promise<GenerateMissionsResponse>
```

**AI Prompt Structure**:
```
System: 당신은 개인화 건강 미션 생성 AI입니다.
사용자의 컨디션을 기반으로 3개의 미션을 생성하세요:

1. Easy (1분 이내): 간단한 활동 (물 마시기, 심호흡 등)
2. Normal (10-20분): 신체 활동 (산책, 스트레칭, 가벼운 운동)
3. Challenge (시간 가변): 멘탈케어 또는 영양 관리

User Condition:
- Mood: {mood}
- Physical: {physical}
- Main Issue: {mainIssue}

Output: JSON 배열
```

---

### `missionService.getTodayMissions`

오늘 미션 목록 조회.

```typescript
async function getTodayMissions(userId: string): Promise<Mission[]>
```

---

### `missionService.completeMission`

미션 완료 처리.

```typescript
interface CompleteMissionRequest {
  missionId: string;
  userId: string;
}

interface CompleteMissionResponse {
  mission: Mission;
  xpGained: number;
  character: Character;  // 업데이트된 캐릭터
  leveledUp: boolean;
  newStage: CharacterStage | null;  // 진화했으면
  allMissionsCompleted: boolean;
}

async function completeMission(
  request: CompleteMissionRequest
): Promise<CompleteMissionResponse>
```

**Side Effects**:
1. mission.is_completed = true, completed_at = now()
2. character.xp += mission.xp_reward
3. 레벨업 체크 및 처리
4. 진화 체크 및 처리
5. 모든 미션 완료 시 daily_state → daily_completed

---

## Character Service

### `characterService.getCharacter`

캐릭터 정보 조회.

```typescript
async function getCharacter(userId: string): Promise<Character>
```

---

### `characterService.addXp`

XP 추가 (내부 함수).

```typescript
interface AddXpResponse {
  character: Character;
  leveledUp: boolean;
  newLevel: number;
  stageChanged: boolean;
  newStage: CharacterStage | null;
}

async function addXp(userId: string, xp: number): Promise<AddXpResponse>
```

**Level Calculation**:
```typescript
function xpForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

function calculateLevel(totalXp: number): number {
  let level = 1;
  let xpNeeded = 100;
  let remaining = totalXp;

  while (remaining >= xpNeeded) {
    remaining -= xpNeeded;
    level++;
    xpNeeded = 100 + (level - 1) * 50;
  }

  return level;
}
```

**Stage Evolution**:
| Level | Stage |
|-------|-------|
| 1-4 | egg |
| 5-14 | baby |
| 15-29 | child |
| 30-49 | teen |
| 50+ | adult |

---

## Product Service

### `productService.getProducts`

상품 목록 조회.

```typescript
interface GetProductsRequest {
  category?: ProductCategory;
  limit?: number;
  offset?: number;
}

async function getProducts(request: GetProductsRequest): Promise<Product[]>
```

---

### `productService.getProductById`

상품 상세 조회.

```typescript
async function getProductById(productId: string): Promise<Product | null>
```

---

### `productService.getRecommendations`

조건 기반 상품 추천.

```typescript
interface GetRecommendationsRequest {
  conditionRecordId: string;
  limit?: number;  // default: 3
}

async function getRecommendations(
  request: GetRecommendationsRequest
): Promise<ProductRecommendation[]>
```

**Logic**:
1. condition_record의 키워드 추출
2. products.condition_keywords와 매칭
3. 매칭률 높은 순으로 정렬
4. product_recommendations에 기록

---

### `productService.recordClick`

추천 상품 클릭 기록.

```typescript
async function recordClick(recommendationId: string): Promise<void>
```

---

## Error Handling

### Error Types

```typescript
type ServiceError =
  | { code: 'AUTH_REQUIRED'; message: string }
  | { code: 'NOT_FOUND'; message: string; resource: string }
  | { code: 'VALIDATION_ERROR'; message: string; field: string }
  | { code: 'AI_ERROR'; message: string; fallback?: unknown }
  | { code: 'NETWORK_ERROR'; message: string }
  | { code: 'RATE_LIMITED'; message: string; retryAfter: number };
```

### Error Response Format

```typescript
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}
```

---

## Supabase Query Patterns

### 오늘 데이터 조회

```typescript
const today = new Date().toISOString().split('T')[0];

// Daily State
const { data } = await supabase
  .from('daily_states')
  .select('*')
  .eq('user_id', userId)
  .eq('date', today)
  .single();

// Missions
const { data } = await supabase
  .from('missions')
  .select('*')
  .eq('user_id', userId)
  .eq('date', today)
  .order('type', { ascending: true });  // easy, normal, challenge 순
```

### 트랜잭션 패턴 (미션 완료)

```typescript
// Supabase는 트랜잭션 미지원, RPC 함수로 처리
const { data, error } = await supabase.rpc('complete_mission', {
  p_mission_id: missionId,
  p_user_id: userId
});
```

```sql
-- Supabase Function
CREATE OR REPLACE FUNCTION complete_mission(
  p_mission_id UUID,
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_mission missions%ROWTYPE;
  v_character characters%ROWTYPE;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_all_completed BOOLEAN;
BEGIN
  -- 미션 업데이트
  UPDATE missions
  SET is_completed = TRUE, completed_at = NOW()
  WHERE id = p_mission_id AND user_id = p_user_id
  RETURNING * INTO v_mission;

  -- 캐릭터 XP 업데이트
  UPDATE characters
  SET xp = xp + v_mission.xp_reward,
      level = calculate_level(xp + v_mission.xp_reward),
      stage = calculate_stage(calculate_level(xp + v_mission.xp_reward))
  WHERE user_id = p_user_id
  RETURNING * INTO v_character;

  -- 모든 미션 완료 체크
  SELECT NOT EXISTS (
    SELECT 1 FROM missions
    WHERE user_id = p_user_id
    AND date = CURRENT_DATE
    AND is_completed = FALSE
  ) INTO v_all_completed;

  -- daily_state 업데이트
  IF v_all_completed THEN
    UPDATE daily_states
    SET state = 'daily_completed'
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
  END IF;

  RETURN jsonb_build_object(
    'mission', row_to_json(v_mission),
    'character', row_to_json(v_character),
    'all_completed', v_all_completed
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

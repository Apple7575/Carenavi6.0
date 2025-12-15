# Data Model: CareNavi Core Logic

**Date**: 2025-12-16
**Feature**: 001-carenavi-core-logic

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│    User     │───────│  DailyState      │       │  Character  │
│             │  1:1  │                  │       │             │
└─────────────┘       └──────────────────┘       └─────────────┘
      │                       │                        │
      │ 1:N                   │ 1:N                    │ 1:1
      ▼                       ▼                        │
┌─────────────┐       ┌──────────────────┐            │
│ Condition   │       │     Mission      │◄───────────┘
│  Record     │       │                  │
└─────────────┘       └──────────────────┘
      │
      │ 1:N
      ▼
┌─────────────────────┐       ┌─────────────┐
│ ProductRecommendation│──────│   Product   │
│                     │  N:1  │             │
└─────────────────────┘       └─────────────┘
```

## Entities

### 1. User (users)

사용자 계정 정보. Supabase Auth와 연동.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 사용자 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 주소 |
| display_name | VARCHAR(100) | | 표시 이름 |
| avatar_url | TEXT | | 프로필 이미지 URL |
| timezone | VARCHAR(50) | DEFAULT 'Asia/Seoul' | 사용자 타임존 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 가입 일시 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | 수정 일시 |

**RLS Policy**: 자신의 데이터만 조회/수정 가능

---

### 2. Character (characters)

사용자의 육성 캐릭터 (헬띠).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 캐릭터 ID |
| user_id | UUID | FK → users.id, UNIQUE, NOT NULL | 소유자 ID |
| name | VARCHAR(50) | DEFAULT '헬띠' | 캐릭터 이름 |
| xp | INTEGER | DEFAULT 0, CHECK >= 0 | 경험치 |
| level | INTEGER | DEFAULT 1, CHECK >= 1 | 레벨 |
| stage | VARCHAR(20) | DEFAULT 'egg' | 성장 단계 (egg/baby/child/teen/adult) |
| appearance_data | JSONB | DEFAULT '{}' | 외형 커스터마이징 데이터 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 생성 일시 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | 수정 일시 |

**State Transitions**:
- stage: egg → baby (Lv.5) → child (Lv.15) → teen (Lv.30) → adult (Lv.50)

**Level Calculation**:
```
Level 1→2: 100 XP
Level 2→3: 150 XP
Level N→N+1: 100 + (N-1) * 50 XP
```

---

### 3. DailyState (daily_states)

사용자의 일일 상태 추적.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 상태 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 ID |
| date | DATE | NOT NULL | 해당 날짜 |
| state | VARCHAR(20) | NOT NULL, DEFAULT 'before_check' | 상태값 |
| reset_at | TIMESTAMPTZ | | 리셋 시간 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 생성 일시 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | 수정 일시 |

**Unique Constraint**: (user_id, date)

**State Values**:
- `before_check`: 컨디션 체크 전
- `in_progress`: 미션 진행 중
- `daily_completed`: 모든 미션 완료

**State Transitions**:
```
[자정 리셋] → before_check → [컨디션 저장] → in_progress → [모든 미션 완료] → daily_completed
```

---

### 4. ConditionRecord (condition_records)

일일 컨디션 기록.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 기록 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 ID |
| date | DATE | NOT NULL | 기록 날짜 |
| raw_input | TEXT | NOT NULL | 사용자 원본 입력 |
| mood | VARCHAR(50) | | 기분 (피로, 우울, 활기 등) |
| physical | VARCHAR(100) | | 신체 상태 (어깨 통증, 두통 등) |
| main_issue | VARCHAR(100) | | 주요 이슈 |
| ai_analysis | JSONB | DEFAULT '{}' | AI 분석 전체 결과 |
| recorded_at | TIMESTAMPTZ | DEFAULT NOW() | 기록 시간 |

**Unique Constraint**: (user_id, date)

**Validation**:
- raw_input: 최소 2자, 최대 500자
- mood/physical/main_issue: AI 분석 실패 시 NULL 가능

---

### 5. Mission (missions)

일일 미션.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 미션 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 ID |
| condition_record_id | UUID | FK → condition_records.id | 관련 컨디션 기록 |
| date | DATE | NOT NULL | 미션 날짜 |
| type | VARCHAR(20) | NOT NULL | 유형 (easy/normal/challenge) |
| title | VARCHAR(100) | NOT NULL | 미션 제목 |
| description | TEXT | | 미션 설명 |
| estimated_duration | VARCHAR(20) | | 예상 소요 시간 |
| xp_reward | INTEGER | NOT NULL, CHECK > 0 | XP 보상 |
| is_completed | BOOLEAN | DEFAULT FALSE | 완료 여부 |
| completed_at | TIMESTAMPTZ | | 완료 시간 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 생성 일시 |

**XP Rewards**:
- easy: 10 XP
- normal: 25 XP
- challenge: 50 XP

**Validation**:
- 하루에 user당 정확히 3개 미션 (easy 1, normal 1, challenge 1)

---

### 6. Product (products)

스토어 상품.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 상품 ID |
| name | VARCHAR(200) | NOT NULL | 상품명 |
| description | TEXT | | 상품 설명 |
| category | VARCHAR(50) | NOT NULL | 카테고리 |
| price | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | 가격 |
| image_url | TEXT | | 상품 이미지 |
| condition_keywords | TEXT[] | DEFAULT '{}' | 추천 조건 키워드 |
| is_active | BOOLEAN | DEFAULT TRUE | 판매 상태 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 생성 일시 |

**Categories**: supplements, wellness, food, accessories

**Condition Keywords Examples**: ['피로', '에너지'], ['스트레스', '불안'], ['영양', '비타민']

---

### 7. ProductRecommendation (product_recommendations)

AI 상품 추천 기록.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 추천 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 ID |
| condition_record_id | UUID | FK → condition_records.id, NOT NULL | 관련 컨디션 |
| product_id | UUID | FK → products.id, NOT NULL | 추천 상품 |
| match_reason | TEXT | | 추천 이유 |
| is_clicked | BOOLEAN | DEFAULT FALSE | 클릭 여부 |
| clicked_at | TIMESTAMPTZ | | 클릭 시간 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 생성 일시 |

---

## Indexes

```sql
-- 성능 최적화 인덱스
CREATE INDEX idx_daily_states_user_date ON daily_states(user_id, date DESC);
CREATE INDEX idx_condition_records_user_date ON condition_records(user_id, date DESC);
CREATE INDEX idx_missions_user_date ON missions(user_id, date DESC);
CREATE INDEX idx_missions_completed ON missions(user_id, is_completed) WHERE is_completed = FALSE;
CREATE INDEX idx_products_category ON products(category) WHERE is_active = TRUE;
CREATE INDEX idx_products_keywords ON products USING GIN(condition_keywords);
```

## Row Level Security Policies

```sql
-- Users: 자신의 데이터만
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_self ON users FOR ALL USING (auth.uid() = id);

-- Characters: 자신의 캐릭터만
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY characters_owner ON characters FOR ALL USING (auth.uid() = user_id);

-- DailyStates: 자신의 상태만
ALTER TABLE daily_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY daily_states_owner ON daily_states FOR ALL USING (auth.uid() = user_id);

-- ConditionRecords: 자신의 기록만
ALTER TABLE condition_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY condition_records_owner ON condition_records FOR ALL USING (auth.uid() = user_id);

-- Missions: 자신의 미션만
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY missions_owner ON missions FOR ALL USING (auth.uid() = user_id);

-- Products: 모든 활성 상품 조회 가능
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY products_public ON products FOR SELECT USING (is_active = TRUE);

-- ProductRecommendations: 자신의 추천만
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY recommendations_owner ON product_recommendations FOR ALL USING (auth.uid() = user_id);
```

## TypeScript Types

```typescript
// types/database.ts

export type DailyStateValue = 'before_check' | 'in_progress' | 'daily_completed';
export type MissionType = 'easy' | 'normal' | 'challenge';
export type CharacterStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult';
export type ProductCategory = 'supplements' | 'wellness' | 'food' | 'accessories';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  user_id: string;
  name: string;
  xp: number;
  level: number;
  stage: CharacterStage;
  appearance_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DailyState {
  id: string;
  user_id: string;
  date: string;
  state: DailyStateValue;
  reset_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConditionRecord {
  id: string;
  user_id: string;
  date: string;
  raw_input: string;
  mood: string | null;
  physical: string | null;
  main_issue: string | null;
  ai_analysis: Record<string, unknown>;
  recorded_at: string;
}

export interface Mission {
  id: string;
  user_id: string;
  condition_record_id: string | null;
  date: string;
  type: MissionType;
  title: string;
  description: string | null;
  estimated_duration: string | null;
  xp_reward: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  price: number;
  image_url: string | null;
  condition_keywords: string[];
  is_active: boolean;
  created_at: string;
}

export interface ProductRecommendation {
  id: string;
  user_id: string;
  condition_record_id: string;
  product_id: string;
  match_reason: string | null;
  is_clicked: boolean;
  clicked_at: string | null;
  created_at: string;
}
```

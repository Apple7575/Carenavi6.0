# Feature Specification: CareNavi (Helddi) Core Logic

**Feature Branch**: `001-carenavi-core-logic`
**Created**: 2025-12-16
**Status**: Draft
**Input**: User description: "CareNavi (Helddi) - Full Logic Specification including daily cycle, AI condition check, mission generation, auto-growth gamification, and hybrid commerce"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Daily Condition Check (Priority: P1)

사용자가 앱에 진입하면 캐릭터 '헬띠'가 먼저 인사하며 오늘의 컨디션을 묻고, 사용자가 자연어로 응답하면 AI가 이를 분석하여 기분(Mood), 신체상태(Physical), 주요이슈(Main_Issue)를 추출하여 저장한다.

**Why this priority**: 핵심 기능의 시작점. 컨디션 데이터 없이는 미션 생성, 상품 추천 등 모든 후속 기능이 작동하지 않음.

**Independent Test**: 앱 진입 → 헬띠 인사 확인 → 자연어 입력 → 컨디션 분석 결과 확인으로 테스트 가능

**Acceptance Scenarios**:

1. **Given** 사용자가 하루 상태가 'Before_Check'인 상태에서 앱에 진입, **When** 앱이 로드되면, **Then** 헬띠가 먼저 "오늘 기분이 어때?" 형식의 인사를 표시한다
2. **Given** 헬띠가 컨디션을 묻는 상태, **When** 사용자가 "좀 피곤하고 어깨가 뻐근해"라고 입력, **Then** AI가 {Mood: "피로", Physical: "어깨 통증", Main_Issue: "피로/근육긴장"}을 추출한다
3. **Given** 컨디션 분석이 완료된 상태, **When** 데이터가 저장되면, **Then** 하루 상태가 'In_Progress'로 변경되고 미션 생성 단계로 전환된다

---

### User Story 2 - AI Mission Generation (Priority: P1)

컨디션 데이터를 기반으로 AI가 사용자 맞춤 미션 3개(Easy, Normal, Challenge)를 생성하고 표시한다.

**Why this priority**: 컨디션 체크 직후 실행되는 핵심 기능. 미션이 없으면 육성 시스템이 작동하지 않음.

**Independent Test**: 컨디션 데이터 입력 → 3개 미션 생성 확인 → 미션 난이도별 분류 확인으로 테스트 가능

**Acceptance Scenarios**:

1. **Given** 컨디션 데이터가 저장된 상태, **When** 미션 생성 단계에 진입, **Then** 총 3개의 맞춤 미션이 생성된다
2. **Given** 컨디션이 "피로/어깨 통증"인 상태, **When** 미션이 생성되면, **Then** Mission A(Easy)는 1분 내 완료 가능한 미션(예: 물 마시기), Mission B(Normal)는 10-20분 신체 활동(예: 어깨 스트레칭), Mission C(Challenge)는 멘탈/영양 관리 미션(예: 5분 명상)을 포함한다
3. **Given** 미션이 생성된 상태, **When** 사용자가 미션 목록을 확인, **Then** 각 미션에 난이도 표시와 예상 소요 시간이 표시된다

---

### User Story 3 - Mission Completion & Auto-Growth (Priority: P2)

사용자가 미션을 완료(Check)하면 자동으로 캐릭터가 밥을 먹는 애니메이션이 재생되고, 애니메이션 종료 후 XP가 상승하며, 임계값 도달 시 레벨업 이벤트가 발생한다.

**Why this priority**: 사용자 참여도와 리텐션의 핵심. 미션 완료에 대한 즉각적인 보상 피드백 제공.

**Independent Test**: 미션 완료 버튼 → 밥 먹기 애니메이션 재생 → XP 증가 확인 → 레벨업 임계값 도달 시 이벤트 확인으로 테스트 가능

**Acceptance Scenarios**:

1. **Given** 미션 목록이 표시된 상태, **When** 사용자가 미션 완료(Check) 버튼을 탭, **Then** 별도 조작 없이 캐릭터 '밥 먹는 애니메이션'이 자동 재생된다
2. **Given** 밥 먹는 애니메이션이 재생 중인 상태, **When** 애니메이션이 종료되면, **Then** 캐릭터 XP가 미션 난이도에 따라 상승한다 (Easy: 10XP, Normal: 25XP, Challenge: 50XP)
3. **Given** 캐릭터 XP가 레벨업 임계값 직전인 상태, **When** XP가 임계값을 초과하면, **Then** 레벨업 이벤트(축하 애니메이션, 외형 변경)가 발생한다

---

### User Story 4 - Daily State Reset (Priority: P2)

매일 자정(00:00)이 지나면 사용자의 하루 상태가 'Before_Check'로 자동 리셋되어 새로운 하루 사이클을 시작할 수 있다.

**Why this priority**: 일일 반복 사용을 위한 필수 기능. 리셋 없이는 하루 사이클이 작동하지 않음.

**Independent Test**: 자정 이후 앱 진입 → 상태가 'Before_Check'로 리셋되었는지 확인으로 테스트 가능

**Acceptance Scenarios**:

1. **Given** 사용자의 하루 상태가 'Daily_Completed'인 상태, **When** 날짜가 바뀌고(자정 통과) 앱에 진입, **Then** 하루 상태가 'Before_Check'로 리셋된다
2. **Given** 미션이 일부만 완료된 상태(In_Progress), **When** 자정이 지나고 앱에 진입, **Then** 이전 미션은 초기화되고 상태가 'Before_Check'로 변경된다

---

### User Story 5 - Store Tab & Product Browsing (Priority: P3)

사용자가 하단 탭바의 '스토어' 메뉴를 통해 상품을 탐색할 수 있다.

**Why this priority**: 수익 모델의 기반이지만 핵심 기능 완성 후 구현해도 됨.

**Independent Test**: 하단 탭 스토어 탭 → 상품 목록 표시 → 상세 페이지 이동 확인으로 테스트 가능

**Acceptance Scenarios**:

1. **Given** 앱의 어느 화면에서든, **When** 하단 탭바를 확인, **Then** '스토어' 메뉴가 상시 노출된다
2. **Given** 스토어 탭을 선택한 상태, **When** 스토어 화면이 로드되면, **Then** 카테고리별 상품 목록이 표시된다
3. **Given** 상품 목록이 표시된 상태, **When** 상품 카드를 탭, **Then** 상품 상세 페이지로 이동한다

---

### User Story 6 - AI Product Recommendation (Priority: P3)

AI가 컨디션 분석 중 영양 결핍/피로 징후를 발견하면 대화 끝에 관련 상품을 자연스럽게 추천한다.

**Why this priority**: 수익화 및 사용자 가치 제공의 교차점. 핵심 기능 안정화 후 추가.

**Independent Test**: 특정 컨디션(피로, 영양결핍) 입력 → 미션 생성 후 상품 추천 카드 표시 확인으로 테스트 가능

**Acceptance Scenarios**:

1. **Given** 사용자가 "요즘 너무 피곤하고 입맛이 없어"라고 컨디션 입력, **When** AI가 분석을 완료하고 미션을 제시, **Then** 대화 끝에 "이런 영양제가 도움이 될 수 있어요" 형태로 관련 상품 카드가 추천된다
2. **Given** 상품 추천 카드가 표시된 상태, **When** 사용자가 카드를 탭, **Then** 스토어의 해당 상품 상세 페이지로 이동한다
3. **Given** 컨디션이 "기분 좋음, 건강함"인 상태, **When** AI가 분석을 완료, **Then** 상품 추천을 표시하지 않는다 (필요할 때만 추천)

---

### Edge Cases

- 사용자가 컨디션 질문에 응답하지 않고 앱을 종료하면? → 상태 유지(Before_Check), 다음 진입 시 다시 질문
- AI가 자연어 응답을 분석하지 못하면? → 기본 미션 세트 제공 + "좀 더 자세히 알려줄래요?" 재질문
- 자정에 앱이 활성화된 상태라면? → 백그라운드에서 상태 리셋, 다음 화면 전환 시 적용
- 네트워크 오류로 컨디션 저장 실패 시? → 로컬 캐시 후 재시도, 사용자에게 오류 메시지 표시
- 미션 완료 중 앱 종료 시? → 완료 상태 로컬 저장, 다음 진입 시 애니메이션부터 재개

## Requirements *(mandatory)*

### Functional Requirements

**Daily State Machine**
- **FR-001**: System MUST manage user daily state as three states: Before_Check, In_Progress, Daily_Completed
- **FR-002**: System MUST reset daily state to 'Before_Check' at midnight (00:00) local time
- **FR-003**: System MUST transition state from Before_Check → In_Progress when condition data is saved

**Condition Check**
- **FR-004**: System MUST display character greeting when user enters app in 'Before_Check' state
- **FR-005**: System MUST accept natural language input for condition description
- **FR-006**: System MUST analyze natural language input to extract Mood, Physical condition, and Main_Issue using AI
- **FR-007**: System MUST persist condition data to database upon successful analysis

**Mission Generation**
- **FR-008**: System MUST generate exactly 3 personalized missions based on condition data
- **FR-009**: Mission A (Easy) MUST be completable within 1 minute (e.g., drink water)
- **FR-010**: Mission B (Normal) MUST involve 10-20 minutes of physical activity (e.g., walking, stretching)
- **FR-011**: Mission C (Challenge) MUST focus on mental health or nutrition (e.g., meditation, supplements)
- **FR-012**: System MUST display estimated completion time and difficulty for each mission

**Auto-Growth Gamification**
- **FR-013**: System MUST play "eating animation" automatically when user completes a mission
- **FR-014**: System MUST increase character XP after eating animation ends (Easy: 10XP, Normal: 25XP, Challenge: 50XP)
- **FR-015**: System MUST trigger level-up event when XP exceeds threshold
- **FR-016**: Level-up event MUST include celebration animation and character appearance change

**Commerce**
- **FR-017**: System MUST display 'Store' menu in bottom tab bar on all screens
- **FR-018**: System MUST recommend relevant products when AI detects nutrition deficiency or fatigue indicators
- **FR-019**: Product recommendation MUST appear naturally at the end of condition analysis conversation
- **FR-020**: Tapping product recommendation card MUST navigate to product detail page in store

### Key Entities

- **User**: Represents app user with profile, current daily state, character data (XP, level)
- **DailyState**: Tracks user's daily cycle state (Before_Check, In_Progress, Daily_Completed) with reset timestamp
- **ConditionRecord**: Stores daily condition data (Mood, Physical, Main_Issue, recorded_at)
- **Mission**: Generated daily missions with type (Easy/Normal/Challenge), description, completion status, XP reward
- **Character**: User's virtual pet with XP, level, appearance state
- **Product**: Store items with category, description, price, related conditions for recommendation
- **ProductRecommendation**: Links condition analysis results to relevant products

### Security & Privacy Requirements

- **SR-001**: Users MUST authenticate before accessing personal health condition data
- **SR-002**: Users can only access their own condition records and character data
- **SR-003**: Condition data (health-related) MUST be encrypted at rest
- **SR-004**: All condition data access and modifications MUST be logged with user ID and timestamp
- **SR-005**: All user inputs MUST be sanitized to prevent injection attacks
- **SR-006**: Product recommendations MUST NOT expose sensitive health data to third parties

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete daily condition check (from app open to mission display) in under 2 minutes
- **SC-002**: 80% of users complete at least 1 mission per day within first week of use
- **SC-003**: Character feeding animation plays within 1 second of mission completion tap
- **SC-004**: AI successfully extracts condition data from 90% of natural language inputs without requiring clarification
- **SC-005**: Daily retention rate reaches 60% after 7 days of initial use
- **SC-006**: Product recommendation click-through rate reaches 15% when recommendations are displayed
- **SC-007**: System handles midnight state reset for all active users without data loss or errors

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native |
| State Management | Zustand |
| Navigation | React Navigation |
| Animation | Lottie + Reanimated (hybrid) |
| AI | Gemini (flash-lite) |
| Backend/DB | Supabase |
| Authentication | Supabase Auth |

## Assumptions

- Users have stable internet connection for AI analysis and data sync
- Supabase is used as the backend database
- Character design and animations are provided separately (asset dependency)
- Product catalog is pre-populated in the store
- Korean is the primary language for the app interface and AI interactions

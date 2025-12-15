# Tasks: CareNavi Core Logic

**Input**: Design documents from `/specs/001-carenavi-core-logic/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per CareNavi Constitution Principle II (Test-Driven Development - NON-NEGOTIABLE), test tasks are MANDATORY. Tests must be written FIRST, verified to FAIL, then implementation follows. The TDD cycle (Red-Green-Refactor) is strictly enforced.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile (React Native)**: `CareNavi/src/`, `CareNavi/__tests__/` at repository root
- Paths shown below follow plan.md project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: React Native project initialization and basic structure

- [ ] T001 Create React Native project with TypeScript template using `npx @react-native-community/cli init CareNavi --template react-native-template-typescript`
- [ ] T002 Install navigation dependencies: @react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/stack, react-native-screens, react-native-safe-area-context
- [ ] T003 [P] Install state management: zustand
- [ ] T004 [P] Install animation libraries: lottie-react-native, react-native-reanimated
- [ ] T005 [P] Install Supabase: @supabase/supabase-js, @react-native-async-storage/async-storage
- [ ] T006 [P] Install AI: @google/generative-ai
- [ ] T007 [P] Install utilities: zod, date-fns
- [ ] T008 [P] Install dev dependencies: @types/react, @testing-library/react-native, jest
- [ ] T009 Configure babel.config.js for Reanimated plugin
- [ ] T010 iOS: Update Podfile for Reanimated and run pod install
- [ ] T011 Create environment config in CareNavi/src/config/env.ts and CareNavi/src/config/env.example.ts
- [ ] T012 [P] Create TypeScript types in CareNavi/src/types/index.ts (DailyStateValue, MissionType, CharacterStage, ProductCategory, all entity interfaces)
- [ ] T013 [P] Create constants in CareNavi/src/utils/constants.ts (XP rewards, level thresholds, stage transitions)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational (MANDATORY per Constitution) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation (TDD cycle)**

- [ ] T014 [P] Unit test for Supabase client connection in CareNavi/__tests__/unit/services/supabase.test.ts
- [ ] T015 [P] Unit test for level/stage calculation helpers in CareNavi/__tests__/unit/utils/helpers.test.ts
- [ ] T016 [P] Unit test for useAuthStore in CareNavi/__tests__/unit/stores/useAuthStore.test.ts

### Implementation for Foundational

- [ ] T017 Create Supabase client in CareNavi/src/services/supabase.ts with AsyncStorage auth persistence
- [ ] T018 Create helper functions in CareNavi/src/utils/helpers.ts (calculateLevel, calculateStage, xpForLevel, getTodayDate)
- [ ] T019 Implement useAuthStore in CareNavi/src/stores/useAuthStore.ts (signUp, signIn, signOut, session state)
- [ ] T020 Create authService in CareNavi/src/services/authService.ts (signUp with user/character creation, signIn, signOut)
- [ ] T021 Create RootNavigator with bottom tabs in CareNavi/src/navigation/RootNavigator.tsx (Home, Character, Store, Profile tabs)
- [ ] T022 Create placeholder screens: CareNavi/src/screens/HomeScreen.tsx, CharacterScreen.tsx, StoreScreen.tsx, ProfileScreen.tsx
- [ ] T023 Update CareNavi/src/App.tsx with NavigationContainer and RootNavigator
- [ ] T024 Create Supabase tables via SQL Editor (users, characters, daily_states, condition_records, missions, products, product_recommendations) per data-model.md
- [ ] T025 Enable RLS and create policies per data-model.md SQL
- [ ] T026 Create Supabase helper functions (calculate_level, calculate_stage, complete_mission RPC) per contracts/api.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Daily Condition Check (Priority: P1) 🎯 MVP

**Goal**: User enters app → Character greets → User inputs condition in natural language → AI analyzes and extracts Mood/Physical/Main_Issue → State transitions to In_Progress

**Independent Test**: 앱 진입 → 헬띠 인사 확인 → 자연어 입력 → 컨디션 분석 결과 확인

### Tests for User Story 1 (MANDATORY per Constitution) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation (TDD cycle)**

- [ ] T027 [P] [US1] Unit test for useDailyStore in CareNavi/__tests__/unit/stores/useDailyStore.test.ts
- [ ] T028 [P] [US1] Unit test for useConditionStore in CareNavi/__tests__/unit/stores/useConditionStore.test.ts
- [ ] T029 [P] [US1] Unit test for dailyStateService in CareNavi/__tests__/unit/services/dailyStateService.test.ts
- [ ] T030 [P] [US1] Unit test for conditionService.analyzeCondition in CareNavi/__tests__/unit/services/conditionService.test.ts
- [ ] T031 [P] [US1] Unit test for geminiService in CareNavi/__tests__/unit/services/geminiService.test.ts
- [ ] T032 [P] [US1] Component test for ChatBubble in CareNavi/__tests__/unit/components/ChatBubble.test.tsx
- [ ] T033 [P] [US1] Component test for ChatInput in CareNavi/__tests__/unit/components/ChatInput.test.tsx
- [ ] T034 [US1] Integration test for condition check flow in CareNavi/__tests__/integration/conditionCheck.test.ts

### Implementation for User Story 1

- [ ] T035 [P] [US1] Create Gemini AI service in CareNavi/src/services/geminiService.ts (initializeGemini, generateContent)
- [ ] T036 [P] [US1] Create dailyStateService in CareNavi/src/services/dailyStateService.ts (getTodayState, updateState)
- [ ] T037 [P] [US1] Create conditionService in CareNavi/src/services/conditionService.ts (analyzeCondition with AI prompt, getTodayCondition)
- [ ] T038 [P] [US1] Implement useDailyStore in CareNavi/src/stores/useDailyStore.ts (state: before_check/in_progress/daily_completed, fetchTodayState, transitionState)
- [ ] T039 [P] [US1] Implement useConditionStore in CareNavi/src/stores/useConditionStore.ts (conditionRecord, analyzeAndSave)
- [ ] T040 [P] [US1] Create ChatBubble component in CareNavi/src/components/chat/ChatBubble.tsx (character message, user message styles)
- [ ] T041 [P] [US1] Create ChatInput component in CareNavi/src/components/chat/ChatInput.tsx (text input, submit button)
- [ ] T042 [US1] Update HomeScreen in CareNavi/src/screens/HomeScreen.tsx with condition check UI (greeting, chat interface, state-based rendering)
- [ ] T043 [US1] Add error handling for AI analysis failure in conditionService (fallback to default values)
- [ ] T044 [US1] Add Zod validation for condition input in CareNavi/src/services/conditionService.ts

**Checkpoint**: User Story 1 완료 - 컨디션 체크 플로우가 독립적으로 작동하고 테스트 가능

---

## Phase 4: User Story 2 - AI Mission Generation (Priority: P1)

**Goal**: After condition is saved, AI generates 3 personalized missions (Easy, Normal, Challenge) based on condition data

**Independent Test**: 컨디션 데이터 입력 → 3개 미션 생성 확인 → 미션 난이도별 분류 확인

### Tests for User Story 2 (MANDATORY per Constitution) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation (TDD cycle)**

- [ ] T045 [P] [US2] Unit test for useMissionStore in CareNavi/__tests__/unit/stores/useMissionStore.test.ts
- [ ] T046 [P] [US2] Unit test for missionService.generateMissions in CareNavi/__tests__/unit/services/missionService.test.ts
- [ ] T047 [P] [US2] Component test for MissionCard in CareNavi/__tests__/unit/components/MissionCard.test.tsx
- [ ] T048 [P] [US2] Component test for MissionList in CareNavi/__tests__/unit/components/MissionList.test.tsx
- [ ] T049 [US2] Integration test for mission generation flow in CareNavi/__tests__/integration/missionGeneration.test.ts

### Implementation for User Story 2

- [ ] T050 [P] [US2] Create missionService in CareNavi/src/services/missionService.ts (generateMissions with AI prompt, getTodayMissions)
- [ ] T051 [P] [US2] Implement useMissionStore in CareNavi/src/stores/useMissionStore.ts (missions array, generateMissions, fetchTodayMissions)
- [ ] T052 [P] [US2] Create MissionCard component in CareNavi/src/components/mission/MissionCard.tsx (title, description, duration, difficulty badge, complete button)
- [ ] T053 [P] [US2] Create MissionList component in CareNavi/src/components/mission/MissionList.tsx (render 3 missions with proper ordering)
- [ ] T054 [US2] Update HomeScreen in CareNavi/src/screens/HomeScreen.tsx to show MissionList when state is 'in_progress'
- [ ] T055 [US2] Add AI prompt template for mission generation based on condition data in missionService
- [ ] T056 [US2] Add fallback missions when AI generation fails in missionService

**Checkpoint**: User Story 2 완료 - 미션 생성이 독립적으로 작동하고 테스트 가능

---

## Phase 5: User Story 3 - Mission Completion & Auto-Growth (Priority: P2)

**Goal**: User completes mission → Feeding animation plays automatically → XP increases → Level up event triggers at threshold

**Independent Test**: 미션 완료 버튼 → 밥 먹기 애니메이션 재생 → XP 증가 확인 → 레벨업 임계값 도달 시 이벤트 확인

### Tests for User Story 3 (MANDATORY per Constitution) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation (TDD cycle)**

- [ ] T057 [P] [US3] Unit test for useCharacterStore in CareNavi/__tests__/unit/stores/useCharacterStore.test.ts
- [ ] T058 [P] [US3] Unit test for characterService.addXp in CareNavi/__tests__/unit/services/characterService.test.ts
- [ ] T059 [P] [US3] Unit test for missionService.completeMission in CareNavi/__tests__/unit/services/missionService.test.ts
- [ ] T060 [P] [US3] Component test for CharacterView in CareNavi/__tests__/unit/components/CharacterView.test.tsx
- [ ] T061 [P] [US3] Component test for FeedingAnimation in CareNavi/__tests__/unit/components/FeedingAnimation.test.tsx
- [ ] T062 [US3] Integration test for mission completion flow in CareNavi/__tests__/integration/missionCompletion.test.ts

### Implementation for User Story 3

- [ ] T063 [P] [US3] Create characterService in CareNavi/src/services/characterService.ts (getCharacter, addXp with level/stage calculation)
- [ ] T064 [P] [US3] Add completeMission to missionService in CareNavi/src/services/missionService.ts (calls Supabase RPC)
- [ ] T065 [P] [US3] Implement useCharacterStore in CareNavi/src/stores/useCharacterStore.ts (character state, fetchCharacter, addXp, levelUp event)
- [ ] T066 [P] [US3] Create placeholder Lottie animation file in CareNavi/assets/animations/feeding.json
- [ ] T067 [P] [US3] Create CharacterView component in CareNavi/src/components/character/CharacterView.tsx (display character with stage-based appearance)
- [ ] T068 [P] [US3] Create FeedingAnimation component in CareNavi/src/components/character/FeedingAnimation.tsx (Lottie animation with onComplete callback)
- [ ] T069 [US3] Create LevelUpModal component in CareNavi/src/components/character/LevelUpModal.tsx (celebration animation, new level display)
- [ ] T070 [US3] Update MissionCard in CareNavi/src/components/mission/MissionCard.tsx with complete button handler that triggers feeding animation
- [ ] T071 [US3] Update HomeScreen in CareNavi/src/screens/HomeScreen.tsx to handle mission completion flow (show animation → update XP → check level up)
- [ ] T072 [US3] Update CharacterScreen in CareNavi/src/screens/CharacterScreen.tsx with CharacterView and XP/level display

**Checkpoint**: User Story 3 완료 - 미션 완료 및 육성 시스템이 독립적으로 작동하고 테스트 가능

---

## Phase 6: User Story 4 - Daily State Reset (Priority: P2)

**Goal**: At midnight, user's daily state resets to 'Before_Check' for a new daily cycle

**Independent Test**: 자정 이후 앱 진입 → 상태가 'Before_Check'로 리셋되었는지 확인

### Tests for User Story 4 (MANDATORY per Constitution) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation (TDD cycle)**

- [ ] T073 [P] [US4] Unit test for midnight reset logic in CareNavi/__tests__/unit/services/dailyStateService.test.ts
- [ ] T074 [P] [US4] Unit test for date comparison helpers in CareNavi/__tests__/unit/utils/helpers.test.ts
- [ ] T075 [US4] Integration test for daily reset flow in CareNavi/__tests__/integration/dailyReset.test.ts

### Implementation for User Story 4

- [ ] T076 [P] [US4] Add date comparison helpers to CareNavi/src/utils/helpers.ts (isNewDay, getLocalMidnight)
- [ ] T077 [US4] Update dailyStateService.getTodayState in CareNavi/src/services/dailyStateService.ts to handle midnight reset logic
- [ ] T078 [US4] Update useDailyStore in CareNavi/src/stores/useDailyStore.ts to check for date change on fetchTodayState
- [ ] T079 [US4] Add AppState listener in CareNavi/src/App.tsx to check for reset when app comes to foreground
- [ ] T080 [US4] Clear previous day's missions and condition when reset occurs

**Checkpoint**: User Story 4 완료 - 자정 리셋이 독립적으로 작동하고 테스트 가능

---

## Phase 7: User Story 5 - Store Tab & Product Browsing (Priority: P3)

**Goal**: User can browse products in Store tab with category filtering

**Independent Test**: 하단 탭 스토어 탭 → 상품 목록 표시 → 상세 페이지 이동 확인

### Tests for User Story 5 (MANDATORY per Constitution) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation (TDD cycle)**

- [ ] T081 [P] [US5] Unit test for productService in CareNavi/__tests__/unit/services/productService.test.ts
- [ ] T082 [P] [US5] Component test for ProductCard in CareNavi/__tests__/unit/components/ProductCard.test.tsx
- [ ] T083 [US5] Integration test for store browsing flow in CareNavi/__tests__/integration/storeBrowsing.test.ts

### Implementation for User Story 5

- [ ] T084 [P] [US5] Create productService in CareNavi/src/services/productService.ts (getProducts, getProductById)
- [ ] T085 [P] [US5] Create ProductCard component in CareNavi/src/components/store/ProductCard.tsx (image, name, price, category badge)
- [ ] T086 [P] [US5] Create ProductDetailScreen in CareNavi/src/screens/ProductDetailScreen.tsx (full product details)
- [ ] T087 [US5] Update StoreScreen in CareNavi/src/screens/StoreScreen.tsx with product list and category filter
- [ ] T088 [US5] Add Stack Navigator for Store tab to support ProductDetailScreen navigation
- [ ] T089 [US5] Insert sample products into Supabase products table per quickstart.md

**Checkpoint**: User Story 5 완료 - 스토어 탐색이 독립적으로 작동하고 테스트 가능

---

## Phase 8: User Story 6 - AI Product Recommendation (Priority: P3)

**Goal**: When AI detects fatigue/nutrition issues in condition, recommend relevant products after mission display

**Independent Test**: 특정 컨디션(피로, 영양결핍) 입력 → 미션 생성 후 상품 추천 카드 표시 확인

### Tests for User Story 6 (MANDATORY per Constitution) ⚠️

> **CONSTITUTION REQUIREMENT: Write these tests FIRST, ensure they FAIL before implementation (TDD cycle)**

- [ ] T090 [P] [US6] Unit test for productService.getRecommendations in CareNavi/__tests__/unit/services/productService.test.ts
- [ ] T091 [P] [US6] Component test for RecommendationCard in CareNavi/__tests__/unit/components/RecommendationCard.test.tsx
- [ ] T092 [US6] Integration test for product recommendation flow in CareNavi/__tests__/integration/productRecommendation.test.ts

### Implementation for User Story 6

- [ ] T093 [P] [US6] Add getRecommendations to productService in CareNavi/src/services/productService.ts (keyword matching with condition)
- [ ] T094 [P] [US6] Add recordClick to productService in CareNavi/src/services/productService.ts
- [ ] T095 [P] [US6] Create RecommendationCard component in CareNavi/src/components/store/RecommendationCard.tsx (product card with recommendation reason)
- [ ] T096 [US6] Update conditionService.analyzeCondition in CareNavi/src/services/conditionService.ts to return shouldRecommendProducts and productKeywords
- [ ] T097 [US6] Update HomeScreen in CareNavi/src/screens/HomeScreen.tsx to show RecommendationCard after missions when condition warrants recommendation
- [ ] T098 [US6] Add navigation from RecommendationCard to ProductDetailScreen

**Checkpoint**: User Story 6 완료 - AI 상품 추천이 독립적으로 작동하고 테스트 가능

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T099 [P] Add offline caching with AsyncStorage for condition, missions, character state
- [ ] T100 [P] Add network error handling and retry logic across all services
- [ ] T101 [P] Add loading states and skeleton UI components
- [ ] T102 [P] Add error boundary component in CareNavi/src/components/ErrorBoundary.tsx
- [ ] T103 [P] Optimize Lottie animations (cache, loop settings)
- [ ] T104 [P] Add splash screen with data prefetch
- [ ] T105 Performance optimization: lazy load Character and Store screens
- [ ] T106 Security: add input sanitization across all user inputs
- [ ] T107 [P] E2E test for complete daily flow in CareNavi/__tests__/e2e/dailyFlow.test.ts (Detox)
- [ ] T108 Run quickstart.md validation (verify all setup steps work)
- [ ] T109 Final code cleanup and remove unused imports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - 🎯 MVP
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Logically follows US1 (needs condition data) but can be tested independently with mock data
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Needs US2 missions but can be tested independently with mock missions
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Independent of other stories (Store is separate tab)
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Logically follows US1 (needs condition analysis) but can be tested independently

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD cycle)
- Services before stores (stores use services)
- Components in parallel (different files)
- Screen integration last (combines components and stores)
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:
- T003, T004, T005, T006, T007, T008 can all run in parallel (independent package installs)
- T012, T013 can run in parallel (different files)

**Phase 2 (Foundational)**:
- T014, T015, T016 tests can run in parallel
- T017, T018 can run in parallel (different services)
- T035-T041 services and components can run in parallel

**User Stories**:
- All test tasks marked [P] within a story can run in parallel
- All service tasks marked [P] within a story can run in parallel
- All component tasks marked [P] within a story can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for useDailyStore in CareNavi/__tests__/unit/stores/useDailyStore.test.ts"
Task: "Unit test for useConditionStore in CareNavi/__tests__/unit/stores/useConditionStore.test.ts"
Task: "Unit test for dailyStateService in CareNavi/__tests__/unit/services/dailyStateService.test.ts"
Task: "Unit test for conditionService.analyzeCondition in CareNavi/__tests__/unit/services/conditionService.test.ts"
Task: "Component test for ChatBubble in CareNavi/__tests__/unit/components/ChatBubble.test.tsx"
Task: "Component test for ChatInput in CareNavi/__tests__/unit/components/ChatInput.test.tsx"

# Launch all services for User Story 1 together:
Task: "Create Gemini AI service in CareNavi/src/services/geminiService.ts"
Task: "Create dailyStateService in CareNavi/src/services/dailyStateService.ts"
Task: "Create conditionService in CareNavi/src/services/conditionService.ts"

# Launch all components for User Story 1 together:
Task: "Create ChatBubble component in CareNavi/src/components/chat/ChatBubble.tsx"
Task: "Create ChatInput component in CareNavi/src/components/chat/ChatInput.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 - Daily Condition Check
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - user can check daily condition and see AI analysis

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: Condition Check!)
3. Add User Story 2 → Test independently → Deploy/Demo (Now with Missions!)
4. Add User Story 3 → Test independently → Deploy/Demo (Now with Gamification!)
5. Add User Story 4 → Test independently → Deploy/Demo (Daily Reset working!)
6. Add User Story 5 → Test independently → Deploy/Demo (Store browsing!)
7. Add User Story 6 → Test independently → Deploy/Demo (AI Recommendations!)
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 + User Story 2 (P1 - core flow)
   - Developer B: User Story 3 + User Story 4 (P2 - gamification + reset)
   - Developer C: User Story 5 + User Story 6 (P3 - commerce)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD Red-Green-Refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

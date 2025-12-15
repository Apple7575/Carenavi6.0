// CareNavi Type Definitions

// Enums
export type DailyStateValue = 'before_check' | 'in_progress' | 'daily_completed';
export type MissionType = 'easy' | 'normal' | 'challenge';
export type CharacterStage = 'egg' | 'chick' | 'chicken' | 'phoenix';
export type ProductCategory = 'supplements' | 'wellness' | 'food' | 'accessories';

// User
export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

// Character
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

// Daily State
export interface DailyState {
  id: string;
  user_id: string;
  date: string;
  state: DailyStateValue;
  reset_at: string | null;
  created_at: string;
  updated_at: string;
}

// Condition Record
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

// Condition Analysis (AI response)
export interface ConditionAnalysis {
  mood: string;
  physical: string;
  mainIssue: string;
  confidence: number;
  shouldRecommendProducts: boolean;
  productKeywords: string[];
}

// Mission
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

// Product
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

// Product Recommendation
export interface ProductRecommendation {
  id: string;
  user_id: string;
  condition_record_id: string;
  product_id: string;
  match_reason: string | null;
  is_clicked: boolean;
  clicked_at: string | null;
  created_at: string;
  product?: Product; // Joined data
}

// Service Response Types
export interface ServiceError {
  code: 'AUTH_REQUIRED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'AI_ERROR' | 'NETWORK_ERROR' | 'RATE_LIMITED';
  message: string;
  field?: string;
  resource?: string;
  fallback?: unknown;
  retryAfter?: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

// Auth Types
export interface SignUpRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

// Mission Completion Response
export interface CompleteMissionResponse {
  mission: Mission;
  xpGained: number;
  character: Character;
  leveledUp: boolean;
  newStage: CharacterStage | null;
  allMissionsCompleted: boolean;
}

// Add XP Response
export interface AddXpResponse {
  character: Character;
  leveledUp: boolean;
  newLevel: number;
  stageChanged: boolean;
  newStage: CharacterStage | null;
}

// Chat Message
export interface ChatMessage {
  id: string;
  type: 'character' | 'user' | 'system';
  content: string;
  timestamp: Date;
}

// Growth Profile
export interface GrowthProfile {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  stage: CharacterStage;
  current_level_xp: number;
  next_level_xp: number;
  created_at: string;
  updated_at: string;
}

// CareNavi Constants

import { CharacterStage, MissionType } from '../types';

// XP Rewards per mission type
export const XP_REWARDS: Record<MissionType, number> = {
  easy: 10,
  normal: 25,
  challenge: 50,
};

// Level thresholds
// Level 1→2: 100 XP, Level 2→3: 150 XP, Level N→N+1: 100 + (N-1) * 50 XP
export const BASE_XP_FOR_LEVEL = 100;
export const XP_INCREMENT_PER_LEVEL = 50;

// Stage evolution levels
export const STAGE_THRESHOLDS: Record<CharacterStage, number> = {
  egg: 1,       // Level 1-4
  chick: 5,     // Level 5-14
  chicken: 15,  // Level 15-29
  phoenix: 30,  // Level 30+
};

// Character default values
export const DEFAULT_CHARACTER_NAME = '헬띠';
export const DEFAULT_CHARACTER_STAGE: CharacterStage = 'egg';

// Mission estimated durations
export const MISSION_DURATIONS: Record<MissionType, string> = {
  easy: '1분',
  normal: '10-20분',
  challenge: '시간 가변',
};

// AI Configuration
export const GEMINI_MODEL = 'gemini-2.0-flash-lite';
export const AI_TIMEOUT_MS = 15000; // Increased for better reliability
export const AI_RETRY_COUNT = 2;

// Daily state reset time (local timezone)
export const RESET_HOUR = 0; // Midnight

// App configuration
export const APP_NAME = 'CareNavi';
export const CHARACTER_NAME = '헬띠';

// Validation limits
export const CONDITION_INPUT_MIN_LENGTH = 2;
export const CONDITION_INPUT_MAX_LENGTH = 500;

// Error messages
export const ERROR_MESSAGES = {
  AUTH_REQUIRED: '로그인이 필요합니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  AI_ERROR: 'AI 분석 중 오류가 발생했습니다.',
  VALIDATION_ERROR: '입력값을 확인해주세요.',
  NOT_FOUND: '데이터를 찾을 수 없습니다.',
};

// Character greetings
export const CHARACTER_GREETINGS = [
  '안녕! 오늘 기분이 어때?',
  '반가워! 오늘은 어떤 하루였어?',
  '안녕! 몸은 괜찮아?',
  '오늘 컨디션은 어때?',
];

// Default fallback analysis when AI fails
export const DEFAULT_CONDITION_ANALYSIS = {
  mood: '보통',
  physical: '보통',
  mainIssue: '일반',
  confidence: 0,
  shouldRecommendProducts: false,
  productKeywords: [],
};

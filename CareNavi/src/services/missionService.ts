// T050: Mission service
import { supabase } from './supabase';
import { Mission, MissionType, ConditionAnalysis } from '../types';
import { SurveyData } from '../types/survey';
import { getTodayDate } from '../utils/helpers';
import { XP_REWARDS, MISSION_DURATIONS } from '../utils/constants';
import { generateMissionsWithAI } from './geminiService';

interface GenerateMissionsRequest {
  userId: string;
  conditionRecordId: string;
  analysis: ConditionAnalysis;
  surveyData?: SurveyData | null;
}

interface GenerateMissionsResponse {
  missions: Mission[];
}

// T056: Fallback missions when AI generation fails
const FALLBACK_MISSIONS: Omit<Mission, 'id' | 'user_id' | 'condition_record_id' | 'date' | 'created_at'>[] = [
  {
    type: 'easy',
    title: '물 한 잔 마시기',
    description: '수분 보충은 건강의 기본이에요',
    estimated_duration: MISSION_DURATIONS.easy,
    xp_reward: XP_REWARDS.easy,
    is_completed: false,
    completed_at: null,
  },
  {
    type: 'normal',
    title: '10분 스트레칭',
    description: '몸을 부드럽게 풀어줘요',
    estimated_duration: MISSION_DURATIONS.normal,
    xp_reward: XP_REWARDS.normal,
    is_completed: false,
    completed_at: null,
  },
  {
    type: 'challenge',
    title: '5분 명상',
    description: '마음을 평온하게 가라앉혀요',
    estimated_duration: MISSION_DURATIONS.challenge,
    xp_reward: XP_REWARDS.challenge,
    is_completed: false,
    completed_at: null,
  },
];

/**
 * Generate personalized missions based on condition
 */
export async function generateMissions(
  request: GenerateMissionsRequest
): Promise<GenerateMissionsResponse> {
  const today = getTodayDate();

  // T055: Try AI generation first (with survey data for personalization)
  let generatedMissions: Partial<Mission>[];
  try {
    generatedMissions = await generateMissionsWithAI(request.analysis, request.surveyData);
  } catch (error) {
    console.warn('AI mission generation failed, using fallback:', error);
    generatedMissions = FALLBACK_MISSIONS;
  }

  // Insert missions to database
  const missionsToInsert = generatedMissions.map((m) => ({
    user_id: request.userId,
    condition_record_id: request.conditionRecordId,
    date: today,
    type: m.type,
    title: m.title,
    description: m.description,
    estimated_duration: m.estimated_duration,
    xp_reward: m.xp_reward || XP_REWARDS[m.type as MissionType],
    is_completed: false,
  }));

  const { data, error } = await supabase
    .from('missions')
    .insert(missionsToInsert)
    .select();

  if (error) throw error;

  return { missions: data as Mission[] };
}

/**
 * Get today's missions for user
 */
export async function getTodayMissions(userId: string): Promise<Mission[]> {
  const today = getTodayDate();

  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .order('type', { ascending: true }); // easy, normal, challenge order

  if (error) throw error;
  return (data || []) as Mission[];
}

/**
 * Complete a mission
 */
export async function completeMission(
  missionId: string,
  userId: string
): Promise<Mission> {
  const { data, error } = await supabase
    .from('missions')
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq('id', missionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Mission;
}

/**
 * Check if all today's missions are completed
 */
export async function areAllMissionsCompleted(userId: string): Promise<boolean> {
  const missions = await getTodayMissions(userId);
  return missions.length > 0 && missions.every((m) => m.is_completed);
}

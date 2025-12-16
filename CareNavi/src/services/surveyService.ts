// Survey Service - Save and load user surveys
import { supabase } from './supabase';
import { SurveyData, UserSurvey } from '../types/survey';

/**
 * Save user survey to database
 */
export async function saveSurvey(userId: string, data: SurveyData): Promise<UserSurvey | null> {
  try {
    const surveyRecord = {
      user_id: userId,
      health_concern: data.healthConcern,
      exercise_time: data.exerciseTime,
      sleep_hours: data.sleepHours,
      stress_level: data.stressLevel,
      health_goals: data.healthGoals,
      completed_at: new Date().toISOString(),
    };

    // Upsert - update if exists, insert if not
    const { data: result, error } = await supabase
      .from('user_surveys')
      .upsert(surveyRecord, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Failed to save survey:', error);
      return null;
    }

    return result as UserSurvey;
  } catch (error) {
    console.error('Survey save error:', error);
    return null;
  }
}

/**
 * Get user survey from database
 */
export async function getSurvey(userId: string): Promise<UserSurvey | null> {
  try {
    const { data, error } = await supabase
      .from('user_surveys')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // No survey found is not an error
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Failed to get survey:', error);
      return null;
    }

    return data as UserSurvey;
  } catch (error) {
    console.error('Survey get error:', error);
    return null;
  }
}

/**
 * Check if user has completed survey
 */
export async function hasSurveyCompleted(userId: string): Promise<boolean> {
  const survey = await getSurvey(userId);
  return survey !== null;
}

/**
 * Convert UserSurvey to SurveyData
 */
export function convertToSurveyData(survey: UserSurvey): SurveyData {
  return {
    healthConcern: survey.health_concern as SurveyData['healthConcern'],
    exerciseTime: survey.exercise_time as SurveyData['exerciseTime'],
    sleepHours: survey.sleep_hours as SurveyData['sleepHours'],
    stressLevel: survey.stress_level,
    healthGoals: survey.health_goals as SurveyData['healthGoals'],
  };
}

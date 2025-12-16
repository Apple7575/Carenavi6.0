// Survey Types

export type HealthConcern = 'weight' | 'stress' | 'sleep' | 'fitness' | 'skin';
export type ExerciseTime = 'none' | 'under30' | '30to60' | 'over60';
export type SleepHours = 'under5' | '5to6' | '6to8' | 'over8';
export type HealthGoal = 'regular_exercise' | 'healthy_diet' | 'enough_sleep' | 'stress_management' | 'weight_loss';

export interface SurveyData {
  healthConcern: HealthConcern;
  exerciseTime: ExerciseTime;
  sleepHours: SleepHours;
  stressLevel: number; // 1-5
  healthGoals: HealthGoal[];
}

export interface UserSurvey {
  id: string;
  user_id: string;
  health_concern: string;
  exercise_time: string;
  sleep_hours: string;
  stress_level: number;
  health_goals: string[];
  completed_at: string;
}

// Survey question options (Korean labels)
export const HEALTH_CONCERN_OPTIONS: { value: HealthConcern; label: string }[] = [
  { value: 'weight', label: '체중 관리' },
  { value: 'stress', label: '스트레스/멘탈' },
  { value: 'sleep', label: '수면 개선' },
  { value: 'fitness', label: '체력 증진' },
  { value: 'skin', label: '피부/외모' },
];

export const EXERCISE_TIME_OPTIONS: { value: ExerciseTime; label: string }[] = [
  { value: 'none', label: '거의 안함' },
  { value: 'under30', label: '30분 미만' },
  { value: '30to60', label: '30분~1시간' },
  { value: 'over60', label: '1시간 이상' },
];

export const SLEEP_HOURS_OPTIONS: { value: SleepHours; label: string }[] = [
  { value: 'under5', label: '5시간 미만' },
  { value: '5to6', label: '5~6시간' },
  { value: '6to8', label: '6~8시간' },
  { value: 'over8', label: '8시간 이상' },
];

export const HEALTH_GOAL_OPTIONS: { value: HealthGoal; label: string }[] = [
  { value: 'regular_exercise', label: '규칙적인 운동' },
  { value: 'healthy_diet', label: '건강한 식습관' },
  { value: 'enough_sleep', label: '충분한 수면' },
  { value: 'stress_management', label: '스트레스 관리' },
  { value: 'weight_loss', label: '체중 감량' },
];

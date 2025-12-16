// Survey Store - Zustand state management for surveys
import { create } from 'zustand';
import { SurveyData, UserSurvey } from '../types/survey';
import { saveSurvey, getSurvey, convertToSurveyData } from '../services/surveyService';

interface SurveyState {
  survey: UserSurvey | null;
  surveyData: SurveyData | null;
  isLoading: boolean;
  hasCompleted: boolean;

  // Actions
  fetchSurvey: (userId: string) => Promise<void>;
  submitSurvey: (userId: string, data: SurveyData) => Promise<boolean>;
  setSurvey: (survey: UserSurvey | null) => void;
  reset: () => void;
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  survey: null,
  surveyData: null,
  isLoading: false,
  hasCompleted: false,

  fetchSurvey: async (userId: string) => {
    set({ isLoading: true });
    try {
      const survey = await getSurvey(userId);
      if (survey) {
        set({
          survey,
          surveyData: convertToSurveyData(survey),
          hasCompleted: true,
          isLoading: false,
        });
      } else {
        set({
          survey: null,
          surveyData: null,
          hasCompleted: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch survey:', error);
      set({ isLoading: false });
    }
  },

  submitSurvey: async (userId: string, data: SurveyData) => {
    set({ isLoading: true });
    try {
      const result = await saveSurvey(userId, data);
      if (result) {
        set({
          survey: result,
          surveyData: data,
          hasCompleted: true,
          isLoading: false,
        });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Failed to submit survey:', error);
      set({ isLoading: false });
      return false;
    }
  },

  setSurvey: (survey: UserSurvey | null) => {
    if (survey) {
      set({
        survey,
        surveyData: convertToSurveyData(survey),
        hasCompleted: true,
      });
    } else {
      set({
        survey: null,
        surveyData: null,
        hasCompleted: false,
      });
    }
  },

  reset: () => {
    set({
      survey: null,
      surveyData: null,
      isLoading: false,
      hasCompleted: false,
    });
  },
}));

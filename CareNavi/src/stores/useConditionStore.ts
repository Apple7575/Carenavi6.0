// T039: Condition store using Zustand
import { create } from 'zustand';
import { ConditionRecord, ConditionAnalysis } from '../types';
import * as conditionService from '../services/conditionService';

interface ConditionStoreState {
  conditionRecord: ConditionRecord | null;
  analysis: ConditionAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;

  // Actions
  setConditionRecord: (record: ConditionRecord | null) => void;
  setAnalysis: (analysis: ConditionAnalysis | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setError: (error: string | null) => void;
  clearCondition: () => void;

  // Async actions
  analyzeAndSave: (userId: string, rawInput: string) => Promise<boolean>;
  fetchTodayCondition: (userId: string) => Promise<void>;
}

export const useConditionStore = create<ConditionStoreState>((set) => ({
  conditionRecord: null,
  analysis: null,
  isAnalyzing: false,
  error: null,

  setConditionRecord: (conditionRecord) => set({ conditionRecord }),
  setAnalysis: (analysis) => set({ analysis }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error }),

  clearCondition: () =>
    set({
      conditionRecord: null,
      analysis: null,
      error: null,
    }),

  analyzeAndSave: async (userId: string, rawInput: string): Promise<boolean> => {
    set({ isAnalyzing: true, error: null });
    try {
      const { record, analysis } = await conditionService.analyzeCondition({
        userId,
        rawInput,
      });
      set({
        conditionRecord: record,
        analysis,
        isAnalyzing: false,
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to analyze condition';
      set({ error: message, isAnalyzing: false });
      return false;
    }
  },

  fetchTodayCondition: async (userId: string) => {
    try {
      const record = await conditionService.getTodayCondition(userId);
      if (record) {
        set({
          conditionRecord: record,
          analysis: record.ai_analysis as ConditionAnalysis,
        });
      }
    } catch (error) {
      console.warn('Failed to fetch today condition:', error);
    }
  },
}));

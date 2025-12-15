// T028: Unit test for useConditionStore
import { renderHook, act } from '@testing-library/react-native';
import { useConditionStore } from '../../../src/stores/useConditionStore';

// Mock services
jest.mock('../../../src/services/conditionService', () => ({
  analyzeCondition: jest.fn(),
  getTodayCondition: jest.fn(),
}));

describe('useConditionStore', () => {
  beforeEach(() => {
    useConditionStore.setState({
      conditionRecord: null,
      analysis: null,
      isAnalyzing: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have null conditionRecord initially', () => {
      const { result } = renderHook(() => useConditionStore());
      expect(result.current.conditionRecord).toBeNull();
    });

    it('should have null analysis initially', () => {
      const { result } = renderHook(() => useConditionStore());
      expect(result.current.analysis).toBeNull();
    });

    it('should not be analyzing initially', () => {
      const { result } = renderHook(() => useConditionStore());
      expect(result.current.isAnalyzing).toBe(false);
    });
  });

  describe('setConditionRecord', () => {
    it('should update condition record', () => {
      const { result } = renderHook(() => useConditionStore());
      const mockRecord = {
        id: 'test-id',
        user_id: 'user-id',
        date: '2025-12-16',
        raw_input: '오늘 좀 피곤해',
        mood: '피로',
        physical: '어깨 통증',
        main_issue: '피로/근육긴장',
        ai_analysis: {},
        recorded_at: '2025-12-16T10:00:00Z',
      };

      act(() => {
        result.current.setConditionRecord(mockRecord);
      });

      expect(result.current.conditionRecord).toEqual(mockRecord);
    });
  });

  describe('setAnalysis', () => {
    it('should update analysis', () => {
      const { result } = renderHook(() => useConditionStore());
      const mockAnalysis = {
        mood: '피로',
        physical: '어깨 통증',
        mainIssue: '피로/근육긴장',
        confidence: 0.9,
        shouldRecommendProducts: true,
        productKeywords: ['영양제', '피로회복'],
      };

      act(() => {
        result.current.setAnalysis(mockAnalysis);
      });

      expect(result.current.analysis).toEqual(mockAnalysis);
    });
  });

  describe('setAnalyzing', () => {
    it('should update analyzing state', () => {
      const { result } = renderHook(() => useConditionStore());

      act(() => {
        result.current.setAnalyzing(true);
      });

      expect(result.current.isAnalyzing).toBe(true);
    });
  });

  describe('clearCondition', () => {
    it('should reset all condition state', () => {
      const { result } = renderHook(() => useConditionStore());

      // Set some state first
      act(() => {
        result.current.setConditionRecord({
          id: 'test-id',
          user_id: 'user-id',
          date: '2025-12-16',
          raw_input: 'test',
          mood: null,
          physical: null,
          main_issue: null,
          ai_analysis: {},
          recorded_at: '2025-12-16T10:00:00Z',
        });
        result.current.setAnalysis({
          mood: 'test',
          physical: 'test',
          mainIssue: 'test',
          confidence: 1,
          shouldRecommendProducts: false,
          productKeywords: [],
        });
      });

      // Clear
      act(() => {
        result.current.clearCondition();
      });

      expect(result.current.conditionRecord).toBeNull();
      expect(result.current.analysis).toBeNull();
    });
  });
});

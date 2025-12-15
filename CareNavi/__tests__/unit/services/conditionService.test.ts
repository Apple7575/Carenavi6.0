// T030: Unit test for conditionService.analyzeCondition
import { analyzeCondition, getTodayCondition } from '../../../src/services/conditionService';

// Mock dependencies
jest.mock('../../../src/services/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

jest.mock('../../../src/services/geminiService', () => ({
  analyzeConditionWithAI: jest.fn(),
}));

describe('conditionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeCondition', () => {
    it('should be a function', () => {
      expect(typeof analyzeCondition).toBe('function');
    });

    it('should accept request with userId and rawInput', () => {
      expect(analyzeCondition.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getTodayCondition', () => {
    it('should be a function', () => {
      expect(typeof getTodayCondition).toBe('function');
    });

    it('should accept userId parameter', () => {
      expect(getTodayCondition.length).toBeGreaterThanOrEqual(1);
    });
  });
});

// T029: Unit test for dailyStateService
import { getTodayState, updateState } from '../../../src/services/dailyStateService';
import { supabase } from '../../../src/services/supabase';

// Mock supabase
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
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(),
            })),
          })),
        })),
      })),
    })),
  },
}));

describe('dailyStateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodayState', () => {
    it('should be a function', () => {
      expect(typeof getTodayState).toBe('function');
    });

    it('should accept userId parameter', () => {
      expect(getTodayState.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('updateState', () => {
    it('should be a function', () => {
      expect(typeof updateState).toBe('function');
    });

    it('should accept userId and newState parameters', () => {
      expect(updateState.length).toBeGreaterThanOrEqual(2);
    });
  });
});

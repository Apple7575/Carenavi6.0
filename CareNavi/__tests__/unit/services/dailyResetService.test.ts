// T072: Unit test for dailyResetService
import {
  checkAndResetIfNewDay,
  shouldResetDaily,
} from '../../../src/services/dailyResetService';

jest.mock('../../../src/services/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
    })),
  },
}));

describe('dailyResetService', () => {
  describe('checkAndResetIfNewDay', () => {
    it('should be a function', () => {
      expect(typeof checkAndResetIfNewDay).toBe('function');
    });
  });

  describe('shouldResetDaily', () => {
    it('should return true if stored date is different from today', () => {
      const storedDate = '2024-01-01';
      const today = '2024-01-02';
      expect(shouldResetDaily(storedDate, today)).toBe(true);
    });

    it('should return false if stored date matches today', () => {
      const storedDate = '2024-01-15';
      const today = '2024-01-15';
      expect(shouldResetDaily(storedDate, today)).toBe(false);
    });

    it('should return true for empty stored date', () => {
      expect(shouldResetDaily('', '2024-01-15')).toBe(true);
    });

    it('should return true for null stored date', () => {
      expect(shouldResetDaily(null as unknown as string, '2024-01-15')).toBe(true);
    });
  });
});

// T015: Unit test for level/stage calculation helpers
import {
  calculateLevel,
  calculateStage,
  xpForLevel,
  getTodayDate,
  isNewDay,
} from '../../../src/utils/helpers';

describe('Helper Functions', () => {
  describe('xpForLevel', () => {
    it('should return 100 XP for level 1', () => {
      expect(xpForLevel(1)).toBe(100);
    });

    it('should return 150 XP for level 2', () => {
      expect(xpForLevel(2)).toBe(150);
    });

    it('should return 200 XP for level 3', () => {
      expect(xpForLevel(3)).toBe(200);
    });

    it('should follow formula: 100 + (level - 1) * 50', () => {
      expect(xpForLevel(10)).toBe(100 + 9 * 50); // 550
    });
  });

  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should return level 1 for 99 XP', () => {
      expect(calculateLevel(99)).toBe(1);
    });

    it('should return level 2 for 100 XP', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('should return level 2 for 249 XP (100 + 149)', () => {
      expect(calculateLevel(249)).toBe(2);
    });

    it('should return level 3 for 250 XP (100 + 150)', () => {
      expect(calculateLevel(250)).toBe(3);
    });

    it('should correctly calculate higher levels', () => {
      // Level 1: 0-99 (need 100)
      // Level 2: 100-249 (need 150)
      // Level 3: 250-449 (need 200)
      // Level 4: 450-699 (need 250)
      // Level 5: 700-999 (need 300)
      expect(calculateLevel(700)).toBe(5);
    });
  });

  describe('calculateStage', () => {
    it('should return egg for levels 1-4', () => {
      expect(calculateStage(1)).toBe('egg');
      expect(calculateStage(4)).toBe('egg');
    });

    it('should return baby for levels 5-14', () => {
      expect(calculateStage(5)).toBe('baby');
      expect(calculateStage(14)).toBe('baby');
    });

    it('should return child for levels 15-29', () => {
      expect(calculateStage(15)).toBe('child');
      expect(calculateStage(29)).toBe('child');
    });

    it('should return teen for levels 30-49', () => {
      expect(calculateStage(30)).toBe('teen');
      expect(calculateStage(49)).toBe('teen');
    });

    it('should return adult for level 50+', () => {
      expect(calculateStage(50)).toBe('adult');
      expect(calculateStage(100)).toBe('adult');
    });
  });

  describe('getTodayDate', () => {
    it('should return date string in YYYY-MM-DD format', () => {
      const result = getTodayDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isNewDay', () => {
    it('should return true when dates are different', () => {
      expect(isNewDay('2025-12-15', '2025-12-16')).toBe(true);
    });

    it('should return false when dates are same', () => {
      expect(isNewDay('2025-12-16', '2025-12-16')).toBe(false);
    });
  });
});

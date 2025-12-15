// T046: Unit test for missionService
import { generateMissions, getTodayMissions } from '../../../src/services/missionService';

jest.mock('../../../src/services/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(),
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(),
      })),
    })),
  },
}));

jest.mock('../../../src/services/geminiService', () => ({
  generateMissionsWithAI: jest.fn(),
}));

describe('missionService', () => {
  describe('generateMissions', () => {
    it('should be a function', () => {
      expect(typeof generateMissions).toBe('function');
    });
  });

  describe('getTodayMissions', () => {
    it('should be a function', () => {
      expect(typeof getTodayMissions).toBe('function');
    });
  });
});

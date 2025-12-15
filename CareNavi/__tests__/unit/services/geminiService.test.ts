// T031: Unit test for geminiService
import { initializeGemini, analyzeConditionWithAI, testGemini } from '../../../src/services/geminiService';

// Mock @google/generative-ai
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify({
            mood: '피로',
            physical: '어깨 통증',
            mainIssue: '피로/근육긴장',
            confidence: 0.9,
            shouldRecommendProducts: true,
            productKeywords: ['영양제'],
          })),
        },
      }),
    }),
  })),
}));

describe('geminiService', () => {
  describe('initializeGemini', () => {
    it('should be a function', () => {
      expect(typeof initializeGemini).toBe('function');
    });
  });

  describe('analyzeConditionWithAI', () => {
    it('should be a function', () => {
      expect(typeof analyzeConditionWithAI).toBe('function');
    });

    it('should accept rawInput parameter', () => {
      expect(analyzeConditionWithAI.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('testGemini', () => {
    it('should be a function', () => {
      expect(typeof testGemini).toBe('function');
    });
  });
});

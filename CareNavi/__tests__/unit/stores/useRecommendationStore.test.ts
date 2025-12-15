// T092: Unit test for useRecommendationStore
import { renderHook, act } from '@testing-library/react-native';
import { useRecommendationStore } from '../../../src/stores/useRecommendationStore';

jest.mock('../../../src/services/recommendationService', () => ({
  getRecommendationsForCondition: jest.fn(),
  trackRecommendationClick: jest.fn(),
}));

describe('useRecommendationStore', () => {
  beforeEach(() => {
    useRecommendationStore.setState({
      recommendations: [],
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have empty recommendations array initially', () => {
      const { result } = renderHook(() => useRecommendationStore());
      expect(result.current.recommendations).toEqual([]);
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useRecommendationStore());
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('setRecommendations', () => {
    it('should update recommendations array', () => {
      const { result } = renderHook(() => useRecommendationStore());
      const mockRecommendations = [
        { id: '1', product_id: 'p1', match_reason: 'test' },
      ];

      act(() => {
        result.current.setRecommendations(mockRecommendations as any);
      });

      expect(result.current.recommendations).toEqual(mockRecommendations);
    });
  });

  describe('clearRecommendations', () => {
    it('should clear recommendations', () => {
      const { result } = renderHook(() => useRecommendationStore());

      act(() => {
        result.current.setRecommendations([{ id: '1' }] as any);
      });

      act(() => {
        result.current.clearRecommendations();
      });

      expect(result.current.recommendations).toEqual([]);
    });
  });
});

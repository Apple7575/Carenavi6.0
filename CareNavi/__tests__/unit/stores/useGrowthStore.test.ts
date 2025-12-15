// T058: Unit test for useGrowthStore
import { renderHook, act } from '@testing-library/react-native';
import { useGrowthStore } from '../../../src/stores/useGrowthStore';

jest.mock('../../../src/services/growthService', () => ({
  updateGrowth: jest.fn(),
  getGrowthProfile: jest.fn(),
}));

describe('useGrowthStore', () => {
  beforeEach(() => {
    useGrowthStore.setState({
      totalXP: 0,
      level: 1,
      stage: 'egg',
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have 0 XP initially', () => {
      const { result } = renderHook(() => useGrowthStore());
      expect(result.current.totalXP).toBe(0);
    });

    it('should start at level 1', () => {
      const { result } = renderHook(() => useGrowthStore());
      expect(result.current.level).toBe(1);
    });

    it('should start at egg stage', () => {
      const { result } = renderHook(() => useGrowthStore());
      expect(result.current.stage).toBe('egg');
    });
  });

  describe('addXP', () => {
    it('should add XP to total', () => {
      const { result } = renderHook(() => useGrowthStore());

      act(() => {
        result.current.addXP(50);
      });

      expect(result.current.totalXP).toBe(50);
    });
  });

  describe('setLevel', () => {
    it('should update level', () => {
      const { result } = renderHook(() => useGrowthStore());

      act(() => {
        result.current.setLevel(5);
      });

      expect(result.current.level).toBe(5);
    });
  });

  describe('setStage', () => {
    it('should update stage', () => {
      const { result } = renderHook(() => useGrowthStore());

      act(() => {
        result.current.setStage('chick');
      });

      expect(result.current.stage).toBe('chick');
    });
  });
});

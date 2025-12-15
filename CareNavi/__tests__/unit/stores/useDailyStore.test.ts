// T027: Unit test for useDailyStore
import { renderHook, act } from '@testing-library/react-native';
import { useDailyStore } from '../../../src/stores/useDailyStore';

// Mock services
jest.mock('../../../src/services/dailyStateService', () => ({
  getTodayState: jest.fn(),
  updateState: jest.fn(),
}));

describe('useDailyStore', () => {
  beforeEach(() => {
    useDailyStore.setState({
      dailyState: null,
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have null dailyState initially', () => {
      const { result } = renderHook(() => useDailyStore());
      expect(result.current.dailyState).toBeNull();
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useDailyStore());
      expect(result.current.isLoading).toBe(false);
    });

    it('should have no error initially', () => {
      const { result } = renderHook(() => useDailyStore());
      expect(result.current.error).toBeNull();
    });
  });

  describe('setDailyState', () => {
    it('should update daily state', () => {
      const { result } = renderHook(() => useDailyStore());
      const mockState = {
        id: 'test-id',
        user_id: 'user-id',
        date: '2025-12-16',
        state: 'before_check' as const,
        reset_at: null,
        created_at: '2025-12-16T00:00:00Z',
        updated_at: '2025-12-16T00:00:00Z',
      };

      act(() => {
        result.current.setDailyState(mockState);
      });

      expect(result.current.dailyState).toEqual(mockState);
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useDailyStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('isBeforeCheck', () => {
    it('should return true when state is before_check', () => {
      const { result } = renderHook(() => useDailyStore());

      act(() => {
        result.current.setDailyState({
          id: 'test-id',
          user_id: 'user-id',
          date: '2025-12-16',
          state: 'before_check',
          reset_at: null,
          created_at: '2025-12-16T00:00:00Z',
          updated_at: '2025-12-16T00:00:00Z',
        });
      });

      expect(result.current.isBeforeCheck()).toBe(true);
    });

    it('should return false when state is in_progress', () => {
      const { result } = renderHook(() => useDailyStore());

      act(() => {
        result.current.setDailyState({
          id: 'test-id',
          user_id: 'user-id',
          date: '2025-12-16',
          state: 'in_progress',
          reset_at: null,
          created_at: '2025-12-16T00:00:00Z',
          updated_at: '2025-12-16T00:00:00Z',
        });
      });

      expect(result.current.isBeforeCheck()).toBe(false);
    });
  });
});

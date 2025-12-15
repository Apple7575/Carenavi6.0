// T045: Unit test for useMissionStore
import { renderHook, act } from '@testing-library/react-native';
import { useMissionStore } from '../../../src/stores/useMissionStore';

jest.mock('../../../src/services/missionService', () => ({
  generateMissions: jest.fn(),
  getTodayMissions: jest.fn(),
}));

describe('useMissionStore', () => {
  beforeEach(() => {
    useMissionStore.setState({
      missions: [],
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have empty missions array initially', () => {
      const { result } = renderHook(() => useMissionStore());
      expect(result.current.missions).toEqual([]);
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useMissionStore());
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('setMissions', () => {
    it('should update missions array', () => {
      const { result } = renderHook(() => useMissionStore());
      const mockMissions = [
        { id: '1', type: 'easy', title: 'Test Mission', xp_reward: 10 },
      ];

      act(() => {
        result.current.setMissions(mockMissions as any);
      });

      expect(result.current.missions).toEqual(mockMissions);
    });
  });

  describe('getMissionsByType', () => {
    it('should filter missions by type', () => {
      const { result } = renderHook(() => useMissionStore());
      const mockMissions = [
        { id: '1', type: 'easy', title: 'Easy' },
        { id: '2', type: 'normal', title: 'Normal' },
        { id: '3', type: 'challenge', title: 'Challenge' },
      ];

      act(() => {
        result.current.setMissions(mockMissions as any);
      });

      expect(result.current.getMissionByType('easy')?.title).toBe('Easy');
      expect(result.current.getMissionByType('normal')?.title).toBe('Normal');
      expect(result.current.getMissionByType('challenge')?.title).toBe('Challenge');
    });
  });
});

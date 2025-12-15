// T016: Unit test for useAuthStore
import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../../../src/stores/useAuthStore';

// Mock supabase
jest.mock('../../../src/services/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
  });

  describe('initial state', () => {
    it('should have null user initially', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.user).toBeNull();
    });

    it('should have null session initially', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.session).toBeNull();
    });

    it('should not be authenticated initially', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should update user state', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        display_name: 'Test User',
        avatar_url: null,
        timezone: 'Asia/Seoul',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('clearAuth', () => {
    it('should reset all auth state', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set some state first
      act(() => {
        result.current.setUser({
          id: 'test-id',
          email: 'test@example.com',
          display_name: null,
          avatar_url: null,
          timezone: 'Asia/Seoul',
          created_at: '2025-01-01',
          updated_at: '2025-01-01',
        });
      });

      // Clear auth
      act(() => {
        result.current.clearAuth();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});

// T078: Unit test for useProductStore
import { renderHook, act } from '@testing-library/react-native';
import { useProductStore } from '../../../src/stores/useProductStore';

jest.mock('../../../src/services/productService', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn(),
}));

describe('useProductStore', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [],
      selectedProduct: null,
      selectedCategory: null,
      searchQuery: '',
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have empty products array initially', () => {
      const { result } = renderHook(() => useProductStore());
      expect(result.current.products).toEqual([]);
    });

    it('should not have selected category initially', () => {
      const { result } = renderHook(() => useProductStore());
      expect(result.current.selectedCategory).toBeNull();
    });

    it('should have empty search query initially', () => {
      const { result } = renderHook(() => useProductStore());
      expect(result.current.searchQuery).toBe('');
    });
  });

  describe('setSelectedCategory', () => {
    it('should update selected category', () => {
      const { result } = renderHook(() => useProductStore());

      act(() => {
        result.current.setSelectedCategory('supplements');
      });

      expect(result.current.selectedCategory).toBe('supplements');
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      const { result } = renderHook(() => useProductStore());

      act(() => {
        result.current.setSearchQuery('vitamin');
      });

      expect(result.current.searchQuery).toBe('vitamin');
    });
  });
});

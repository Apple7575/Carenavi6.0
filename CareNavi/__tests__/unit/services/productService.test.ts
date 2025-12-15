// T077: Unit test for productService
import { getProducts, getProductById } from '../../../src/services/productService';

jest.mock('../../../src/services/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(),
        })),
        order: jest.fn(),
        contains: jest.fn(() => ({
          order: jest.fn(),
        })),
      })),
    })),
  },
}));

describe('productService', () => {
  describe('getProducts', () => {
    it('should be a function', () => {
      expect(typeof getProducts).toBe('function');
    });
  });

  describe('getProductById', () => {
    it('should be a function', () => {
      expect(typeof getProductById).toBe('function');
    });
  });
});

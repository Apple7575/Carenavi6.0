// T014: Unit test for Supabase client connection
import { supabase, testConnection } from '../../../src/services/supabase';

describe('Supabase Client', () => {
  describe('supabase client', () => {
    it('should be defined', () => {
      expect(supabase).toBeDefined();
    });

    it('should have auth property', () => {
      expect(supabase.auth).toBeDefined();
    });

    it('should have from method for database queries', () => {
      expect(typeof supabase.from).toBe('function');
    });
  });

  describe('testConnection', () => {
    it('should return boolean indicating connection status', async () => {
      const result = await testConnection();
      expect(typeof result).toBe('boolean');
    });
  });
});

// T020: Auth service for signup, signin, signout
import { supabase } from './supabase';
import { User, Character, SignUpRequest, SignInRequest } from '../types';
import { DEFAULT_CHARACTER_NAME, DEFAULT_CHARACTER_STAGE } from '../utils/constants';
import { getTodayDate } from '../utils/helpers';

interface SignUpResponse {
  user: User;
  character: Character;
}

interface SignInResponse {
  user: User;
}

/**
 * Sign up new user and create profile + character
 */
export async function signUp(request: SignUpRequest): Promise<SignUpResponse> {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: request.email,
    password: request.password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  const userId = authData.user.id;

  // 2. Create user profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: userId,
      email: request.email,
      display_name: request.displayName || null,
    })
    .select()
    .single();

  if (userError) throw userError;

  // 3. Create character
  const { data: characterData, error: characterError } = await supabase
    .from('characters')
    .insert({
      user_id: userId,
      name: DEFAULT_CHARACTER_NAME,
      xp: 0,
      level: 1,
      stage: DEFAULT_CHARACTER_STAGE,
    })
    .select()
    .single();

  if (characterError) throw characterError;

  // 4. Create initial daily state
  await supabase.from('daily_states').insert({
    user_id: userId,
    date: getTodayDate(),
    state: 'before_check',
  });

  return {
    user: userData as User,
    character: characterData as Character,
  };
}

/**
 * Sign in existing user
 */
export async function signIn(request: SignInRequest): Promise<SignInResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: request.email,
    password: request.password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Failed to sign in');

  // Fetch user profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (userError) throw userError;

  return {
    user: userData as User,
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getCurrentSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) return null;
  return data as User;
}

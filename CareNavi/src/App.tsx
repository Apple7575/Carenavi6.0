// T023: App entry point with NavigationContainer
// T074: Auto-check reset on app launch
// T075: Periodic reset check on app state change
import React, { useEffect, useCallback, useRef } from 'react';
import { StatusBar, AppState, AppStateStatus } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from './components/common/ErrorBoundary';
import { supabase } from './services/supabase';
import { useAuthStore } from './stores/useAuthStore';
import { useDailyStore } from './stores/useDailyStore';
import { useMissionStore } from './stores/useMissionStore';
import { checkAndResetIfNewDay } from './services/dailyResetService';

export default function App() {
  const { session, setSession, setLoading } = useAuthStore();
  const { dailyState, setDailyState } = useDailyStore();
  const { reset: resetMissions } = useMissionStore();
  const appState = useRef(AppState.currentState);

  // T074: Check daily reset on app launch
  const checkDailyReset = useCallback(async () => {
    if (!session?.user?.id) return;

    const lastKnownDate = dailyState?.date;
    const result = await checkAndResetIfNewDay(session.user.id, lastKnownDate);

    if (result.wasReset && result.state) {
      console.log('Daily state reset for new day');
      setDailyState(result.state);
      // Reset missions when day changes
      resetMissions();
    }
  }, [session?.user?.id, dailyState?.date, setDailyState, resetMissions]);

  // Auth setup
  useEffect(() => {
    // Check initial session
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setLoading]);

  // T074: Check reset on app launch when session is available
  useEffect(() => {
    if (session?.user?.id) {
      checkDailyReset();
    }
  }, [session?.user?.id, checkDailyReset]);

  // T075: Check reset when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to foreground, checking daily reset...');
        checkDailyReset();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [checkDailyReset]);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

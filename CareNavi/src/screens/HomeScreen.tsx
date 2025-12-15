// T042: Home Screen with condition check UI
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import MissionList from '../components/mission/MissionList';
import { useAuthStore } from '../stores/useAuthStore';
import { useDailyStore } from '../stores/useDailyStore';
import { useConditionStore } from '../stores/useConditionStore';
import { useMissionStore } from '../stores/useMissionStore';
import { ChatMessage } from '../types';
import { CHARACTER_GREETINGS } from '../utils/constants';
import { getRandomItem } from '../utils/helpers';

export default function HomeScreen() {
  const { session } = useAuthStore();
  const {
    dailyState,
    isLoading: dailyLoading,
    fetchTodayState,
    transitionToInProgress,
    isBeforeCheck,
    isInProgress,
    isCompleted,
  } = useDailyStore();
  const {
    isAnalyzing,
    analyzeAndSave,
  } = useConditionStore();

  const {
    missions,
    isLoading: missionsLoading,
    fetchTodayMissions,
    generateMissions,
    completeMission: completeMissionAction,
  } = useMissionStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetch daily state on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchTodayState(session.user.id);
    }
  }, [session?.user?.id, fetchTodayState]);

  // Fetch missions when in_progress
  useEffect(() => {
    if (session?.user?.id && isInProgress()) {
      fetchTodayMissions(session.user.id);
    }
  }, [session?.user?.id, dailyState, isInProgress, fetchTodayMissions]);

  // Add greeting message when in before_check state
  useEffect(() => {
    if (isBeforeCheck() && messages.length === 0) {
      const greeting = getRandomItem(CHARACTER_GREETINGS);
      addMessage('character', greeting);
    }
  }, [dailyState, isBeforeCheck, messages.length]);

  const addMessage = useCallback((type: ChatMessage['type'], content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleSubmitCondition = useCallback(
    async (text: string) => {
      if (!session?.user?.id) return;

      // Add user message
      addMessage('user', text);

      // Analyze condition
      const result = await analyzeAndSave(session.user.id, text);

      if (result.success && result.analysis && result.conditionRecordId) {
        // Add response based on analysis
        addMessage(
          'character',
          `알겠어! ${result.analysis.mainIssue || '오늘 컨디션'}에 맞는 미션을 준비할게!`
        );

        // Generate missions based on analysis
        await generateMissions(
          session.user.id,
          result.conditionRecordId,
          result.analysis
        );

        // Transition to in_progress
        await transitionToInProgress(session.user.id);
      } else {
        addMessage('character', '좀 더 자세히 알려줄래요?');
      }
    },
    [session?.user?.id, addMessage, analyzeAndSave, generateMissions, transitionToInProgress]
  );

  const handleCompleteMission = useCallback(
    async (missionId: string) => {
      if (!session?.user?.id) return;
      await completeMissionAction(missionId, session.user.id);
    },
    [session?.user?.id, completeMissionAction]
  );

  // Render based on daily state
  const renderContent = () => {
    if (dailyLoading) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      );
    }

    if (isCompleted()) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedTitle}>오늘의 미션 완료!</Text>
          <Text style={styles.completedSubtitle}>내일 또 만나요!</Text>
        </View>
      );
    }

    if (isInProgress()) {
      if (missionsLoading) {
        return (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>미션 로딩 중...</Text>
          </View>
        );
      }

      return (
        <MissionList
          missions={missions}
          onCompleteMission={handleCompleteMission}
        />
      );
    }

    // Before check - show chat interface
    return (
      <>
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
        >
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              type={message.type}
              content={message.content}
            />
          ))}
          {isAnalyzing && (
            <ChatBubble type="character" content="분석 중..." />
          )}
        </ScrollView>
        <ChatInput
          onSubmit={handleSubmitCondition}
          disabled={isAnalyzing}
          loading={isAnalyzing}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>오늘의 컨디션</Text>
          <Text style={styles.headerSubtitle}>
            {dailyState?.date || '날짜 로딩 중...'}
          </Text>
        </View>
        {renderContent()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  completedEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  inProgressEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  inProgressTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inProgressSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

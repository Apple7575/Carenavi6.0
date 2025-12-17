// T042: Home Screen - Combined character + missions view with AI chat
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CharacterAvatar from '../components/character/CharacterAvatar';
import { useAuthStore } from '../stores/useAuthStore';
import { useDailyStore } from '../stores/useDailyStore';
import { useMissionStore } from '../stores/useMissionStore';
import { useGrowthStore } from '../stores/useGrowthStore';
import { useSurveyStore } from '../stores/useSurveyStore';
import { Mission } from '../types';
import { CHARACTER_NAME, CHARACTER_GREETINGS } from '../utils/constants';
import { getRandomItem } from '../utils/helpers';
import { chatWithAI } from '../services/geminiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Mission item component for home screen (compact version)
function HomeMissionItem({
  mission,
  onComplete,
}: {
  mission: Mission;
  onComplete?: (id: string) => void;
}) {
  const isCompleted = mission.is_completed;

  const getTypeIcon = () => {
    switch (mission.type) {
      case 'easy':
        return '💬';
      case 'normal':
        return '🏃';
      case 'challenge':
        return '📸';
      default:
        return '📋';
    }
  };

  return (
    <TouchableOpacity
      style={styles.missionItem}
      onPress={() => !isCompleted && onComplete?.(mission.id)}
      disabled={isCompleted}
      activeOpacity={0.7}
    >
      <View style={styles.missionIconContainer}>
        <Text style={styles.missionIcon}>{getTypeIcon()}</Text>
      </View>
      <View style={styles.missionContent}>
        <View style={styles.missionTitleRow}>
          <Text style={[styles.missionTitle, isCompleted && styles.completedText]}>
            {mission.title}
          </Text>
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>+{mission.xp_reward}XP</Text>
          </View>
        </View>
        {mission.description && (
          <Text style={styles.missionSubtitle} numberOfLines={1}>
            {mission.description}
          </Text>
        )}
      </View>
      {isCompleted && (
        <View style={styles.completedCheck}>
          <Text style={styles.completedCheckText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// AI Chat Modal
function ChatModal({
  visible,
  onClose,
  surveyData,
}: {
  visible: boolean;
  onClose: () => void;
  surveyData: any;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Add initial greeting when modal opens
  useEffect(() => {
    if (visible && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `안녕! 나는 ${CHARACTER_NAME}야 🐕\n건강에 대해 궁금한 거 있으면 뭐든 물어봐!`,
        },
      ]);
    }
  }, [visible]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatWithAI(inputText.trim(), surveyData);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '미안, 지금 대답하기 어려워. 나중에 다시 물어봐줘! 🙏',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessages([]);
    setInputText('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.chatModalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.chatModalContent}>
          {/* Header */}
          <View style={styles.chatModalHeader}>
            <View style={styles.chatHeaderLeft}>
              <Text style={styles.chatHeaderEmoji}>🐕</Text>
              <Text style={styles.chatHeaderTitle}>{CHARACTER_NAME}와 대화</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.chatCloseButton}>
              <Text style={styles.chatCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatMessages}
            contentContainerStyle={styles.chatMessagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.chatBubble,
                  msg.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAssistant,
                ]}
              >
                <Text
                  style={[
                    styles.chatBubbleText,
                    msg.role === 'user' && styles.chatBubbleTextUser,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.chatBubble, styles.chatBubbleAssistant]}>
                <ActivityIndicator size="small" color="#4A90D9" />
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="건강에 대해 물어보세요..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.chatSendButton, !inputText.trim() && styles.chatSendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.chatSendButtonText}>전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Mission detail modal
function MissionDetailModal({
  visible,
  missions,
  onClose,
  onComplete,
}: {
  visible: boolean;
  missions: Mission[];
  onClose: () => void;
  onComplete?: (id: string) => void;
}) {
  const completedCount = missions.filter((m) => m.is_completed).length;
  const totalXP = missions.reduce((sum, m) => sum + m.xp_reward, 0);
  const earnedXP = missions
    .filter((m) => m.is_completed)
    .reduce((sum, m) => sum + m.xp_reward, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>오늘의 미션</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {completedCount}/{missions.length}
              </Text>
              <Text style={styles.statLabel}>완료</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {earnedXP}/{totalXP}
              </Text>
              <Text style={styles.statLabel}>XP 획득</Text>
            </View>
          </View>

          <ScrollView style={styles.modalMissionList}>
            {missions.map((mission) => (
              <TouchableOpacity
                key={mission.id}
                style={[
                  styles.modalMissionItem,
                  mission.is_completed && styles.modalMissionItemCompleted,
                ]}
                onPress={() => !mission.is_completed && onComplete?.(mission.id)}
                disabled={mission.is_completed}
              >
                <View style={styles.modalMissionLeft}>
                  <Text style={styles.modalMissionEmoji}>
                    {mission.type === 'easy'
                      ? '🌱'
                      : mission.type === 'normal'
                      ? '🌿'
                      : '🌳'}
                  </Text>
                  <View style={styles.modalMissionInfo}>
                    <Text
                      style={[
                        styles.modalMissionTitle,
                        mission.is_completed && styles.completedText,
                      ]}
                    >
                      {mission.title}
                    </Text>
                    <Text style={styles.modalMissionDesc} numberOfLines={2}>
                      {mission.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalMissionRight}>
                  <Text style={styles.modalMissionXP}>+{mission.xp_reward} XP</Text>
                  {mission.is_completed ? (
                    <Text style={styles.completedBadge}>✓ 완료</Text>
                  ) : (
                    <Text style={styles.pendingBadge}>탭하여 완료</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function HomeScreen() {
  const { session } = useAuthStore();
  const {
    dailyState,
    isLoading: dailyLoading,
    fetchTodayState,
    transitionToCompleted,
    isInProgress,
    isCompleted,
  } = useDailyStore();
  const {
    missions,
    isLoading: missionsLoading,
    fetchTodayMissions,
    completeMission: completeMissionAction,
    areAllCompleted,
  } = useMissionStore();
  const {
    level,
    stage,
    totalXP,
    fetchProfile,
    addXPAndSync,
  } = useGrowthStore();
  const { surveyData } = useSurveyStore();

  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchTodayState(session.user.id);
      fetchProfile(session.user.id);
    }
  }, [session?.user?.id, fetchTodayState, fetchProfile]);

  // Fetch missions when in_progress
  useEffect(() => {
    if (session?.user?.id && isInProgress()) {
      fetchTodayMissions(session.user.id);
    }
  }, [session?.user?.id, dailyState, isInProgress, fetchTodayMissions]);

  // Set greeting
  useEffect(() => {
    const greet = getRandomItem(CHARACTER_GREETINGS);
    setGreeting(greet);
  }, []);

  const handleCompleteMission = useCallback(
    async (missionId: string) => {
      if (!session?.user?.id) return;

      const mission = missions.find((m) => m.id === missionId);
      if (!mission) return;

      const completedMission = await completeMissionAction(missionId, session.user.id);
      if (!completedMission) return;

      await addXPAndSync(session.user.id, completedMission.xp_reward);

      setTimeout(async () => {
        if (areAllCompleted()) {
          setShowCelebration(true);
          setTimeout(async () => {
            await transitionToCompleted(session.user.id);
            setShowCelebration(false);
          }, 2000);
        }
      }, 100);
    },
    [
      session?.user?.id,
      missions,
      completeMissionAction,
      addXPAndSync,
      areAllCompleted,
      transitionToCompleted,
    ]
  );

  // Format today's date
  const formatDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${month}월 ${String(day).padStart(2, '0')}일`;
  };

  const displayMissions = missions.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Stats Bar */}
        <View style={styles.topBar}>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeIcon}>🥚</Text>
            <Text style={styles.statBadgeText}>{totalXP}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeIcon}>⭐</Text>
            <Text style={styles.statBadgeText}>Lv.{level}</Text>
          </View>
        </View>

        {/* Character Section */}
        <View style={styles.characterSection}>
          {/* Speech Bubble - Tappable for chat */}
          <TouchableOpacity
            style={styles.speechBubble}
            onPress={() => setShowChatModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.speechText}>{greeting}</Text>
            <Text style={styles.speechHint}>탭하여 대화하기 💬</Text>
            <View style={styles.speechTail} />
          </TouchableOpacity>

          {/* Character Avatar */}
          <View style={styles.avatarContainer}>
            <CharacterAvatar stage={stage} size={160} />
          </View>

          {/* Character Name */}
          <Text style={styles.characterName}>{CHARACTER_NAME}</Text>
        </View>

        {/* Mission Section */}
        <View style={styles.missionSection}>
          <View style={styles.missionHeader}>
            <Text style={styles.dateText}>{formatDate()}</Text>
            <TouchableOpacity onPress={() => setShowMissionModal(true)}>
              <Text style={styles.viewAllText}>전체 보기</Text>
            </TouchableOpacity>
          </View>

          {dailyLoading || missionsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>로딩 중...</Text>
            </View>
          ) : missions.length === 0 ? (
            <View style={styles.emptyMissions}>
              <Text style={styles.emptyEmoji}>🎯</Text>
              <Text style={styles.emptyText}>아직 미션이 없어요</Text>
              <Text style={styles.emptySubtext}>컨디션을 입력하면 맞춤 미션을 드릴게요!</Text>
            </View>
          ) : (
            <>
              {displayMissions.map((mission) => (
                <HomeMissionItem
                  key={mission.id}
                  mission={mission}
                  onComplete={handleCompleteMission}
                />
              ))}

              {isCompleted() && (
                <View style={styles.allCompletedBanner}>
                  <Text style={styles.allCompletedEmoji}>🎉</Text>
                  <Text style={styles.allCompletedText}>오늘의 미션 완료!</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* AI Chat Modal */}
      <ChatModal
        visible={showChatModal}
        onClose={() => setShowChatModal(false)}
        surveyData={surveyData}
      />

      {/* Mission Detail Modal */}
      <MissionDetailModal
        visible={showMissionModal}
        missions={missions}
        onClose={() => setShowMissionModal(false)}
        onComplete={handleCompleteMission}
      />

      {/* Celebration Overlay */}
      {showCelebration && (
        <View style={styles.celebrationOverlay}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>모든 미션 완료!</Text>
          <Text style={styles.celebrationSubtitle}>오늘도 건강한 하루였어요!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBadgeIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  statBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  characterSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  speechBubble: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    alignItems: 'center',
  },
  speechText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  speechHint: {
    fontSize: 12,
    color: '#4A90D9',
    marginTop: 4,
  },
  speechTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFF',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  missionSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4A90D9',
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  missionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  missionIcon: {
    fontSize: 22,
  },
  missionContent: {
    flex: 1,
  },
  missionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  xpBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  missionSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  completedCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  completedCheckText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyMissions: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  allCompletedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  allCompletedEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  allCompletedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  // Chat Modal styles
  chatModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatModalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
  },
  chatModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatCloseButton: {
    padding: 4,
  },
  chatCloseText: {
    fontSize: 24,
    color: '#999',
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90D9',
  },
  chatBubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  chatBubbleText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  chatBubbleTextUser: {
    color: '#FFF',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  chatSendButton: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chatSendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  chatSendButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  // Mission Detail Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#999',
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalMissionList: {
    paddingHorizontal: 20,
  },
  modalMissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalMissionItemCompleted: {
    opacity: 0.6,
  },
  modalMissionLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  modalMissionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  modalMissionInfo: {
    flex: 1,
  },
  modalMissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modalMissionDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  modalMissionRight: {
    alignItems: 'flex-end',
  },
  modalMissionXP: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  completedBadge: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  pendingBadge: {
    fontSize: 12,
    color: '#4A90D9',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 18,
    color: '#E0E0E0',
  },
});

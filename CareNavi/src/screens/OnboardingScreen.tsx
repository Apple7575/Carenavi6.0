// Onboarding Screen - Health Survey (5 questions)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  SurveyData,
  HealthConcern,
  ExerciseTime,
  SleepHours,
  HealthGoal,
  HEALTH_CONCERN_OPTIONS,
  EXERCISE_TIME_OPTIONS,
  SLEEP_HOURS_OPTIONS,
  HEALTH_GOAL_OPTIONS,
} from '../types/survey';
import { useSurveyStore } from '../stores/useSurveyStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useMissionStore } from '../stores/useMissionStore';
import { useDailyStore } from '../stores/useDailyStore';
import { generateInitialMissions } from '../services/missionService';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type Question = 1 | 2 | 3 | 4 | 5;

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { session } = useAuthStore();
  const { submitSurvey, isLoading } = useSurveyStore();
  const { setMissions } = useMissionStore();
  const { transitionToInProgress } = useDailyStore();

  const [currentQuestion, setCurrentQuestion] = useState<Question>(1);
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({
    stressLevel: 3,
    healthGoals: [],
  });

  const handleSelectConcern = (value: HealthConcern) => {
    setSurveyData(prev => ({ ...prev, healthConcern: value }));
    setCurrentQuestion(2);
  };

  const handleSelectExercise = (value: ExerciseTime) => {
    setSurveyData(prev => ({ ...prev, exerciseTime: value }));
    setCurrentQuestion(3);
  };

  const handleSelectSleep = (value: SleepHours) => {
    setSurveyData(prev => ({ ...prev, sleepHours: value }));
    setCurrentQuestion(4);
  };

  const handleSelectStress = (value: number) => {
    setSurveyData(prev => ({ ...prev, stressLevel: value }));
    setCurrentQuestion(5);
  };

  const handleToggleGoal = (value: HealthGoal) => {
    setSurveyData(prev => {
      const goals = prev.healthGoals || [];
      if (goals.includes(value)) {
        return { ...prev, healthGoals: goals.filter(g => g !== value) };
      }
      return { ...prev, healthGoals: [...goals, value] };
    });
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) return;

    const data: SurveyData = {
      healthConcern: surveyData.healthConcern!,
      exerciseTime: surveyData.exerciseTime!,
      sleepHours: surveyData.sleepHours!,
      stressLevel: surveyData.stressLevel || 3,
      healthGoals: surveyData.healthGoals || [],
    };

    const success = await submitSurvey(session.user.id, data);
    if (success) {
      try {
        // Generate initial missions based on survey
        const missions = await generateInitialMissions(session.user.id, data);
        setMissions(missions);

        // Transition daily state to in_progress
        await transitionToInProgress(session.user.id);
      } catch (error) {
        console.error('Failed to generate initial missions:', error);
      }
      onComplete();
    }
  };

  const canSubmit = () => {
    return (
      surveyData.healthConcern &&
      surveyData.exerciseTime &&
      surveyData.sleepHours &&
      surveyData.stressLevel &&
      (surveyData.healthGoals?.length || 0) > 0
    );
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4, 5].map((q) => (
        <View
          key={q}
          style={[
            styles.progressDot,
            currentQuestion >= q && styles.progressDotActive,
          ]}
        />
      ))}
    </View>
  );

  const renderQuestion1 = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionNumber}>Q1</Text>
      <Text style={styles.questionTitle}>현재 주요 건강 고민은?</Text>
      <View style={styles.optionsContainer}>
        {HEALTH_CONCERN_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              surveyData.healthConcern === option.value && styles.optionButtonSelected,
            ]}
            onPress={() => handleSelectConcern(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                surveyData.healthConcern === option.value && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderQuestion2 = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionNumber}>Q2</Text>
      <Text style={styles.questionTitle}>하루 평균 운동 시간은?</Text>
      <View style={styles.optionsContainer}>
        {EXERCISE_TIME_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              surveyData.exerciseTime === option.value && styles.optionButtonSelected,
            ]}
            onPress={() => handleSelectExercise(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                surveyData.exerciseTime === option.value && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderQuestion3 = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionNumber}>Q3</Text>
      <Text style={styles.questionTitle}>하루 평균 수면 시간은?</Text>
      <View style={styles.optionsContainer}>
        {SLEEP_HOURS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              surveyData.sleepHours === option.value && styles.optionButtonSelected,
            ]}
            onPress={() => handleSelectSleep(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                surveyData.sleepHours === option.value && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderQuestion4 = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionNumber}>Q4</Text>
      <Text style={styles.questionTitle}>평소 스트레스 수준은?</Text>
      <View style={styles.stressContainer}>
        <Text style={styles.stressLabel}>낮음</Text>
        <View style={styles.stressButtons}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.stressButton,
                surveyData.stressLevel === level && styles.stressButtonSelected,
              ]}
              onPress={() => handleSelectStress(level)}
            >
              <Text
                style={[
                  styles.stressButtonText,
                  surveyData.stressLevel === level && styles.stressButtonTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.stressLabel}>높음</Text>
      </View>
    </View>
  );

  const renderQuestion5 = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionNumber}>Q5</Text>
      <Text style={styles.questionTitle}>건강 목표는? (복수 선택)</Text>
      <View style={styles.optionsContainer}>
        {HEALTH_GOAL_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              surveyData.healthGoals?.includes(option.value) && styles.optionButtonSelected,
            ]}
            onPress={() => handleToggleGoal(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                surveyData.healthGoals?.includes(option.value) && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {currentQuestion === 5 && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            !canSubmit() && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>시작하기</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCurrentQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return renderQuestion1();
      case 2:
        return renderQuestion2();
      case 3:
        return renderQuestion3();
      case 4:
        return renderQuestion4();
      case 5:
        return renderQuestion5();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🐣</Text>
          <Text style={styles.headerTitle}>헬띠와 함께 시작해요!</Text>
          <Text style={styles.headerSubtitle}>
            맞춤형 건강 미션을 위해 몇 가지 질문에 답해주세요
          </Text>
        </View>

        {renderProgress()}
        {renderCurrentQuestion()}

        {currentQuestion > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentQuestion((prev) => (prev - 1) as Question)}
          >
            <Text style={styles.backButtonText}>이전</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DDD',
  },
  progressDotActive: {
    backgroundColor: '#4A90D9',
  },
  questionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90D9',
    marginBottom: 8,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  optionButtonSelected: {
    borderColor: '#4A90D9',
    backgroundColor: '#E8F1FB',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#4A90D9',
    fontWeight: 'bold',
  },
  stressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stressLabel: {
    fontSize: 12,
    color: '#666',
  },
  stressButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  stressButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stressButtonSelected: {
    borderColor: '#4A90D9',
    backgroundColor: '#4A90D9',
  },
  stressButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stressButtonTextSelected: {
    color: '#FFF',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#4A90D9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  backButton: {
    alignSelf: 'center',
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90D9',
  },
});

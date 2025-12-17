// Record Screen - Weekly Health Report
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CharacterAvatar from '../components/character/CharacterAvatar';
import { useGrowthStore } from '../stores/useGrowthStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data for weekly report (will be replaced with real data later)
const MOCK_WEEKLY_DATA = {
  totalScore: 92,
  medication: {
    completed: 3,
    total: 3,
    status: '잘했어요!',
  },
  sleep: {
    hours: 7.5,
    status: '좋음',
    weeklyData: [6, 7, 5.5, 7.5, 8, 7, 7.5], // Mon-Sun
  },
  steps: {
    count: 8500,
    status: '목표 달성',
  },
  diet: {
    status: '균형 잡힘',
    rating: '양호',
  },
  weeklyMedication: {
    // true = completed, false = missed
    data: [
      [true, true], // Mon
      [true, true], // Tue
      [true, true], // Wed
      [true, true], // Thu
      [true, false], // Fri
      [true, true], // Sat
      [true, true], // Sun
    ],
    compliance: 95,
  },
  weeklySteps: 58000,
  weeklyActivityMinutes: 320,
  healthTip: '물을 더 자주 마셔요!',
};

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export default function RecordScreen() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { stage } = useGrowthStore();
  const data = MOCK_WEEKLY_DATA;

  // Get current week date range
  const getWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const format = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
    return `${format(monday)} - ${format(sunday)}`;
  };

  // Render circular progress
  const renderCircularProgress = (score: number) => {
    const progress = score / 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <View style={styles.circularProgressContainer}>
        <View style={styles.circularProgress}>
          <View style={styles.circularBg} />
          <View style={styles.circularFill}>
            <Text style={styles.scoreText}>{score}점</Text>
          </View>
        </View>
        <Text style={styles.scoreLabel}>종합 점수</Text>
      </View>
    );
  };

  // Render mini bar chart for sleep
  const renderMiniBarChart = () => {
    const maxHours = Math.max(...data.sleep.weeklyData);
    return (
      <View style={styles.miniBarChart}>
        {data.sleep.weeklyData.map((hours, index) => (
          <View
            key={index}
            style={[
              styles.miniBar,
              { height: (hours / maxHours) * 24, backgroundColor: getBarColor(index) },
            ]}
          />
        ))}
      </View>
    );
  };

  const getBarColor = (index: number) => {
    const colors = ['#FFB74D', '#81C784', '#64B5F6', '#BA68C8', '#4DB6AC', '#FF8A65', '#A1887F'];
    return colors[index % colors.length];
  };

  // Summary card component
  const SummaryCard = ({
    icon,
    title,
    value,
    status,
    statusColor = '#4CAF50',
    extra,
  }: {
    icon: string;
    title: string;
    value: string;
    status: string;
    statusColor?: string;
    extra?: React.ReactNode;
  }) => (
    <View style={styles.summaryCard}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>
          {value} - <Text style={[styles.cardStatus, { color: statusColor }]}>{status}</Text>
        </Text>
      </View>
      {extra}
    </View>
  );

  // Detail Report Modal
  const DetailReportModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDetailModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <CharacterAvatar stage={stage} size={56} />
              <View style={styles.modalHeaderTextContainer}>
                <Text style={styles.modalTitle}>주간 전체 리포트</Text>
                <Text style={styles.modalSubtitle}>{getWeekRange()}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDetailModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Medication Compliance */}
          <View style={styles.detailSection}>
            <View style={styles.detailSectionHeader}>
              <Text style={styles.detailSectionTitle}>주간 약 복용 순응도</Text>
              <Text style={styles.complianceText}>
                이번 주 순응도 <Text style={styles.complianceValue}>{data.weeklyMedication.compliance}%</Text>
              </Text>
            </View>
            <View style={styles.medicationTable}>
              {/* Header row */}
              <View style={styles.medicationRow}>
                {DAYS.map((day) => (
                  <View key={day} style={styles.medicationCell}>
                    <Text style={styles.dayLabel}>{day}</Text>
                  </View>
                ))}
              </View>
              {/* Data rows */}
              {[0, 1].map((row) => (
                <View key={row} style={styles.medicationRow}>
                  {data.weeklyMedication.data.map((dayData, dayIndex) => (
                    <View key={dayIndex} style={styles.medicationCell}>
                      <View
                        style={[
                          styles.checkCircle,
                          dayData[row]
                            ? styles.checkCircleCompleted
                            : styles.checkCircleMissed,
                        ]}
                      >
                        <Text style={styles.checkMark}>
                          {dayData[row] ? '✓' : ''}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <Text style={styles.complianceSummary}>
              이번 주 순응도 {data.weeklyMedication.compliance}%
            </Text>
          </View>

          {/* Weekly Sleep Graph */}
          <View style={styles.detailSection}>
            <View style={styles.detailSectionHeader}>
              <Text style={styles.detailSectionTitle}>주간 수면량 그래프</Text>
              <Text style={styles.averageText}>평균 {data.sleep.hours}시간</Text>
            </View>
            <View style={styles.sleepChart}>
              <View style={styles.yAxis}>
                <Text style={styles.yAxisLabel}>10</Text>
                <Text style={styles.yAxisLabel}>7.5</Text>
                <Text style={styles.yAxisLabel}>5</Text>
                <Text style={styles.yAxisLabel}>2.5</Text>
              </View>
              <View style={styles.chartBars}>
                {data.sleep.weeklyData.map((hours, index) => (
                  <View key={index} style={styles.barContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        { height: (hours / 10) * 120 },
                      ]}
                    />
                    <Text style={styles.barLabel}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Weekly Activity Summary */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>주간 활동량 요약</Text>
            <View style={styles.activitySummary}>
              <View style={styles.activityCard}>
                <Text style={styles.activityIcon}>👣</Text>
                <Text style={styles.activityLabel}>총 단계</Text>
                <Text style={styles.activityValue}>{data.weeklySteps.toLocaleString()}보</Text>
              </View>
              <View style={styles.activityCard}>
                <Text style={styles.activityIcon}>⏱️</Text>
                <Text style={styles.activityLabel}>활동분분</Text>
                <Text style={styles.activityValue}>{data.weeklyActivityMinutes}분</Text>
              </View>
            </View>
          </View>

          {/* Health Tip */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>맞춤 건강 조언</Text>
            <View style={styles.healthTipCard}>
              <CharacterAvatar stage={stage} size={56} />
              <View style={styles.tipBubble}>
                <Text style={styles.tipText}>{data.healthTip}</Text>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <CharacterAvatar stage={stage} size={64} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>주간 건강 리포트</Text>
            <Text style={styles.headerSubtitle}>이번 주 훌륭해요!</Text>
          </View>
        </View>

        {/* Total Score Card */}
        <View style={styles.scoreCard}>
          {renderCircularProgress(data.totalScore)}
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <SummaryCard
            icon="💊"
            title="약 복용"
            value={`오늘 ${data.medication.completed}/${data.medication.total} 복용 완료`}
            status={data.medication.status}
          />
          <SummaryCard
            icon="🌙"
            title="수면"
            value={`${data.sleep.hours}시간`}
            status={data.sleep.status}
            extra={renderMiniBarChart()}
          />
          <SummaryCard
            icon="👟"
            title="걸음"
            value={`${data.steps.count.toLocaleString()}보`}
            status={data.steps.status}
          />
          <SummaryCard
            icon="🥕"
            title="식단"
            value={data.diet.status}
            status={data.diet.rating}
          />
        </View>

        {/* View Full Report Button */}
        <TouchableOpacity
          style={styles.fullReportButton}
          onPress={() => setShowDetailModal(true)}
        >
          <Text style={styles.fullReportButtonText}>전체 리포트 보기</Text>
        </TouchableOpacity>
      </ScrollView>

      <DetailReportModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E9',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#7EBDC3',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: '#B8E0E5',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  circularProgressContainer: {
    alignItems: 'center',
  },
  circularProgress: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularBg: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#E0E0E0',
  },
  circularFill: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#7EBDC3',
    borderLeftColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    transform: [{ rotate: '-45deg' }],
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  summarySection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: '#666',
  },
  cardStatus: {
    fontWeight: '600',
  },
  miniBarChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    gap: 3,
  },
  miniBar: {
    width: 6,
    borderRadius: 3,
  },
  fullReportButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fullReportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FDF6E9',
  },
  modalScroll: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#7EBDC3',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderTextContainer: {
    marginLeft: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  detailSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  complianceText: {
    fontSize: 12,
    color: '#666',
  },
  complianceValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  medicationTable: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  medicationRow: {
    flexDirection: 'row',
  },
  medicationCell: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#7EBDC3',
  },
  checkCircleMissed: {
    backgroundColor: '#E0E0E0',
  },
  checkMark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  complianceSummary: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  averageText: {
    fontSize: 12,
    color: '#666',
  },
  sleepChart: {
    flexDirection: 'row',
    height: 160,
  },
  yAxis: {
    width: 30,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
  },
  chartBar: {
    width: 28,
    backgroundColor: '#7EBDC3',
    borderRadius: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
  },
  activitySummary: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  activityLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  activityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  healthTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  tipBubble: {
    marginLeft: 12,
    flex: 1,
    backgroundColor: '#7EBDC3',
    borderRadius: 16,
    padding: 16,
  },
  tipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  modalFooter: {
    height: 40,
  },
});

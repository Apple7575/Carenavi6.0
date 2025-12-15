// T047: Component test for MissionCard
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MissionCard from '../../../src/components/mission/MissionCard';

describe('MissionCard', () => {
  const mockMission = {
    id: '1',
    user_id: 'user-1',
    condition_record_id: null,
    date: '2025-12-16',
    type: 'easy' as const,
    title: '물 한 잔 마시기',
    description: '수분 보충으로 건강을 챙겨요',
    estimated_duration: '1분',
    xp_reward: 10,
    is_completed: false,
    completed_at: null,
    created_at: '2025-12-16T00:00:00Z',
  };

  it('should render mission title', () => {
    const { getByText } = render(
      <MissionCard mission={mockMission} onComplete={() => {}} />
    );
    expect(getByText('물 한 잔 마시기')).toBeTruthy();
  });

  it('should render mission description', () => {
    const { getByText } = render(
      <MissionCard mission={mockMission} onComplete={() => {}} />
    );
    expect(getByText('수분 보충으로 건강을 챙겨요')).toBeTruthy();
  });

  it('should render XP reward', () => {
    const { getByText } = render(
      <MissionCard mission={mockMission} onComplete={() => {}} />
    );
    expect(getByText('+10 XP')).toBeTruthy();
  });

  it('should render difficulty badge', () => {
    const { getByText } = render(
      <MissionCard mission={mockMission} onComplete={() => {}} />
    );
    expect(getByText('쉬움')).toBeTruthy();
  });

  it('should call onComplete when complete button pressed', () => {
    const mockOnComplete = jest.fn();
    const { getByTestId } = render(
      <MissionCard mission={mockMission} onComplete={mockOnComplete} />
    );

    fireEvent.press(getByTestId('complete-button'));
    expect(mockOnComplete).toHaveBeenCalledWith(mockMission.id);
  });

  it('should show completed state when mission is completed', () => {
    const completedMission = { ...mockMission, is_completed: true };
    const { getByText } = render(
      <MissionCard mission={completedMission} onComplete={() => {}} />
    );
    expect(getByText('완료!')).toBeTruthy();
  });
});

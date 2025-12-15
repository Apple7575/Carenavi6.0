// T048: Component test for MissionList
import React from 'react';
import { render } from '@testing-library/react-native';
import MissionList from '../../../src/components/mission/MissionList';

describe('MissionList', () => {
  const mockMissions = [
    {
      id: '1',
      user_id: 'user-1',
      condition_record_id: null,
      date: '2025-12-16',
      type: 'easy' as const,
      title: 'Easy Mission',
      description: 'Easy description',
      estimated_duration: '1분',
      xp_reward: 10,
      is_completed: false,
      completed_at: null,
      created_at: '2025-12-16T00:00:00Z',
    },
    {
      id: '2',
      user_id: 'user-1',
      condition_record_id: null,
      date: '2025-12-16',
      type: 'normal' as const,
      title: 'Normal Mission',
      description: 'Normal description',
      estimated_duration: '10-20분',
      xp_reward: 25,
      is_completed: false,
      completed_at: null,
      created_at: '2025-12-16T00:00:00Z',
    },
    {
      id: '3',
      user_id: 'user-1',
      condition_record_id: null,
      date: '2025-12-16',
      type: 'challenge' as const,
      title: 'Challenge Mission',
      description: 'Challenge description',
      estimated_duration: '시간 가변',
      xp_reward: 50,
      is_completed: false,
      completed_at: null,
      created_at: '2025-12-16T00:00:00Z',
    },
  ];

  it('should render all 3 missions', () => {
    const { getByText } = render(
      <MissionList missions={mockMissions} onCompleteMission={() => {}} />
    );

    expect(getByText('Easy Mission')).toBeTruthy();
    expect(getByText('Normal Mission')).toBeTruthy();
    expect(getByText('Challenge Mission')).toBeTruthy();
  });

  it('should show empty state when no missions', () => {
    const { getByText } = render(
      <MissionList missions={[]} onCompleteMission={() => {}} />
    );

    expect(getByText('미션을 불러오는 중...')).toBeTruthy();
  });
});

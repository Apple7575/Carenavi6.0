// T093: Unit test for RecommendationCard
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RecommendationCard from '../../../src/components/store/RecommendationCard';

const mockRecommendation = {
  id: '1',
  user_id: 'user1',
  condition_record_id: 'cr1',
  product_id: 'prod1',
  match_reason: '피로 해소에 도움이 됩니다',
  is_clicked: false,
  clicked_at: null,
  created_at: '2024-01-01',
  product: {
    id: 'prod1',
    name: 'Vitamin B Complex',
    description: 'Energy boosting vitamin',
    category: 'supplements' as const,
    price: 35000,
    image_url: null,
    condition_keywords: ['fatigue', 'energy'],
    is_active: true,
    created_at: '2024-01-01',
  },
};

describe('RecommendationCard', () => {
  it('renders product name', () => {
    const { getByText } = render(
      <RecommendationCard recommendation={mockRecommendation} onPress={jest.fn()} />
    );
    expect(getByText('Vitamin B Complex')).toBeTruthy();
  });

  it('renders match reason', () => {
    const { getByText } = render(
      <RecommendationCard recommendation={mockRecommendation} onPress={jest.fn()} />
    );
    expect(getByText('피로 해소에 도움이 됩니다')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onPress={onPress}
        testID="rec-card"
      />
    );

    fireEvent.press(getByTestId('rec-card'));
    expect(onPress).toHaveBeenCalledWith(mockRecommendation);
  });
});

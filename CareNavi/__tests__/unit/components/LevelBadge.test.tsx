// T060: Unit test for LevelBadge
import React from 'react';
import { render } from '@testing-library/react-native';
import LevelBadge from '../../../src/components/character/LevelBadge';

describe('LevelBadge', () => {
  it('renders level correctly', () => {
    const { getByText, getByTestId } = render(
      <LevelBadge level={5} testID="level-badge" />
    );
    expect(getByTestId('level-badge')).toBeTruthy();
    expect(getByText('Lv.5')).toBeTruthy();
  });

  it('renders level 1 correctly', () => {
    const { getByText } = render(<LevelBadge level={1} />);
    expect(getByText('Lv.1')).toBeTruthy();
  });

  it('renders high level correctly', () => {
    const { getByText } = render(<LevelBadge level={99} />);
    expect(getByText('Lv.99')).toBeTruthy();
  });
});

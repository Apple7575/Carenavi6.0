// T061: Unit test for XPBar
import React from 'react';
import { render } from '@testing-library/react-native';
import XPBar from '../../../src/components/character/XPBar';

describe('XPBar', () => {
  it('renders with current and max XP', () => {
    const { getByTestId } = render(
      <XPBar currentXP={50} maxXP={100} testID="xp-bar" />
    );
    expect(getByTestId('xp-bar')).toBeTruthy();
  });

  it('shows XP text correctly', () => {
    const { getByText } = render(
      <XPBar currentXP={50} maxXP={100} />
    );
    expect(getByText('50 / 100 XP')).toBeTruthy();
  });

  it('handles empty progress', () => {
    const { getByText } = render(
      <XPBar currentXP={0} maxXP={100} />
    );
    expect(getByText('0 / 100 XP')).toBeTruthy();
  });

  it('handles full progress', () => {
    const { getByText } = render(
      <XPBar currentXP={100} maxXP={100} />
    );
    expect(getByText('100 / 100 XP')).toBeTruthy();
  });
});

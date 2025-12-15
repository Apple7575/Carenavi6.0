// T059: Unit test for CharacterAvatar
import React from 'react';
import { render } from '@testing-library/react-native';
import CharacterAvatar from '../../../src/components/character/CharacterAvatar';

describe('CharacterAvatar', () => {
  it('renders egg stage correctly', () => {
    const { getByTestId } = render(
      <CharacterAvatar stage="egg" testID="avatar" />
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders chick stage correctly', () => {
    const { getByTestId } = render(
      <CharacterAvatar stage="chick" testID="avatar" />
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders chicken stage correctly', () => {
    const { getByTestId } = render(
      <CharacterAvatar stage="chicken" testID="avatar" />
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders phoenix stage correctly', () => {
    const { getByTestId } = render(
      <CharacterAvatar stage="phoenix" testID="avatar" />
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('applies custom size', () => {
    const { getByTestId } = render(
      <CharacterAvatar stage="egg" size={120} testID="avatar" />
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });
});

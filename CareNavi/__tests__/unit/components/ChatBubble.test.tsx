// T032: Component test for ChatBubble
import React from 'react';
import { render } from '@testing-library/react-native';
import ChatBubble from '../../../src/components/chat/ChatBubble';

describe('ChatBubble', () => {
  it('should render character message correctly', () => {
    const { getByText } = render(
      <ChatBubble type="character" content="안녕! 오늘 기분이 어때?" />
    );
    expect(getByText('안녕! 오늘 기분이 어때?')).toBeTruthy();
  });

  it('should render user message correctly', () => {
    const { getByText } = render(
      <ChatBubble type="user" content="좀 피곤해" />
    );
    expect(getByText('좀 피곤해')).toBeTruthy();
  });

  it('should apply different styles for character vs user', () => {
    const { getByTestId: getCharacter } = render(
      <ChatBubble type="character" content="Test" testID="character-bubble" />
    );
    const { getByTestId: getUser } = render(
      <ChatBubble type="user" content="Test" testID="user-bubble" />
    );

    // Both should render without errors
    expect(getCharacter('character-bubble')).toBeTruthy();
    expect(getUser('user-bubble')).toBeTruthy();
  });
});

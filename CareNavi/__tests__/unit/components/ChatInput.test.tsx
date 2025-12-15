// T033: Component test for ChatInput
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatInput from '../../../src/components/chat/ChatInput';

describe('ChatInput', () => {
  it('should render text input', () => {
    const { getByPlaceholderText } = render(
      <ChatInput onSubmit={() => {}} />
    );
    expect(getByPlaceholderText('오늘 컨디션을 알려주세요...')).toBeTruthy();
  });

  it('should render submit button', () => {
    const { getByTestId } = render(
      <ChatInput onSubmit={() => {}} />
    );
    expect(getByTestId('submit-button')).toBeTruthy();
  });

  it('should update text value on change', () => {
    const { getByPlaceholderText } = render(
      <ChatInput onSubmit={() => {}} />
    );
    const input = getByPlaceholderText('오늘 컨디션을 알려주세요...');

    fireEvent.changeText(input, '오늘 좀 피곤해');
    expect(input.props.value).toBe('오늘 좀 피곤해');
  });

  it('should call onSubmit with text when button pressed', () => {
    const mockOnSubmit = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <ChatInput onSubmit={mockOnSubmit} />
    );

    const input = getByPlaceholderText('오늘 컨디션을 알려주세요...');
    fireEvent.changeText(input, '오늘 좀 피곤해');

    const button = getByTestId('submit-button');
    fireEvent.press(button);

    expect(mockOnSubmit).toHaveBeenCalledWith('오늘 좀 피곤해');
  });

  it('should clear input after submit', () => {
    const mockOnSubmit = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <ChatInput onSubmit={mockOnSubmit} />
    );

    const input = getByPlaceholderText('오늘 컨디션을 알려주세요...');
    fireEvent.changeText(input, '오늘 좀 피곤해');

    const button = getByTestId('submit-button');
    fireEvent.press(button);

    expect(input.props.value).toBe('');
  });

  it('should not submit when input is empty', () => {
    const mockOnSubmit = jest.fn();
    const { getByTestId } = render(
      <ChatInput onSubmit={mockOnSubmit} />
    );

    const button = getByTestId('submit-button');
    fireEvent.press(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should disable input when disabled prop is true', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ChatInput onSubmit={() => {}} disabled />
    );

    expect(getByPlaceholderText('오늘 컨디션을 알려주세요...').props.editable).toBe(false);
    expect(getByTestId('submit-button').props.disabled).toBe(true);
  });
});

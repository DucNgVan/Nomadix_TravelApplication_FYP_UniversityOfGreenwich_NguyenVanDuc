import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../../src/components/common/Input';

describe('Component Test: Input', () => {
  test('should render label, placeholder, and handle text changes', () => {
    const handleChangeText = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <Input
        label="Username"
        placeholder="Enter username"
        value="duc"
        onChangeText={handleChangeText}
      />
    );

    expect(getByText('Username')).toBeTruthy();
    const input = getByPlaceholderText('Enter username');
    fireEvent.changeText(input, 'duc-new');
    expect(handleChangeText).toHaveBeenCalledWith('duc-new');
  });

  test('should render error message when error prop is provided', () => {
    const { getByText } = render(
      <Input placeholder="Enter email" error="Invalid email address" />
    );

    expect(getByText('Invalid email address')).toBeTruthy();
  });
});

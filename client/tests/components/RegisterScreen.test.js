import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import { useAuthStore } from '../../src/stores/auth.store';

jest.mock('../../src/stores/auth.store');

describe('Component Test: RegisterScreen', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-10: RegisterScreen should validate password length (>= 8 chars) and dispatch register action', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<RegisterScreen />);

    // 1. Submit with short password
    fireEvent.changeText(getByPlaceholderText(/họ và tên|full name/i), 'Nguyen Van Duc');
    fireEvent.changeText(getByPlaceholderText(/email/i), 'newuser@nomadix.vn');
    fireEvent.changeText(getByPlaceholderText(/mật khẩu|password/i), 'short');
    fireEvent.press(getByText(/đăng ký|register/i));

    const errorMsg = await findByText(/mật khẩu phải có ít nhất 8 ký tự|password must be at least 8/i);
    expect(errorMsg).toBeTruthy();
    expect(mockRegister).not.toHaveBeenCalled();

    // 2. Submit with valid password >= 8 characters
    fireEvent.changeText(getByPlaceholderText(/mật khẩu|password/i), 'ValidPassword2026!');
    fireEvent.press(getByText(/đăng ký|register/i));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: 'Nguyen Van Duc',
        email: 'newuser@nomadix.vn',
        password: 'ValidPassword2026!',
      });
    });
  });

  test('should display validation error when full name is empty', async () => {
    const { getByText, findByText } = render(<RegisterScreen />);

    fireEvent.press(getByText(/đăng ký|register/i));

    const errorMsg = await findByText(/họ và tên phải có ít nhất 2 ký tự/i);
    expect(errorMsg).toBeTruthy();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test('should display validation error when email is invalid', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText(/họ và tên|full name/i), 'Nguyen Van Duc');
    fireEvent.changeText(getByPlaceholderText(/email/i), 'invalid-email');
    fireEvent.press(getByText(/đăng ký|register/i));

    const errorMsg = await findByText(/vui lòng nhập email hợp lệ/i);
    expect(errorMsg).toBeTruthy();
  });

  test('should navigate to login screen', () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<RegisterScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Đăng nhập ngay'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});

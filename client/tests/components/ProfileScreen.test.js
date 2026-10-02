import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import { useAuthStore } from '../../src/stores/auth.store';

jest.mock('../../src/stores/auth.store');

describe('Component Test: ProfileScreen (Account & Travel Stats)', () => {
  const mockUser = {
    id: 'u-1',
    fullName: 'Nguyễn Văn Đức',
    email: 'traveler@nomadix.vn',
  };

  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  test('RED-FE-ACC-01: renders user avatar, name, email and level XP badge', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Nguyễn Văn Đức')).toBeTruthy();
    expect(getByText('traveler@nomadix.vn')).toBeTruthy();
    expect(getByText(/Phượt thủ Cấp độ 5 • 1\.450 XP/)).toBeTruthy();
  });

  test('RED-FE-ACC-02: renders travel stats and action items', () => {
    const { getByText } = render(<ProfileScreen />);

    // Stats
    expect(getByText('Chuyến đi')).toBeTruthy();
    expect(getByText('Địa danh check-in')).toBeTruthy();
    expect(getByText('Huy hiệu')).toBeTruthy();

    // Action items
    expect(getByText(/Xác minh danh tính KYC/)).toBeTruthy();
    expect(getByText(/Tài khoản ngân hàng nhận tiền nợ/)).toBeTruthy();
    expect(getByText(/Thông báo & Lời mời Squad/)).toBeTruthy();
  });

  test('RED-FE-ACC-03: clicking logout button triggers authStore logout', () => {
    const { getByText } = render(<ProfileScreen />);

    const logoutBtn = getByText('Đăng xuất tài khoản');
    fireEvent.press(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

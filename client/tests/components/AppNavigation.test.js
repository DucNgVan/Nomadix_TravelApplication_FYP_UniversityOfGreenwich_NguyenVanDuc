import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import { useAuthStore } from '../../src/stores/auth.store';
import { useBookingStore } from '../../src/stores/booking.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';

jest.mock('../../src/stores/auth.store');
jest.mock('../../src/stores/booking.store');
jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');

describe('Component Test: App Root Navigation & Auth Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      flights: [],
      hotels: [],
      isLoadingFlights: false,
      isLoadingHotels: false,
      flightError: null,
      hotelError: null,
      searchFlights: jest.fn(),
      searchHotels: jest.fn(),
    });

    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: null,
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
    });
  });

  test('RED-FE-APP-01: when unauthenticated, displays Login screen and hides main bottom tabs', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText, queryByText } = render(<App />);

    // Should show Login screen elements
    expect(getByText('NOMADIX')).toBeTruthy();
    expect(getByText('Đăng nhập / Login')).toBeTruthy();

    // Should NOT show main bottom tabs
    expect(queryByText('Chuyến bay')).toBeNull();
    expect(queryByText('Khách sạn')).toBeNull();
    expect(queryByText('Kế hoạch')).toBeNull();
  });

  test('RED-FE-APP-02: when authenticated, displays bottom tabs (Chuyến bay, Khách sạn, Kế hoạch)', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { fullName: 'Đức Nguyễn', email: 'duc@example.com' },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText, queryByText } = render(<App />);

    // Should show the 3 required bottom tabs
    expect(getByText('Chuyến bay')).toBeTruthy();
    expect(getByText('Khách sạn')).toBeTruthy();
    expect(getByText('Kế hoạch')).toBeTruthy();

    // Should NOT show login screen
    expect(queryByText('Chào mừng trở lại!')).toBeNull();
  });

  test('RED-FE-APP-03: clicking "Kế hoạch" tab renders the Plan screen', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { fullName: 'Đức Nguyễn', email: 'duc@example.com' },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText } = render(<App />);

    const planTabButton = getByText('Kế hoạch');
    fireEvent.press(planTabButton);

    expect(getByText('Kế hoạch chuyến đi')).toBeTruthy();
  });

  test('RED-FE-APP-04: allows switching to Khách sạn and Chuyến bay tabs and calling logout', () => {
    const mockLogout = jest.fn();
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { fullName: 'Đức Nguyễn' },
      logout: mockLogout,
    });

    const { getByText } = render(<App />);

    // Switch to Hotel tab
    fireEvent.press(getByText('Khách sạn'));
    expect(getByText('Khám phá khách sạn')).toBeTruthy();

    // Switch to Flight tab
    fireEvent.press(getByText('Chuyến bay'));
    expect(getByText('Tìm vé máy bay')).toBeTruthy();

    // Switch to Account/Profile tab and click Logout
    fireEvent.press(getByText('Tài khoản'));
    fireEvent.press(getByText(/Đăng xuất/));
    expect(mockLogout).toHaveBeenCalled();
  });

  test('RED-FE-APP-05: toggles between Login and Register screens when unauthenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
    });

    const { getByText, queryByText } = render(<App />);

    // In Login screen, click Register link
    fireEvent.press(getByText('Đăng ký ngay'));
    expect(getByText(/Tạo tài khoản mới/)).toBeTruthy();

    // In Register screen, click Login link
    fireEvent.press(getByText('Đăng nhập ngay'));
    expect(getByText('NOMADIX')).toBeTruthy();
  });
});

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

describe('Component Test: App 4-Tab Navigation (Flight, Hotel, Plan, Account)', () => {
  const mockUser = {
    fullName: 'Nguyễn Văn Đức',
    email: 'traveler@nomadix.vn',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      logout: jest.fn(),
    });
    useBookingStore.mockReturnValue({
      flights: [],
      hotels: [],
      isLoadingFlights: false,
      isLoadingHotels: false,
      searchFlights: jest.fn(),
      searchHotels: jest.fn(),
    });
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
    });
    useExpenseStore.mockReturnValue({
      expenses: [],
      debtSummary: null,
    });
  });

  test('RED-FE-NAV-4TAB-01: renders 4 bottom tabs including Tài khoản', () => {
    const { getByText } = render(<App />);

    expect(getByText('Chuyến bay')).toBeTruthy();
    expect(getByText('Khách sạn')).toBeTruthy();
    expect(getByText('Kế hoạch')).toBeTruthy();
    expect(getByText('Tài khoản')).toBeTruthy();
  });

  test('RED-FE-NAV-4TAB-02: clicking "Tài khoản" switches to ProfileScreen', () => {
    const { getByText } = render(<App />);

    const accountTab = getByText('Tài khoản');
    fireEvent.press(accountTab);

    // ProfileScreen content should appear
    expect(getByText('Nguyễn Văn Đức')).toBeTruthy();
    expect(getByText('traveler@nomadix.vn')).toBeTruthy();
  });
});

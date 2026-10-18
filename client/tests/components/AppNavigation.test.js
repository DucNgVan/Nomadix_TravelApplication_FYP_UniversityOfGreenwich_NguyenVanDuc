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
    expect(getByText(/Sign In|Login/i)).toBeTruthy();

    // Should NOT show main bottom tabs
    expect(queryByText('Flights')).toBeNull();
    expect(queryByText('Hotels')).toBeNull();
    expect(queryByText('Plan')).toBeNull();
  });

  test('RED-FE-APP-02: when authenticated, displays bottom tabs (Flights, Hotels, Plan)', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { fullName: 'Đức Nguyễn', email: 'duc@example.com' },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText, queryByText } = render(<App />);

    // Should show the 3 required bottom tabs
    expect(getByText('Flights')).toBeTruthy();
    expect(getByText('Hotels')).toBeTruthy();
    expect(getByText('Plan')).toBeTruthy();

    // Should NOT show login screen
    expect(queryByText('Welcome Back')).toBeNull();
  });

  test('RED-FE-APP-03: clicking "Plan" tab renders the Plan screen', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { fullName: 'Đức Nguyễn', email: 'duc@example.com' },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText } = render(<App />);

    const planTabButton = getByText('Plan');
    fireEvent.press(planTabButton);

    expect(getByText(/Trip Itinerary|No Travel Plan Yet/i)).toBeTruthy();
  });

  test('RED-FE-APP-04: allows switching to Hotels and Flights tabs and calling logout', () => {
    const mockLogout = jest.fn();
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { fullName: 'Đức Nguyễn' },
      logout: mockLogout,
    });

    const { getByText } = render(<App />);

    // Switch to Hotel tab
    fireEvent.press(getByText('Hotels'));
    expect(getByText(/Hotels & Resorts|Explore Hotels/i)).toBeTruthy();

    // Switch to Flight tab
    fireEvent.press(getByText('Flights'));
    expect(getByText(/Search Flights|Find Flights/i)).toBeTruthy();

    // Switch to Account/Profile tab and click Logout
    fireEvent.press(getByText('Profile'));
    fireEvent.press(getByText(/Log Out|Sign Out/i));
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
    fireEvent.press(getByText(/Sign Up|Register/i));
    expect(getByText(/Create Account|Register/i)).toBeTruthy();

    // In Register screen, click Login link
    fireEvent.press(getByText(/Sign In|Login/i));
    expect(getByText('NOMADIX')).toBeTruthy();
  });
});

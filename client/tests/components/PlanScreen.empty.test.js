import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');

describe('Component Test: PlanScreen Empty State & Creation Flow', () => {
  const mockCreateTrip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.mockReturnValue({
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,
      fetchTrips: jest.fn(),
      fetchTripDetails: jest.fn(),
      createTrip: mockCreateTrip,
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

  test('RED-EN-PLAN-01: renders clean English empty state with exactly 2 primary options', () => {
    const { getByText, queryByText } = render(<PlanScreen />);

    // English title & subtitle
    expect(getByText(/No Travel Plan Yet/i)).toBeTruthy();
    expect(getByText(/Choose an option below to start your journey/i)).toBeTruthy();

    // Option 1: Smart Journey Wizard
    expect(getByText(/✨ Smart Journey Wizard/i)).toBeTruthy();

    // Option 2: Explore Places on Map First
    expect(getByText(/🗺️ Explore Places on Map First/i)).toBeTruthy();

    // Strictly verify old redundant manual create trip button is NOT present
    expect(queryByText(/\+ Tạo kế hoạch mới/i)).toBeNull();
    expect(queryByText(/\+ Create New Trip/i)).toBeNull();
  });

  test('RED-EN-PLAN-02: allows exploring map first in English and returning smoothly', () => {
    const { getByText } = render(<PlanScreen />);

    // Press Option 2: Explore map first
    fireEvent.press(getByText(/🗺️ Explore Places on Map First/i));

    // Should switch to map discovery view in English
    expect(getByText(/Explore Places on Map/i)).toBeTruthy();
    expect(getByText(/← Back/i)).toBeTruthy();

    // Press back to return to empty plan screen
    fireEvent.press(getByText(/← Back/i));
    expect(getByText(/No Travel Plan Yet/i)).toBeTruthy();
  });
});

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

  test('RED-FE-PLAN-EMPTY-01: renders clean empty state when user has no active trips', () => {
    const { getByText } = render(<PlanScreen />);

    expect(getByText(/Chưa có kế hoạch nào|No trips planned/i)).toBeTruthy();
    expect(getByText(/\+ Tạo kế hoạch mới|Create new trip/i)).toBeTruthy();
  });

  test('RED-FE-PLAN-EMPTY-02: pressing create button opens create trip modal with inputs', () => {
    const { getByText, getByPlaceholderText } = render(<PlanScreen />);

    fireEvent.press(getByText(/\+ Tạo kế hoạch mới|Create new trip/i));

    expect(getByPlaceholderText(/Tên chuyến đi|Trip title/i)).toBeTruthy();
    expect(getByPlaceholderText(/Điểm đến|Destination/i)).toBeTruthy();
  });

  test('RED-FE-PLAN-EMPTY-03: submitting create trip form invokes store createTrip', async () => {
    mockCreateTrip.mockResolvedValueOnce({
      id: 'trip-new-1',
      title: 'Hành trình Đà Lạt 3 ngày',
      destination: 'Đà Lạt',
      startDate: '2026-11-01',
      endDate: '2026-11-03',
      days: [],
    });

    const { getByText, getByPlaceholderText } = render(<PlanScreen />);

    fireEvent.press(getByText(/\+ Tạo kế hoạch mới|Create new trip/i));

    fireEvent.changeText(getByPlaceholderText(/Tên chuyến đi|Trip title/i), 'Hành trình Đà Lạt 3 ngày');
    fireEvent.changeText(getByPlaceholderText(/Điểm đến|Destination/i), 'Đà Lạt');

    fireEvent.press(getByText(/Tạo chuyến đi|Xác nhận tạo/i));

    await waitFor(() => {
      expect(mockCreateTrip).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Hành trình Đà Lạt 3 ngày',
          destination: 'Đà Lạt',
        })
      );
    });
  });

  test('RED-FE-PLAN-EMPTY-04: allows exploring map first when no trip exists and returning', () => {
    const { getByText, queryByText } = render(<PlanScreen />);

    // Press explore map first
    fireEvent.press(getByText(/Khám phá bản đồ trước/i));

    // Should switch to map discovery view
    expect(getByText(/Khám phá địa điểm/i)).toBeTruthy();
    expect(getByText(/← Quay lại/i)).toBeTruthy();

    // Press back to return to empty plan screen
    fireEvent.press(getByText(/← Quay lại/i));
    expect(getByText(/Chưa có kế hoạch nào/i)).toBeTruthy();
  });

  test('RED-FE-PLAN-EMPTY-05: displays error banner when createTrip fails', async () => {
    mockCreateTrip.mockRejectedValueOnce(new Error('Tạo chuyến đi thất bại do lỗi mạng'));

    const { getByText, getByPlaceholderText } = render(<PlanScreen />);

    fireEvent.press(getByText(/\+ Tạo kế hoạch mới/i));
    fireEvent.changeText(getByPlaceholderText(/Tên chuyến đi/i), 'Chuyến đi lỗi');
    fireEvent.changeText(getByPlaceholderText(/Điểm đến/i), 'Đà Lạt');

    fireEvent.press(getByText(/Tạo chuyến đi/i));

    await waitFor(() => {
      expect(getByText(/Tạo chuyến đi thất bại do lỗi mạng/i)).toBeTruthy();
    });
  });

  test('RED-FE-PLAN-EMPTY-06: cancels create trip modal when Hủy is pressed', () => {
    const { getByText, getByPlaceholderText } = render(<PlanScreen />);

    fireEvent.press(getByText(/\+ Tạo kế hoạch mới/i));
    expect(getByPlaceholderText(/Tên chuyến đi/i)).toBeTruthy();

    fireEvent.press(getByText(/Hủy/i));
  });
});

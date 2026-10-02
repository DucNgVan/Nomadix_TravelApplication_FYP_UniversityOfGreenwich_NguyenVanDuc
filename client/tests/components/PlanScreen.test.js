import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useExpenseStore } from '../../src/stores/expense.store';

jest.mock('../../src/stores/itinerary.store');
jest.mock('../../src/stores/expense.store');

describe('Component Test: PlanScreen (Itinerary & Group Expense Hub with Sub-Tabs)', () => {
  const mockTrip = {
    id: 'trip-101',
    title: 'Khám phá Đà Nẵng - Hội An',
    destination: 'Đà Nẵng',
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    collaborators: [
      { userId: 'u-1', fullName: 'Đức Nguyễn (Bạn)', role: 'OWNER', status: 'ACCEPTED' },
      { userId: 'u-2', fullName: 'Hoàng Nam', role: 'EDITOR', status: 'ACCEPTED' },
    ],
    days: [
      {
        dayIndex: 1,
        date: '2026-10-15',
        items: [
          {
            id: 'item-1',
            name: 'Bán đảo Sơn Trà',
            arrivalTime: '09:00',
            durationMinutes: 90,
            transitToNext: { mode: 'DRIVING', distanceKm: 8.5, durationMinutes: 18 },
          },
          {
            id: 'item-2',
            name: 'Chùa Linh Ứng',
            arrivalTime: '11:00',
            durationMinutes: 60,
          },
        ],
      },
    ],
  };

  const mockDebtSummary = {
    tripId: 'trip-101',
    totalExpense: 3600000,
    memberBalances: [
      { userId: 'u-1', fullName: 'Đức Nguyễn', netBalance: 1200000 },
      { userId: 'u-2', fullName: 'Hoàng Nam', netBalance: -1200000 },
    ],
    simplifiedSettlements: [
      { fromUserName: 'Hoàng Nam', toUserName: 'Đức Nguyễn', amount: 1200000, currency: 'VND' },
    ],
  };

  const mockExpenses = [
    {
      id: 'exp-1',
      title: 'Bữa trưa hải sản Bé Mặn',
      amount: 1800000,
      paidByName: 'Đức Nguyễn',
      splitType: 'EQUAL',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.mockReturnValue({
      currentTrip: mockTrip,
      isLoading: false,
      error: null,
      fetchTripDetails: jest.fn(),
      inviteCompanion: jest.fn(),
    });

    useExpenseStore.mockReturnValue({
      expenses: mockExpenses,
      debtSummary: mockDebtSummary,
      isLoading: false,
      error: null,
      fetchTripExpenses: jest.fn(),
      fetchDebtSummary: jest.fn(),
      settleDebt: jest.fn(),
    });
  });

  test('RED-FE-PLAN-01: renders default sub-tab "Lịch trình & Đội nhóm" with timeline stops and squad members', () => {
    const { getByText, queryByText } = render(<PlanScreen />);

    // Header & Sub-tabs
    expect(getByText('Kế hoạch chuyến đi')).toBeTruthy();
    expect(getByText('Lịch trình & Đội nhóm')).toBeTruthy();
    expect(getByText('Chi tiêu & Chia tiền')).toBeTruthy();

    // Timeline stops
    expect(getByText('Bán đảo Sơn Trà')).toBeTruthy();
    expect(getByText('Chùa Linh Ứng')).toBeTruthy();
    expect(getByText(/8\.5 km/)).toBeTruthy();

    // Squad members & role badges
    expect(getByText('Đức Nguyễn (Bạn)')).toBeTruthy();
    expect(getByText('OWNER')).toBeTruthy();
    expect(getByText('Hoàng Nam')).toBeTruthy();
    expect(getByText('EDITOR')).toBeTruthy();
  });

  test('RED-FE-PLAN-02: switches to sub-tab "Chi tiêu & Chia tiền" and renders expenses and greedy debt simplification', () => {
    const { getByText, getAllByText } = render(<PlanScreen />);

    // Click on Chi tiêu & Chia tiền sub-tab
    const expenseTabButton = getByText('Chi tiêu & Chia tiền');
    fireEvent.press(expenseTabButton);

    // Should display expense total
    expect(getByText(/3\.600\.000/)).toBeTruthy();

    // Should display member balance
    expect(getAllByText(/Đức Nguyễn/)[0]).toBeTruthy();
    expect(getByText(/\+1\.200\.000/)).toBeTruthy();

    // Should display simplified settlement path
    expect(getByText(/Hoàng Nam.*chuyển.*Đức Nguyễn/i)).toBeTruthy();

    // Should have Settle-Up button
    expect(getByText('Thanh toán nợ')).toBeTruthy();
  });

  test('should handle invite companion flow and settle up flow', () => {
    const mockInvite = jest.fn();
    const mockSettle = jest.fn();
    useItineraryStore.mockReturnValue({
      currentTrip: mockTrip,
      inviteCompanion: mockInvite,
    });
    useExpenseStore.mockReturnValue({
      expenses: mockExpenses,
      debtSummary: mockDebtSummary,
      settleDebt: mockSettle,
    });

    const { getByText, getByPlaceholderText, getAllByText } = render(<PlanScreen />);

    // Open invite modal
    fireEvent.press(getByText('+ Mời bạn'));
    expect(getByText('Mời bạn đồng hành')).toBeTruthy();

    // Type email & toggle role
    fireEvent.changeText(getByPlaceholderText('email@example.com'), 'friend@example.com');
    fireEvent.press(getByText('VIEWER'));
    fireEvent.press(getAllByText('EDITOR')[1]);

    // Submit invite
    fireEvent.press(getByText('Gửi lời mời'));
    expect(mockInvite).toHaveBeenCalledWith('trip-101', {
      email: 'friend@example.com',
      role: 'EDITOR',
    });

    // Switch to expense tab & settle up
    fireEvent.press(getByText('Chi tiêu & Chia tiền'));
    fireEvent.press(getByText('Thanh toán nợ'));
    expect(mockSettle).toHaveBeenCalled();
  });

  test('should allow switching between itinerary days and canceling modal', () => {
    const { getByText, queryByText } = render(<PlanScreen />);

    // Cancel modal
    fireEvent.press(getByText('+ Mời bạn'));
    fireEvent.press(getByText('Hủy'));
    expect(queryByText('Mời bạn đồng hành')).toBeNull();

    // Select Day
    fireEvent.press(getByText('Ngày 1'));
    expect(getByText('Bán đảo Sơn Trà')).toBeTruthy();
  });
});

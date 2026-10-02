import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FlightCard from '../../src/components/booking/FlightCard';

describe('Component Test: FlightCard', () => {
  const mockFlight = {
    id: 'flight-vn-101',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-101',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-10-15T08:00:00Z',
    arrivalTime: '2026-10-15T10:15:00Z',
    durationMinutes: 135,
    stops: 0,
    cabinClass: 'ECONOMY',
    price: { currency: 'VND', amount: 1550000 },
  };

  test('RED-FE-BK-06: FlightCard should render airline name, flight number, route, and formatted price', () => {
    const { getByText } = render(<FlightCard flight={mockFlight} />);

    expect(getByText(/Vietnam Airlines/i)).toBeTruthy();
    expect(getByText(/VN-101/i)).toBeTruthy();
    expect(getByText(/SGN/i)).toBeTruthy();
    expect(getByText(/HAN/i)).toBeTruthy();
    expect(getByText(/2h 15m/i)).toBeTruthy();
    expect(getByText(/1.550.000|1,550,000/i)).toBeTruthy();
  });

  test('RED-FE-BK-07: FlightCard should display Direct badge when stops is 0, or transit stops count when > 0', () => {
    const { getByText, rerender } = render(<FlightCard flight={mockFlight} />);
    expect(getByText(/bay thẳng|direct/i)).toBeTruthy();

    const transitFlight = { ...mockFlight, stops: 1 };
    rerender(<FlightCard flight={transitFlight} />);
    expect(getByText(/1 điểm dừng|1 stop/i)).toBeTruthy();
  });

  test('RED-FE-BK-08: FlightCard should trigger onSelect callback with flight payload when pressed', () => {
    const onSelectMock = jest.fn();
    const { getByTestId, getByText } = render(
      <FlightCard flight={mockFlight} onSelect={onSelectMock} testID="flight-card-vn-101" />
    );

    const card = getByTestId('flight-card-vn-101');
    fireEvent.press(card);

    expect(onSelectMock).toHaveBeenCalledWith(mockFlight);
  });

  test('should return null when flight prop is null or undefined', () => {
    const { toJSON } = render(<FlightCard flight={null} />);
    expect(toJSON()).toBeNull();
  });

  test('should safely handle flight with missing timestamps and price amount', () => {
    const minimalFlight = {
      airlineName: 'Vietjet Air',
      flightNumber: 'VJ-123',
      origin: 'DAD',
      destination: 'SGN',
      stops: 0,
      durationMinutes: null,
      price: null,
    };

    const { getByText, getByTestId } = render(
      <FlightCard flight={minimalFlight} testID="minimal-flight" />
    );

    expect(getByText('0h 0m')).toBeTruthy();
    expect(getByText('0 đ')).toBeTruthy();

    // Verify pressing without onSelect does not crash
    fireEvent.press(getByTestId('minimal-flight'));
  });
});

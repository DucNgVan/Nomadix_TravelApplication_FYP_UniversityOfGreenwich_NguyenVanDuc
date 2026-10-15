import { create } from 'zustand';
import apiClient from '../api/client';

export const useBookingStore = create((set, get) => ({
  flights: [],
  hotels: [],
  selectedFlight: null,
  selectedHotel: null,
  isLoadingFlights: false,
  isLoadingHotels: false,
  flightError: null,
  hotelError: null,
  bookedTickets: [],
  flightFilters: {
    directOnly: false,
    maxPrice: null,
    sortBy: 'price:asc',
  },
  hotelFilters: {
    minRating: 0,
    maxPrice: null,
    sortBy: 'price:asc',
  },

  bookFlightSandbox: (flight, passengerDetails = {}) => {
    const carrier = flight.airlineCode || 'VN';
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const pnr = `${carrier}-${randomChars}`;
    const random10 = Math.floor(1000000000 + Math.random() * 9000000000);
    const ticketNumber = `738-${random10}`;

    const newTicket = {
      id: `tkt-${Date.now()}-${randomChars}`,
      pnr,
      ticketNumber,
      flightId: flight.id,
      airlineCode: flight.airlineCode,
      airlineName: flight.airlineName,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      durationMinutes: flight.durationMinutes,
      stops: flight.stops,
      aircraft: flight.aircraft || (flight.flightNumber?.includes('VN-0240') ? 'Airbus A350-900' : 'Airbus A321'),
      cabinClass: flight.cabinClass || 'ECONOMY',
      totalPrice: flight.price?.amount || 0,
      currency: flight.price?.currency || 'VND',
      passenger: {
        fullName: passengerDetails.fullName || 'Nguyễn Văn Đức',
        documentId: passengerDetails.documentId || 'C01928491',
        email: passengerDetails.email || 'ducnva.wk@gmail.com',
      },
      status: 'CONFIRMED',
      bookedAt: new Date().toISOString(),
    };

    set((state) => ({
      bookedTickets: [newTicket, ...(state.bookedTickets || [])],
    }));

    return {
      success: true,
      pnr,
      ticketNumber,
      ticket: newTicket,
    };
  },

  cancelBookedTicket: (idOrPnr) => {
    set((state) => ({
      bookedTickets: (state.bookedTickets || []).filter(
        (t) => t.id !== idOrPnr && t.pnr !== idOrPnr
      ),
    }));
  },

  searchFlights: async (params) => {
    set({ isLoadingFlights: true, flightError: null });
    try {
      const response = await apiClient.get('/flights/search', { params });
      const flightsList = Array.isArray(response)
        ? response
        : (response?.flights || []);
      set({ flights: flightsList, isLoadingFlights: false });
      return response;
    } catch (error) {
      const message = error.message || 'Lỗi khi tìm kiếm chuyến bay';
      set({ flightError: message, isLoadingFlights: false, flights: [] });
      throw error;
    }
  },

  searchHotels: async (params) => {
    set({ isLoadingHotels: true, hotelError: null });
    try {
      const response = await apiClient.get('/hotels/search', { params });
      const hotelsList = Array.isArray(response)
        ? response
        : (response?.hotels || []);
      set({ hotels: hotelsList, isLoadingHotels: false });
      return response;
    } catch (error) {
      const message = error.message || 'Lỗi khi tìm kiếm khách sạn';
      set({ hotelError: message, isLoadingHotels: false, hotels: [] });
      throw error;
    }
  },

  setFlightFilters: (filters) => {
    set((state) => ({
      flightFilters: { ...state.flightFilters, ...filters },
    }));
  },

  setHotelFilters: (filters) => {
    set((state) => ({
      hotelFilters: { ...state.hotelFilters, ...filters },
    }));
  },

  selectFlight: (flight) => {
    set({ selectedFlight: flight });
  },

  selectHotel: (hotel) => {
    set({ selectedHotel: hotel });
  },

  clearBookingSelection: () => {
    set({ selectedFlight: null, selectedHotel: null });
  },
}));

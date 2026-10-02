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

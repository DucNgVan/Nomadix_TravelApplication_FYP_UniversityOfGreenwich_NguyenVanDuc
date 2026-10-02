import { create } from 'zustand';
import apiClient from '../api/client';

export const useItineraryStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.get('/itineraries');
      const tripsList = Array.isArray(data) ? data : (data?.itineraries || []);
      set({ trips: tripsList, isLoading: false });
      return tripsList;
    } catch (err) {
      set({ error: err.message || 'Lỗi khi tải danh sách chuyến đi', isLoading: false });
      throw err;
    }
  },

  fetchTripDetails: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const trip = await apiClient.get(`/itineraries/${tripId}`);
      set({ currentTrip: trip, isLoading: false });
      return trip;
    } catch (err) {
      set({ error: err.message || 'Lỗi khi tải chi tiết lịch trình', isLoading: false });
      throw err;
    }
  },

  createTrip: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const createdTrip = await apiClient.post('/itineraries', payload);
      set((state) => ({
        trips: [createdTrip, ...state.trips],
        currentTrip: createdTrip,
        isLoading: false,
      }));
      return createdTrip;
    } catch (err) {
      set({ error: err.message || 'Lỗi khi tạo chuyến đi mới', isLoading: false });
      throw err;
    }
  },

  addStop: async (tripId, stopPayload) => {
    set({ isLoading: true, error: null });
    try {
      const addedItem = await apiClient.post(`/itineraries/${tripId}/items`, stopPayload);
      set((state) => {
        if (!state.currentTrip) return { isLoading: false };
        const updatedDays = state.currentTrip.days.map((day) => {
          if (day.dayIndex === stopPayload.dayIndex) {
            return {
              ...day,
              items: [...(day.items || []), addedItem],
            };
          }
          return day;
        });

        return {
          currentTrip: {
            ...state.currentTrip,
            days: updatedDays,
          },
          isLoading: false,
        };
      });
      return addedItem;
    } catch (err) {
      set({ error: err.message || 'Lỗi khi thêm điểm dừng', isLoading: false });
      throw err;
    }
  },

  inviteCompanion: async (tripId, { email, role }) => {
    set({ isLoading: true, error: null });
    try {
      const invitedMember = await apiClient.post(`/itineraries/${tripId}/collaborators`, {
        email,
        role,
      });

      set((state) => {
        if (!state.currentTrip) return { isLoading: false };
        return {
          currentTrip: {
            ...state.currentTrip,
            collaborators: [...(state.currentTrip.collaborators || []), invitedMember],
          },
          isLoading: false,
        };
      });
      return invitedMember;
    } catch (err) {
      set({ error: err.message || 'Lỗi khi mời bạn bè', isLoading: false });
      throw err;
    }
  },

  setCurrentTrip: (trip) => {
    set({ currentTrip: trip });
  },
}));

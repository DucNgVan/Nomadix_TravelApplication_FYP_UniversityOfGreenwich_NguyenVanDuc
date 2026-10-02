import { useItineraryStore } from '../../../src/stores/itinerary.store';
import apiClient from '../../../src/api/client';

jest.mock('../../../src/api/client');

describe('Unit Test: Itinerary Store (Collaborative Planning & Companion Invites)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useItineraryStore.setState({
      trips: [],
      currentTrip: null,
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-ITIN-01: useItineraryStore should initialize with empty state', () => {
    const state = useItineraryStore.getState();
    expect(state.trips).toEqual([]);
    expect(state.currentTrip).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('RED-FE-ITIN-02: fetchTrips should load user trips from API', async () => {
    const mockTrips = [
      {
        id: 'trip-101',
        title: 'Chuyến đi Đà Nẵng 3 ngày 2 đêm',
        destination: 'Đà Nẵng',
        startDate: '2026-10-15',
        endDate: '2026-10-17',
        collaborators: [
          { userId: 'u-1', fullName: 'Đức Nguyễn', role: 'OWNER', status: 'ACCEPTED' },
        ],
      },
    ];

    apiClient.get.mockResolvedValueOnce(mockTrips);

    await useItineraryStore.getState().fetchTrips();

    const state = useItineraryStore.getState();
    expect(apiClient.get).toHaveBeenCalledWith('/itineraries');
    expect(state.trips).toEqual(mockTrips);
    expect(state.isLoading).toBe(false);
  });

  test('RED-FE-ITIN-03: createTrip should create trip and prepend to trips array', async () => {
    const newTripPayload = {
      title: 'Khám phá Hà Giang',
      destination: 'Hà Giang',
      startDate: '2026-11-01',
      endDate: '2026-11-04',
    };

    const createdTrip = {
      id: 'trip-102',
      ...newTripPayload,
      collaborators: [{ userId: 'u-1', role: 'OWNER' }],
      days: [],
    };

    apiClient.post.mockResolvedValueOnce(createdTrip);

    const result = await useItineraryStore.getState().createTrip(newTripPayload);

    const state = useItineraryStore.getState();
    expect(apiClient.post).toHaveBeenCalledWith('/itineraries', newTripPayload);
    expect(state.trips[0]).toEqual(createdTrip);
    expect(result).toEqual(createdTrip);
  });

  test('RED-FE-ITIN-04: inviteCompanion should send invitation and append collaborator', async () => {
    const initialTrip = {
      id: 'trip-101',
      title: 'Đà Nẵng Trip',
      collaborators: [
        { userId: 'u-1', fullName: 'Đức Nguyễn', role: 'OWNER', status: 'ACCEPTED' },
      ],
    };

    useItineraryStore.setState({ currentTrip: initialTrip });

    const newCollaborator = {
      userId: 'u-2',
      email: 'hoang.nam@example.com',
      fullName: 'Hoàng Nam',
      role: 'EDITOR',
      status: 'PENDING',
    };

    apiClient.post.mockResolvedValueOnce(newCollaborator);

    await useItineraryStore.getState().inviteCompanion('trip-101', {
      email: 'hoang.nam@example.com',
      role: 'EDITOR',
    });

    const state = useItineraryStore.getState();
    expect(apiClient.post).toHaveBeenCalledWith('/itineraries/trip-101/collaborators', {
      email: 'hoang.nam@example.com',
      role: 'EDITOR',
    });
    expect(state.currentTrip.collaborators.length).toBe(2);
    expect(state.currentTrip.collaborators[1].email).toBe('hoang.nam@example.com');
  });

  test('RED-FE-ITIN-05: addStop should add item to currentTrip day timeline with Haversine distance', async () => {
    const initialTrip = {
      id: 'trip-101',
      days: [
        {
          dayIndex: 1,
          date: '2026-10-15',
          items: [],
        },
      ],
    };

    useItineraryStore.setState({ currentTrip: initialTrip });

    const stopPayload = {
      dayIndex: 1,
      name: 'Bán đảo Sơn Trà',
      lat: 16.1158,
      lng: 108.2758,
      durationMinutes: 90,
      arrivalTime: '09:00',
    };

    const addedItem = {
      id: 'item-01',
      ...stopPayload,
      transitToNext: { mode: 'DRIVING', distanceKm: 8.5, durationMinutes: 18 },
    };

    apiClient.post.mockResolvedValueOnce(addedItem);

    await useItineraryStore.getState().addStop('trip-101', stopPayload);

    const state = useItineraryStore.getState();
    expect(apiClient.post).toHaveBeenCalledWith('/itineraries/trip-101/items', stopPayload);
    expect(state.currentTrip.days[0].items.length).toBe(1);
    expect(state.currentTrip.days[0].items[0].name).toBe('Bán đảo Sơn Trà');
  });

  test('should handle fetchTrips error', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Network error'));
    await expect(useItineraryStore.getState().fetchTrips()).rejects.toThrow('Network error');
    expect(useItineraryStore.getState().error).toBe('Network error');
  });

  test('should handle fetchTripDetails and its error', async () => {
    const mockTrip = { id: 't-1', title: 'Trip 1' };
    apiClient.get.mockResolvedValueOnce(mockTrip);

    const trip = await useItineraryStore.getState().fetchTripDetails('t-1');
    expect(trip).toEqual(mockTrip);
    expect(useItineraryStore.getState().currentTrip).toEqual(mockTrip);

    apiClient.get.mockRejectedValueOnce({});
    await expect(useItineraryStore.getState().fetchTripDetails('t-1')).rejects.toBeDefined();
    expect(useItineraryStore.getState().error).toBe('Lỗi khi tải chi tiết lịch trình');
  });

  test('should handle createTrip, addStop and inviteCompanion errors and null currentTrip', async () => {
    apiClient.post.mockRejectedValueOnce(new Error('Cannot create trip'));
    await expect(useItineraryStore.getState().createTrip({})).rejects.toThrow('Cannot create trip');

    useItineraryStore.setState({ currentTrip: null });
    apiClient.post.mockResolvedValueOnce({ id: 's-1' });
    await useItineraryStore.getState().addStop('t-1', { dayIndex: 1 });
    expect(useItineraryStore.getState().currentTrip).toBeNull();

    apiClient.post.mockRejectedValueOnce(new Error('Stop error'));
    await expect(useItineraryStore.getState().addStop('t-1', {})).rejects.toThrow('Stop error');

    useItineraryStore.setState({ currentTrip: null });
    apiClient.post.mockResolvedValueOnce({ email: 'a@b.com' });
    await useItineraryStore.getState().inviteCompanion('t-1', { email: 'a@b.com', role: 'VIEWER' });
    expect(useItineraryStore.getState().currentTrip).toBeNull();

    apiClient.post.mockRejectedValueOnce(new Error('Invite error'));
    await expect(useItineraryStore.getState().inviteCompanion('t-1', {})).rejects.toThrow('Invite error');

    useItineraryStore.getState().setCurrentTrip({ id: 't-set' });
    expect(useItineraryStore.getState().currentTrip.id).toBe('t-set');
  });
});

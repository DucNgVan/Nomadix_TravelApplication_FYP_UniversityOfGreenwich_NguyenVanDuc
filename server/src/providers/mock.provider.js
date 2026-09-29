const crypto = require('crypto');

/**
 * Mock Booking Provider for Vietnam Domestic Flights and Hotels
 * Provides high-fidelity, realistic localized data with guaranteed availability.
 */
class MockBookingProvider {
  /**
   * Search domestic flights
   */
  async searchFlights({ origin, destination, departureDate, passengers = 1, cabinClass = 'ECONOMY' }) {
    const datePrefix = departureDate;
    const flightCatalog = [
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_VNA',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        flightNumber: 'VN-128',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T08:00:00Z`,
        arrivalTime: `${datePrefix}T09:30:00Z`,
        durationMinutes: 90,
        stops: 0,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 1450000 * passengers,
        },
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_VIETJET',
        airlineCode: 'VJ',
        airlineName: 'Vietjet Air',
        flightNumber: 'VJ-502',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T10:15:00Z`,
        arrivalTime: `${datePrefix}T11:45:00Z`,
        durationMinutes: 90,
        stops: 0,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 980000 * passengers,
        },
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_BAMBOO',
        airlineCode: 'QH',
        airlineName: 'Bamboo Airways',
        flightNumber: 'QH-154',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T14:00:00Z`,
        arrivalTime: `${datePrefix}T15:30:00Z`,
        durationMinutes: 90,
        stops: 0,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 1250000 * passengers,
        },
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_VIETJET',
        airlineCode: 'VJ',
        airlineName: 'Vietjet Air',
        flightNumber: 'VJ-518',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T17:30:00Z`,
        arrivalTime: `${datePrefix}T20:00:00Z`,
        durationMinutes: 150,
        stops: 1,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 850000 * passengers,
        },
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_VNA',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        flightNumber: 'VN-136',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T19:00:00Z`,
        arrivalTime: `${datePrefix}T20:30:00Z`,
        durationMinutes: 90,
        stops: 0,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 1650000 * passengers,
        },
      },
    ];

    return flightCatalog;
  }

  /**
   * Search domestic accommodations
   */
  async searchHotels({ city, checkIn, checkOut, guests = 2, rooms = 1 }) {
    const normalizedCity = city.toLowerCase().replace(/\s+/g, '');

    const hotels = [
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Vinpearl Resort & Spa Da Nang',
        city: 'DaNang',
        address: '23 Truong Sa, Hoa Hai, Ngu Hanh Son, Da Nang',
        starRating: 5,
        reviewScore: 9.3,
        pricePerNight: 2800000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Novotel Danang Premier Han River',
        city: 'DaNang',
        address: '36 Bach Dang, Thach Thang, Hai Chau, Da Nang',
        starRating: 4,
        reviewScore: 8.8,
        pricePerNight: 1750000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Haian Beach Hotel & Spa',
        city: 'DaNang',
        address: '278 Vo Nguyen Giap, My An, Ngu Hanh Son, Da Nang',
        starRating: 4,
        reviewScore: 8.9,
        pricePerNight: 1200000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'InterContinental Danang Sun Peninsula Resort',
        city: 'DaNang',
        address: 'Bai Bac, Son Tra Peninsula, Da Nang',
        starRating: 5,
        reviewScore: 9.6,
        pricePerNight: 8500000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600',
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'A La Carte Danang Beach',
        city: 'DaNang',
        address: '200 Vo Nguyen Giap, Phuoc My, Son Tra, Da Nang',
        starRating: 4,
        reviewScore: 8.5,
        pricePerNight: 1450000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
      },
    ];

    return hotels;
  }
}

module.exports = new MockBookingProvider();

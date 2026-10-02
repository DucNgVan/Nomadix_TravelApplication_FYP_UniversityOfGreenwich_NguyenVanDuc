const crypto = require('crypto');

/**
 * Normalizer & Deduplication Service for Heterogeneous Booking Data
 */
class NormalizerService {
  /**
   * Normalize raw flight offer to UnifiedFlight schema
   */
  normalizeFlight(raw) {
    let durationMinutes = raw.durationMinutes;
    if (typeof durationMinutes !== 'number' && typeof raw.duration === 'string') {
      const hoursMatch = raw.duration.match(/(\d+)H/);
      const minsMatch = raw.duration.match(/(\d+)M/);
      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
      durationMinutes = hours * 60 + mins;
    }

    return {
      id: raw.id || crypto.randomUUID(),
      provider: raw.provider || 'UNKNOWN',
      airlineCode: (raw.airlineCode || 'VN').toUpperCase(),
      airlineName: raw.airlineName || 'Airline Partner',
      flightNumber: raw.flightNumber || 'VN-000',
      origin: (raw.origin || '').toUpperCase(),
      destination: (raw.destination || '').toUpperCase(),
      departureTime: raw.departureTime,
      arrivalTime: raw.arrivalTime,
      durationMinutes: durationMinutes || 90,
      stops: typeof raw.stops === 'number' ? raw.stops : 0,
      cabinClass: (raw.cabinClass || 'ECONOMY').toUpperCase(),
      price: {
        currency: 'VND',
        amount: Math.round(raw.price?.amount || 0),
      },
    };
  }

  /**
   * Deduplicate identical flights across multiple providers, favoring lowest price
   * Deduplication key: `${airlineCode}_${flightNumber}_${departureTimeUTC}`
   */
  deduplicateFlights(flights) {
    const flightMap = new Map();

    for (const flight of flights) {
      const key = `${flight.airlineCode}_${flight.flightNumber}_${flight.departureTime}`;
      const existing = flightMap.get(key);

      if (!existing || flight.price.amount < existing.price.amount) {
        flightMap.set(key, flight);
      }
    }

    return Array.from(flightMap.values());
  }

  /**
   * Normalize raw hotel listing to UnifiedHotel schema
   */
  normalizeHotel(raw, nights = 1) {
    const pricePerNight = Math.round(raw.pricePerNight || 0);
    const calculatedNights = Math.max(1, nights);

    return {
      id: raw.id || crypto.randomUUID(),
      provider: raw.provider || 'HOTEL_PROVIDER',
      name: raw.name,
      city: raw.city,
      address: raw.address,
      starRating: raw.starRating || 3,
      reviewScore: raw.reviewScore || 8.0,
      pricePerNight,
      currency: 'VND',
      thumbnailUrl: raw.thumbnailUrl || null,
      nights: calculatedNights,
      totalPrice: pricePerNight * calculatedNights,
    };
  }
}

module.exports = new NormalizerService();

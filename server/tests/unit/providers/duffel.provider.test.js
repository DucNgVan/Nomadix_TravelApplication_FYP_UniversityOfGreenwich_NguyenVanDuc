const duffelProvider = require('../../../src/providers/duffel.provider');

describe('Unit Test: DuffelProvider', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('should throw error if DUFFEL_API_TOKEN is empty', async () => {
    const DuffelProviderClass = duffelProvider.constructor;
    const providerWithoutToken = new DuffelProviderClass('');

    await expect(
      providerWithoutToken.searchFlights({
        origin: 'HAN',
        destination: 'DAD',
        departureDate: '2026-11-20',
      })
    ).rejects.toThrow('DUFFEL_API_TOKEN is not configured');
  });

  test('should parse and map Duffel offers correctly on successful API response', async () => {
    const mockOfferResponse = {
      data: {
        offers: [
          {
            id: 'off_001',
            owner: { iata_code: 'VN', name: 'Vietnam Airlines' },
            total_amount: '50.00',
            total_currency: 'USD',
            cabin_class: 'ECONOMY',
            slices: [
              {
                duration: 'PT1H30M',
                departure_date: '2026-11-20',
                segments: [
                  {
                    operating_carrier: { iata_code: 'VN' },
                    operating_carrier_flight_number: '128',
                    departing_at: '2026-11-20T08:00:00Z',
                    arriving_at: '2026-11-20T09:30:00Z',
                  },
                ],
              },
            ],
          },
          {
            id: 'off_002',
            owner: { iata_code: 'VJ', name: 'Vietjet Air' },
            total_amount: '40.00',
            total_currency: 'EUR',
            cabin_class: 'ECONOMY',
            slices: [
              {
                duration: 'PT2H00M',
                departure_date: '2026-11-20',
                segments: [
                  {
                    operating_carrier: { iata_code: 'VJ' },
                    operating_carrier_flight_number: '502',
                    departing_at: '2026-11-20T10:00:00Z',
                    arriving_at: '2026-11-20T12:00:00Z',
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockOfferResponse),
    });

    const DuffelProviderClass = duffelProvider.constructor;
    const provider = new DuffelProviderClass('mock_test_token');

    const flights = await provider.searchFlights({
      origin: 'HAN',
      destination: 'DAD',
      departureDate: '2026-11-20',
      passengers: 1,
      cabinClass: 'ECONOMY',
    });

    expect(flights).toHaveLength(2);
    expect(flights[0].provider).toBe('DUFFEL');
    expect(flights[0].flightNumber).toBe('VN-128');
    expect(flights[0].durationMinutes).toBe(90);
    expect(flights[0].price.currency).toBe('VND');
    expect(flights[0].price.amount).toBe(1250000); // 50 * 25000

    expect(flights[1].durationMinutes).toBe(120);
    expect(flights[1].price.amount).toBe(1080000); // 40 * 27000
  });

  test('should throw error when Duffel API returns non-200 HTTP status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue('{"errors":[{"message":"Unauthorized"}]}'),
    });

    const DuffelProviderClass = duffelProvider.constructor;
    const provider = new DuffelProviderClass('invalid_token');

    await expect(
      provider.searchFlights({
        origin: 'HAN',
        destination: 'DAD',
        departureDate: '2026-11-20',
      })
    ).rejects.toThrow(/Duffel Flight API returned 401/);
  });

  test('should return empty array when Duffel returns empty offers', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: {} }),
    });

    const DuffelProviderClass = duffelProvider.constructor;
    const provider = new DuffelProviderClass('mock_token');

    const result = await provider.searchFlights({
      origin: 'HAN',
      destination: 'DAD',
      departureDate: '2026-11-20',
    });

    expect(result).toEqual([]);
  });
});

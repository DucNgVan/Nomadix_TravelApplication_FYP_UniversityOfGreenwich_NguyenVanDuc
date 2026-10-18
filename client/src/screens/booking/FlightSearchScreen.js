import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FlightCard from '../../components/booking/FlightCard';
import FlightDetailModal from '../../components/booking/FlightDetailModal';
import FlightFilterModal from '../../components/booking/FlightFilterModal';
import SandboxBookingModal from '../../components/booking/SandboxBookingModal';
import CalendarPickerModal from '../../components/common/CalendarPickerModal';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';
import { resolveAirportCode } from '../../utils/airport.util';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const QUICK_ROUTES = [
  { label: 'SGN → HAN', origin: 'SGN', dest: 'HAN' },
  { label: 'HAN → DAD', origin: 'HAN', dest: 'DAD' },
  { label: 'SGN → DAD', origin: 'SGN', dest: 'DAD' },
  { label: 'HAN → PQC', origin: 'HAN', dest: 'PQC' },
];

const TRENDING_DEALS = [
  {
    id: 'deal-1',
    city: 'Da Nang',
    route: 'SGN → DAD',
    origin: 'SGN',
    destination: 'DAD',
    duration: '1h 20m',
    price: '₫690,000',
    tag: '-25%',
    tagColor: '#30D158',
    emoji: '🏖️',
  },
  {
    id: 'deal-2',
    city: 'Bangkok',
    route: 'SGN → BKK',
    origin: 'SGN',
    destination: 'BKK',
    duration: '1h 35m',
    price: '₫1,250,000',
    tag: 'Hot Deal',
    tagColor: '#007AFF',
    emoji: '🛕',
  },
  {
    id: 'deal-3',
    city: 'Phu Quoc',
    route: 'HAN → PQC',
    origin: 'HAN',
    destination: 'PQC',
    duration: '2h 10m',
    price: '₫890,000',
    tag: 'Island',
    tagColor: '#FF9500',
    emoji: '🏝️',
  },
  {
    id: 'deal-4',
    city: 'Tokyo',
    route: 'SGN → NRT',
    origin: 'SGN',
    destination: 'NRT',
    duration: '5h 45m',
    price: '₫3,420,000',
    tag: 'Japan',
    tagColor: '#AF52DE',
    emoji: '⛩️',
  },
];

export default function FlightSearchScreen({ navigation }) {
  const { mode, colors: themeColors } = useThemeStore();
  const [tripType, setTripType] = useState('one_way'); // 'one_way' | 'round_trip'
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calendar Picker Modals
  const [isDeparturePickerVisible, setIsDeparturePickerVisible] = useState(false);
  const [isReturnPickerVisible, setIsReturnPickerVisible] = useState(false);

  // Filter & Booking Modal states
  const [prefDirect, setPrefDirect] = useState(true);
  const [prefTransit, setPrefTransit] = useState(true);
  const [prefBaggage, setPrefBaggage] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState('all'); // 'all' | 'direct' | 'transit' | 'baggage' | 'cheap' | 'early' | 'late'
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedDetailFlight, setSelectedDetailFlight] = useState(null);
  const [flightToBook, setFlightToBook] = useState(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    sortBy: 'price',
    showDirect: true,
    showTransit: true,
    hasBaggage: false,
    maxPrice: 10000000,
  });

  const { flights, isLoadingFlights, flightError, searchFlights, selectFlight } = useBookingStore();

  const handleSearch = async () => {
    setValidationError('');

    const cleanOrigin = resolveAirportCode(origin);
    const cleanDest = resolveAirportCode(destination);
    const cleanDate = departureDate.trim();

    if (!origin.trim() || !destination.trim() || !cleanDate) {
      setValidationError('Please enter origin, destination, and departure date');
      return;
    }

    if (cleanOrigin === cleanDest) {
      setValidationError('Origin and destination cannot be identical');
      return;
    }

    if (tripType === 'round_trip' && !returnDate.trim()) {
      setValidationError('Please select a return date');
      return;
    }

    try {
      await searchFlights({
        origin: cleanOrigin,
        destination: cleanDest,
        departureDate: cleanDate,
        returnDate: tripType === 'round_trip' ? returnDate.trim() : undefined,
        passengers: 1,
      });
      setIsCollapsed(true);
    } catch {
      // Handled by store flightError
    }
  };

  const handleSelectFlight = (flight) => {
    selectFlight?.(flight);
    setSelectedDetailFlight(flight);
    if (navigation?.navigate) {
      navigation.navigate('FlightDetails', { flightId: flight.id });
    }
  };

  const handleSelectTrendingDeal = (deal) => {
    setOrigin(deal.origin);
    setDestination(deal.destination);
    if (!departureDate) {
      setDepartureDate('2026-11-15');
    }
    setValidationError('');
  };

  // Filter and sort flights
  const filteredFlights = (flights || []).filter((flight) => {
    // Search form preferences
    if (!prefDirect && flight.stops === 0) return false;
    if (!prefTransit && flight.stops > 0) return false;
    const hasCheckedBag = (flight.baggages && flight.baggages.some((b) => b.type === 'checked')) ||
      (flight.baggageSummary && (flight.baggageSummary.toLowerCase().includes('checked') || flight.baggageSummary.toLowerCase().includes('ký gửi')));
    if (prefBaggage && !hasCheckedBag) return false;

    // Quick filter bar logic
    if (activeQuickFilter === 'direct' && flight.stops > 0) return false;
    if (activeQuickFilter === 'transit' && flight.stops === 0) return false;
    if (activeQuickFilter === 'baggage' && !hasCheckedBag) return false;
    if (activeQuickFilter === 'early') {
      const depHour = flight.departureTime ? parseInt(flight.departureTime.slice(11, 13), 10) : 8;
      if (depHour >= 12) return false;
    }
    if (activeQuickFilter === 'late') {
      const depHour = flight.departureTime ? parseInt(flight.departureTime.slice(11, 13), 10) : 14;
      if (depHour < 12) return false;
    }

    // Modal filter logic
    if (!modalFilters.showDirect && flight.stops === 0) return false;
    if (!modalFilters.showTransit && flight.stops > 0) return false;
    if (modalFilters.hasBaggage && !hasCheckedBag) return false;
    if (modalFilters.maxPrice && flight.price?.amount > modalFilters.maxPrice) return false;

    return true;
  }).sort((a, b) => {
    const sortBy = activeQuickFilter === 'cheap' ? 'price' : modalFilters.sortBy;
    if (sortBy === 'price') {
      return (a.price?.amount || 0) - (b.price?.amount || 0);
    }
    if (sortBy === 'duration') {
      return (a.durationMinutes || 0) - (b.durationMinutes || 0);
    }
    if (sortBy === 'departure_early' || sortBy === 'time' || sortBy === 'departure' || activeQuickFilter === 'early') {
      return new Date(a.departureTime || 0) - new Date(b.departureTime || 0);
    }
    if (sortBy === 'departure_late' || activeQuickFilter === 'late') {
      return new Date(b.departureTime || 0) - new Date(a.departureTime || 0);
    }
    return 0;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View testID="flight-search-container" style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Header Subtitle */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>Smart flight search & best deal comparison</Text>
        </View>

        {/* Collapsible Search Panel */}
        {isCollapsed ? (
          <TouchableOpacity
            style={[styles.collapsedBar, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => setIsCollapsed(false)}
            activeOpacity={0.8}
          >
            <View style={styles.collapsedInfo}>
              <Text style={[styles.collapsedRoute, { color: themeColors.text }]}>
                ✈ {origin} → {destination}
              </Text>
              <Text style={[styles.collapsedDates, { color: themeColors.textMuted }]}>
                {departureDate} {returnDate ? `• Ret ${returnDate}` : ''} • {tripType === 'round_trip' ? 'Round-trip' : 'One-way'} • 1 passenger
              </Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.searchBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            {/* Trip Type Selector: One-way / Round-trip */}
            <View style={[styles.tripTypeRow, { backgroundColor: mode === 'light' ? '#EBF5FF' : 'rgba(255, 255, 255, 0.06)' }]}>
              <TouchableOpacity
                style={[styles.tripTypeBtn, tripType === 'one_way' && styles.tripTypeBtnActive]}
                onPress={() => setTripType('one_way')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tripTypeText, { color: mode === 'light' ? '#64748B' : '#94A3B8' }, tripType === 'one_way' && styles.tripTypeTextActive]}>
                  One-way
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tripTypeBtn, tripType === 'round_trip' && styles.tripTypeBtnActive]}
                onPress={() => setTripType('round_trip')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tripTypeText, { color: mode === 'light' ? '#64748B' : '#94A3B8' }, tripType === 'round_trip' && styles.tripTypeTextActive]}>
                  Round-trip
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Route Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {QUICK_ROUTES.map((route) => (
                <TouchableOpacity
                  key={route.label}
                  style={[
                    styles.routeChip,
                    {
                      backgroundColor: mode === 'light' ? '#F0F6FF' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: themeColors.border,
                    },
                    origin === route.origin && destination === route.dest && styles.routeChipActive,
                  ]}
                  onPress={() => {
                    setOrigin(route.origin);
                    setDestination(route.dest);
                    if (!departureDate) setDepartureDate('2026-10-15');
                    setValidationError('');
                  }}
                >
                  <Text
                    style={[
                      styles.routeChipText,
                      { color: themeColors.textMuted },
                      origin === route.origin && destination === route.dest && styles.routeChipTextActive,
                    ]}
                  >
                    {route.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Airports: City or IATA */}
            <View style={styles.airportsRow}>
              <View style={styles.airportCol}>
                <Input
                  label="Origin (IATA or City)"
                  placeholder="e.g. SGN or Ho Chi Minh"
                  value={origin}
                  onChangeText={(text) => {
                    setOrigin(text);
                    setValidationError('');
                  }}
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.airportCol}>
                <Input
                  label="Destination (IATA or City)"
                  placeholder="e.g. HAN or Hanoi"
                  value={destination}
                  onChangeText={(text) => {
                    setDestination(text);
                    setValidationError('');
                  }}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Departure & Return Date Pickers (Interactive Calendar) */}
            <View style={styles.datesRow}>
              <View style={styles.dateCol}>
                <TouchableOpacity
                  testID="date-picker-trigger-departure"
                  onPress={() => setIsDeparturePickerVisible(true)}
                  activeOpacity={0.8}
                >
                  <Input
                    label="Departure Date"
                    placeholder="e.g. 2026-11-01 (YYYY-MM-DD)"
                    value={departureDate}
                    onChangeText={(text) => {
                      setDepartureDate(text);
                      setValidationError('');
                    }}
                  />
                </TouchableOpacity>
              </View>

              {tripType === 'round_trip' && (
                <View style={styles.dateCol}>
                  <TouchableOpacity
                    testID="date-picker-trigger-return"
                    onPress={() => setIsReturnPickerVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Input
                      label="Return Date"
                      placeholder="e.g. Return Date (YYYY-MM-DD)"
                      value={returnDate}
                      onChangeText={(text) => {
                        setReturnDate(text);
                        setValidationError('');
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Search Preferences Toggles (Direct, Transit, Baggage) */}
            <View style={styles.preferencesRow}>
              <TouchableOpacity
                testID="pref-checkbox-direct"
                style={[
                  styles.prefChip,
                  { borderColor: themeColors.border, backgroundColor: mode === 'light' ? '#F8FAFC' : 'rgba(255, 255, 255, 0.05)' },
                  prefDirect && styles.prefChipActive,
                ]}
                onPress={() => setPrefDirect(!prefDirect)}
                activeOpacity={0.8}
              >
                <Text style={[styles.prefCheck, prefDirect && styles.prefCheckActive]}>
                  {prefDirect ? '✓' : ''}
                </Text>
                <Text style={[styles.prefText, { color: themeColors.text }]}>Direct Flights</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="pref-checkbox-transit"
                style={[
                  styles.prefChip,
                  { borderColor: themeColors.border, backgroundColor: mode === 'light' ? '#F8FAFC' : 'rgba(255, 255, 255, 0.05)' },
                  prefTransit && styles.prefChipActive,
                ]}
                onPress={() => setPrefTransit(!prefTransit)}
                activeOpacity={0.8}
              >
                <Text style={[styles.prefCheck, prefTransit && styles.prefCheckActive]}>
                  {prefTransit ? '✓' : ''}
                </Text>
                <Text style={[styles.prefText, { color: themeColors.text }]}>Connecting</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="pref-checkbox-baggage"
                style={[
                  styles.prefChip,
                  { borderColor: themeColors.border, backgroundColor: mode === 'light' ? '#F8FAFC' : 'rgba(255, 255, 255, 0.05)' },
                  prefBaggage && styles.prefChipActive,
                ]}
                onPress={() => setPrefBaggage(!prefBaggage)}
                activeOpacity={0.8}
              >
                <Text style={[styles.prefCheck, prefBaggage && styles.prefCheckActive]}>
                  {prefBaggage ? '✓' : ''}
                </Text>
                <Text style={[styles.prefText, { color: themeColors.text }]}>With Baggage</Text>
              </TouchableOpacity>
            </View>

            {validationError ? (
              <Text style={styles.validationErrorText}>{validationError}</Text>
            ) : null}

            {flightError ? (
              <Text style={styles.validationErrorText}>{flightError}</Text>
            ) : null}

            <Button
              title="Search Flights"
              onPress={handleSearch}
              loading={isLoadingFlights}
              style={styles.searchButton}
            />
          </View>
        )}

        {/* Quick Filter Row & Filter Button */}
        {flights.length > 0 && !isLoadingFlights && (
          <View style={styles.filterSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFilterScroll}>
              <TouchableOpacity
                style={[
                  styles.quickFilterChip,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                  activeQuickFilter === 'all' && styles.quickFilterChipActive,
                ]}
                onPress={() => setActiveQuickFilter('all')}
                testID="quick-filter-all"
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    { color: themeColors.text },
                    activeQuickFilter === 'all' && styles.quickFilterTextActive,
                  ]}
                >
                  All ({flights.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quickFilterChip,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                  activeQuickFilter === 'direct' && styles.quickFilterChipActive,
                ]}
                onPress={() => setActiveQuickFilter('direct')}
                testID="quick-filter-direct"
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    { color: themeColors.text },
                    activeQuickFilter === 'direct' && styles.quickFilterTextActive,
                  ]}
                >
                  Direct
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quickFilterChip,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                  activeQuickFilter === 'transit' && styles.quickFilterChipActive,
                ]}
                onPress={() => setActiveQuickFilter('transit')}
                testID="quick-filter-transit"
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    { color: themeColors.text },
                    activeQuickFilter === 'transit' && styles.quickFilterTextActive,
                  ]}
                >
                  Connecting
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quickFilterChip,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                  activeQuickFilter === 'baggage' && styles.quickFilterChipActive,
                ]}
                onPress={() => setActiveQuickFilter('baggage')}
                testID="quick-filter-baggage"
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    { color: themeColors.text },
                    activeQuickFilter === 'baggage' && styles.quickFilterTextActive,
                  ]}
                >
                  🧳 With Baggage
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quickFilterChip,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                  activeQuickFilter === 'cheap' && styles.quickFilterChipActive,
                ]}
                onPress={() => setActiveQuickFilter('cheap')}
                testID="quick-filter-cheap"
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    { color: themeColors.text },
                    activeQuickFilter === 'cheap' && styles.quickFilterTextActive,
                  ]}
                >
                  🏷 Cheapest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quickFilterChip,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                  activeQuickFilter === 'early' && styles.quickFilterChipActive,
                ]}
                onPress={() => setActiveQuickFilter('early')}
                testID="quick-filter-early"
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    { color: themeColors.text },
                    activeQuickFilter === 'early' && styles.quickFilterTextActive,
                  ]}
                >
                  🌅 Early Flight
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quickFilterChip,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                  activeQuickFilter === 'late' && styles.quickFilterChipActive,
                ]}
                onPress={() => setActiveQuickFilter('late')}
                testID="quick-filter-late"
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    { color: themeColors.text },
                    activeQuickFilter === 'late' && styles.quickFilterTextActive,
                  ]}
                >
                  🌙 Late Flight
                </Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.filterModalButton,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
              ]}
              onPress={() => setIsFilterVisible(true)}
              testID="open-flight-filter-btn"
            >
              <Text style={[styles.filterModalButtonText, { color: themeColors.text }]}>Filters ⚙</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Results List */}
        {isLoadingFlights ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Searching for the best flight offers...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredFlights}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FlightCard
                flight={item}
                onSelect={handleSelectFlight}
                testID={`flight-card-${item.id}`}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              filteredFlights.length === 0 && !isLoadingFlights ? (
                flights.length > 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
                      No flights matching your filter criteria
                    </Text>
                  </View>
                ) : (
                  <View style={styles.enrichedEmptyContainer}>
                    <Text style={[styles.emptyPromptText, { color: themeColors.textMuted }]}>
                      Enter your route to search for best flight deals, or tap a trending route below:
                    </Text>

                    {/* Trending Flight Deals Section */}
                    <View style={styles.trendingSection}>
                      <View style={styles.trendingHeaderRow}>
                        <View style={styles.trendingTitleGroup}>
                          <Text style={styles.trendingFireIcon}>🔥</Text>
                          <Text style={[styles.trendingTitle, { color: themeColors.text }]}>
                            Trending Flight Deals
                          </Text>
                        </View>
                        <Text style={[styles.trendingExploreLink, { color: themeColors.primary }]}>
                          Explore All ›
                        </Text>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.trendingScroll}
                        contentContainerStyle={styles.trendingScrollContent}
                      >
                        {TRENDING_DEALS.map((deal) => (
                          <TouchableOpacity
                            key={deal.id}
                            style={[
                              styles.trendingCard,
                              {
                                backgroundColor: themeColors.card,
                                borderColor: themeColors.border,
                              },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleSelectTrendingDeal(deal)}
                          >
                            <View style={styles.trendingCardTop}>
                              <Text style={[styles.trendingCity, { color: themeColors.text }]}>
                                {deal.emoji} {deal.city}
                              </Text>
                              <View style={[styles.dealTag, { backgroundColor: `${deal.tagColor}20` }]}>
                                <Text style={[styles.dealTagText, { color: deal.tagColor }]}>
                                  {deal.tag}
                                </Text>
                              </View>
                            </View>

                            <Text style={[styles.trendingRoute, { color: themeColors.textMuted }]}>
                              {deal.route} • {deal.duration}
                            </Text>

                            <View style={[styles.trendingCardFooter, { borderTopColor: themeColors.border }]}>
                              <Text style={[styles.trendingPriceLabel, { color: themeColors.textMuted }]}>From</Text>
                              <Text style={[styles.trendingPriceValue, { color: themeColors.primary }]}>
                                {deal.price}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Nomadix Travel Guarantee Banner */}
                    <View
                      style={[
                        styles.guaranteeCard,
                        {
                          backgroundColor: mode === 'light' ? '#EBF5FF' : '#1A233A',
                          borderColor: mode === 'light' ? '#DCE8F6' : '#2A3B5C',
                        },
                      ]}
                    >
                      <View style={styles.guaranteeHeader}>
                        <Text style={styles.guaranteeIcon}>🛡️</Text>
                        <View style={styles.guaranteeTextGroup}>
                          <Text style={[styles.guaranteeTitle, { color: themeColors.text }]}>
                            Nomadix Flight Guarantee
                          </Text>
                          <Text style={[styles.guaranteeSub, { color: themeColors.textMuted }]}>
                            Live Duffel Global GDS pricing with zero hidden fees
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.guaranteePillarsRow, { borderTopColor: mode === 'light' ? '#DCE8F6' : '#2A3B5C' }]}>
                        <View style={[styles.pillarBox, { backgroundColor: mode === 'light' ? '#FFFFFF' : '#131C2E' }]}>
                          <Text style={styles.pillarNumber}>⚡ 100%</Text>
                          <Text style={[styles.pillarLabel, { color: themeColors.textMuted }]}>Real-time GDS</Text>
                        </View>
                        <View style={[styles.pillarBox, { backgroundColor: mode === 'light' ? '#FFFFFF' : '#131C2E' }]}>
                          <Text style={styles.pillarNumber}>🛡️ Free 24h</Text>
                          <Text style={[styles.pillarLabel, { color: themeColors.textMuted }]}>Hold & Review</Text>
                        </View>
                        <View style={[styles.pillarBox, { backgroundColor: mode === 'light' ? '#FFFFFF' : '#131C2E' }]}>
                          <Text style={styles.pillarNumber}>🧳 20kg</Text>
                          <Text style={[styles.pillarLabel, { color: themeColors.textMuted }]}>Bag Compare</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              ) : null
            }
          />
        )}

        {/* Calendar Picker Modals */}
        <CalendarPickerModal
          visible={isDeparturePickerVisible}
          selectedDate={departureDate || '2026-10-15'}
          onSelectDate={(date) => {
            setDepartureDate(date);
            setValidationError('');
          }}
          onClose={() => setIsDeparturePickerVisible(false)}
          title="Select Departure Date"
          minDate={new Date().toISOString().split('T')[0]}
        />

        <CalendarPickerModal
          visible={isReturnPickerVisible}
          selectedDate={returnDate || departureDate || '2026-10-20'}
          onSelectDate={(date) => {
            setReturnDate(date);
            setValidationError('');
          }}
          onClose={() => setIsReturnPickerVisible(false)}
          title="Select Return Date"
          minDate={departureDate}
        />

        {/* Modals */}
        <FlightDetailModal
          visible={!!selectedDetailFlight}
          flight={selectedDetailFlight}
          onClose={() => setSelectedDetailFlight(null)}
          onBook={(fl) => {
            setSelectedDetailFlight(null);
            setFlightToBook(fl);
            setIsCheckoutVisible(true);
          }}
        />

        <FlightFilterModal
          visible={isFilterVisible}
          filters={modalFilters}
          onClose={() => setIsFilterVisible(false)}
          onApply={(newFilters) => {
            setModalFilters(newFilters);
            setIsFilterVisible(false);
          }}
          onReset={() => {
            setModalFilters({
              sortBy: 'price',
              showDirect: true,
              showTransit: true,
              airlines: { VJ: true, VN: true, SQ: true },
              maxPrice: 7000000,
            });
          }}
        />

        <SandboxBookingModal
          visible={isCheckoutVisible}
          flight={flightToBook}
          onClose={() => {
            setIsCheckoutVisible(false);
            setFlightToBook(null);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  tripTypeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  tripTypeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tripTypeBtnActive: {
    backgroundColor: colors.primary,
  },
  tripTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tripTypeTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  collapsedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  collapsedInfo: {
    flex: 1,
  },
  collapsedRoute: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  collapsedDates: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  editBadge: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  searchBox: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  chipsScroll: {
    marginBottom: 10,
  },
  routeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  routeChipActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
    borderColor: colors.primary,
  },
  routeChipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  routeChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  airportsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  airportCol: {
    flex: 1,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateCol: {
    flex: 1,
  },
  preferencesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  prefChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  prefChipActive: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
  },
  prefCheck: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#94A3B8',
    textAlign: 'center',
    lineHeight: 14,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  prefCheckActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  prefText: {
    fontSize: 11,
    fontWeight: '700',
  },
  validationErrorText: {
    ...typography.caption,
    color: colors.error,
    marginVertical: 4,
    textAlign: 'center',
  },
  searchButton: {
    marginTop: 6,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  quickFilterScroll: {
    flex: 1,
  },
  quickFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickFilterChipActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    borderColor: colors.primary,
  },
  quickFilterText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  quickFilterTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  filterModalButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterModalButtonText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  enrichedEmptyContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyPromptText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  trendingSection: {
    marginBottom: 20,
  },
  trendingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendingFireIcon: {
    fontSize: 14,
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendingExploreLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendingScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  trendingScrollContent: {
    paddingRight: 16,
    gap: 10,
  },
  trendingCard: {
    width: 175,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  trendingCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  trendingCity: {
    fontSize: 13,
    fontWeight: '800',
  },
  dealTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dealTagText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  trendingRoute: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
  },
  trendingCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  trendingPriceLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  trendingPriceValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  guaranteeCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  guaranteeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  guaranteeIcon: {
    fontSize: 22,
  },
  guaranteeTextGroup: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  guaranteeSub: {
    fontSize: 11,
    marginTop: 1,
  },
  guaranteePillarsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  pillarBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  pillarNumber: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0A84FF',
  },
  pillarLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
});

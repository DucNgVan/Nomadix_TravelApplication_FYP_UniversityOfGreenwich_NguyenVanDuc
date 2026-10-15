import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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
      setValidationError('Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày khởi hành');
      return;
    }

    if (cleanOrigin === cleanDest) {
      setValidationError('Điểm đi và điểm đến không được trùng nhau');
      return;
    }

    if (tripType === 'round_trip' && !returnDate.trim()) {
      setValidationError('Vui lòng chọn ngày về cho hành trình khứ hồi');
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

  // Filter and sort flights
  const filteredFlights = (flights || []).filter((flight) => {
    // Search form preferences
    if (!prefDirect && flight.stops === 0) return false;
    if (!prefTransit && flight.stops > 0) return false;
    const hasCheckedBag = (flight.baggages && flight.baggages.some((b) => b.type === 'checked')) ||
      (flight.baggageSummary && flight.baggageSummary.toLowerCase().includes('ký gửi'));
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Tìm vé máy bay</Text>
          <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>So sánh giá vé thông minh khắp Việt Nam</Text>
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
                {departureDate} {returnDate ? `• Về ${returnDate}` : ''} • {tripType === 'round_trip' ? 'Khứ hồi' : 'Một chiều'} • 1 khách
              </Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editText}>Thay đổi</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.searchBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            {/* Trip Type Selector: Một chiều / Khứ hồi */}
            <View style={[styles.tripTypeRow, { backgroundColor: mode === 'light' ? '#EBF5FF' : 'rgba(255, 255, 255, 0.06)' }]}>
              <TouchableOpacity
                style={[styles.tripTypeBtn, tripType === 'one_way' && styles.tripTypeBtnActive]}
                onPress={() => setTripType('one_way')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tripTypeText, { color: mode === 'light' ? '#64748B' : '#94A3B8' }, tripType === 'one_way' && styles.tripTypeTextActive]}>
                  Một chiều
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tripTypeBtn, tripType === 'round_trip' && styles.tripTypeBtnActive]}
                onPress={() => setTripType('round_trip')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tripTypeText, { color: mode === 'light' ? '#64748B' : '#94A3B8' }, tripType === 'round_trip' && styles.tripTypeTextActive]}>
                  Khứ hồi
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
                  label="Điểm đi (Mã IATA)"
                  placeholder="Điểm đi (VD: SGN)"
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
                  label="Điểm đến (Mã IATA)"
                  placeholder="Điểm đến (VD: HAN)"
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
                    label="Ngày khởi hành"
                    placeholder="Ngày đi (YYYY-MM-DD)"
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
                      label="Ngày về"
                      placeholder="Ngày về (YYYY-MM-DD)"
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

            {/* Search Preferences Toggles (Bay thẳng, Nối chuyến, Có hành lý) */}
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
                <Text style={[styles.prefText, { color: themeColors.text }]}>Bay thẳng</Text>
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
                <Text style={[styles.prefText, { color: themeColors.text }]}>Nối chuyến</Text>
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
                <Text style={[styles.prefText, { color: themeColors.text }]}>Có hành lý</Text>
              </TouchableOpacity>
            </View>

            {validationError ? (
              <Text style={styles.validationErrorText}>{validationError}</Text>
            ) : null}

            {flightError ? (
              <Text style={styles.validationErrorText}>{flightError}</Text>
            ) : null}

            <Button
              title="Tìm chuyến bay"
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
                  Tất cả ({flights.length})
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
                  Bay thẳng
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
                  Nối chuyến
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
                  🧳 Hành lý nhiều
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
                  🏷 Giá rẻ
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
                  🌅 Bay sớm
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
                  🌙 Bay muộn
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
              <Text style={[styles.filterModalButtonText, { color: themeColors.text }]}>Bộ lọc ⚙</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Results List */}
        {isLoadingFlights ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tìm chuyến bay tốt nhất...</Text>
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
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {flights.length > 0
                      ? 'Không tìm thấy chuyến bay phù hợp với bộ lọc đã chọn'
                      : 'Nhập hành trình để khám phá giá vé ưu đãi'}
                  </Text>
                </View>
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
          title="Chọn ngày khởi hành"
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
          title="Chọn ngày về"
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
});

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
import { useBookingStore } from '../../stores/booking.store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const QUICK_ROUTES = [
  { label: 'SGN → HAN', origin: 'SGN', dest: 'HAN' },
  { label: 'HAN → DAD', origin: 'HAN', dest: 'DAD' },
  { label: 'SGN → DAD', origin: 'SGN', dest: 'DAD' },
  { label: 'HAN → PQC', origin: 'HAN', dest: 'PQC' },
];

export default function FlightSearchScreen({ navigation }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { flights, isLoadingFlights, flightError, searchFlights, selectFlight } = useBookingStore();

  const handleSearch = async () => {
    setValidationError('');

    const cleanOrigin = origin.trim().toUpperCase();
    const cleanDest = destination.trim().toUpperCase();
    const cleanDate = departureDate.trim();

    if (!cleanOrigin || !cleanDest || !cleanDate) {
      setValidationError('Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày khởi hành');
      return;
    }

    if (cleanOrigin === cleanDest) {
      setValidationError('Điểm đi và điểm đến không được trùng nhau');
      return;
    }

    try {
      await searchFlights({
        origin: cleanOrigin,
        destination: cleanDest,
        departureDate: cleanDate,
        passengers: 1,
      });
      setIsCollapsed(true);
    } catch {
      // Handled by store flightError
    }
  };

  const handleSelectFlight = (flight) => {
    selectFlight?.(flight);
    if (navigation?.navigate) {
      navigation.navigate('FlightDetails', { flightId: flight.id });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tìm vé máy bay</Text>
          <Text style={styles.subtitle}>So sánh giá vé thông minh khắp Việt Nam</Text>
        </View>

        {/* Collapsible Search Panel */}
        {isCollapsed ? (
          <TouchableOpacity
            style={styles.collapsedBar}
            onPress={() => setIsCollapsed(false)}
            activeOpacity={0.8}
          >
            <View style={styles.collapsedInfo}>
              <Text style={styles.collapsedRoute}>
                ✈ {origin} → {destination}
              </Text>
              <Text style={styles.collapsedDates}>
                {departureDate} • 1 khách • Phổ thông
              </Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editText}>Thay đổi</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.searchBox}>
            {/* Quick Route Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {QUICK_ROUTES.map((route) => (
                <TouchableOpacity
                  key={route.label}
                  style={[
                    styles.routeChip,
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
                      origin === route.origin && destination === route.dest && styles.routeChipTextActive,
                    ]}
                  >
                    {route.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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

            <Input
              label="Ngày khởi hành"
              placeholder="Ngày đi (YYYY-MM-DD)"
              value={departureDate}
              onChangeText={(text) => {
                setDepartureDate(text);
                setValidationError('');
              }}
            />

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

        {/* Results List */}
        {isLoadingFlights ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tìm chuyến bay tốt nhất...</Text>
          </View>
        ) : (
          <FlatList
            data={flights}
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
              flights.length === 0 && !isLoadingFlights ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nhập hành trình để khám phá giá vé ưu đãi</Text>
                </View>
              ) : null
            }
          />
        )}
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
  validationErrorText: {
    ...typography.caption,
    color: colors.error,
    marginVertical: 4,
    textAlign: 'center',
  },
  searchButton: {
    marginTop: 6,
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

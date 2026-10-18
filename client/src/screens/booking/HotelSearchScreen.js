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
import HotelCard from '../../components/booking/HotelCard';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const QUICK_CITIES = ['Da Nang', 'Hoi An', 'Hanoi', 'Ho Chi Minh', 'Tokyo', 'Paris'];

const STAY_VIBES = [
  { id: 'vibe-1', label: '🏝️ Beachfront', destination: 'Da Nang' },
  { id: 'vibe-2', label: '🏔️ Mountain Escape', destination: 'Sapa' },
  { id: 'vibe-3', label: '💎 5-Star Luxury', destination: 'Tokyo' },
  { id: 'vibe-4', label: '🏮 Heritage Villa', destination: 'Hoi An' },
  { id: 'vibe-5', label: '🌿 Eco Glamping', destination: 'Da Lat' },
];

const FEATURED_STAYS = [
  {
    id: 'featured-1',
    name: 'Vinpearl Resort & Spa',
    location: 'Da Nang Bay • Oceanfront',
    rating: '★ 4.9',
    price: '1,850,000 ₫',
    destination: 'Da Nang',
    emoji: '🌊',
  },
  {
    id: 'featured-2',
    name: 'Anantara Resort & Spa',
    location: 'Hoi An Ancient River',
    rating: '★ 4.8',
    price: '2,400,000 ₫',
    destination: 'Hoi An',
    emoji: '🏮',
  },
];

export default function HotelSearchScreen({ navigation }) {
  const { mode, colors: themeColors } = useThemeStore();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { hotels, isLoadingHotels, hotelError, searchHotels, selectHotel } = useBookingStore();

  const handleSelectVibe = (vibe) => {
    setDestination(vibe.destination);
    if (!checkIn) setCheckIn('2026-11-01');
    if (!checkOut) setCheckOut('2026-11-04');
    setValidationError('');
  };

  const handleSelectFeaturedStay = (stay) => {
    setDestination(stay.destination);
    if (!checkIn) setCheckIn('2026-11-01');
    if (!checkOut) setCheckOut('2026-11-04');
    setValidationError('');
  };

  const normalizeDateInput = (str) => {
    if (!str) return '';
    const trimmed = str.trim();
    // Convert DD/MM/YYYY to YYYY-MM-DD if needed
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [d, m, y] = trimmed.split('/');
      return `${y}-${m}-${d}`;
    }
    return trimmed;
  };

  const handleSearch = async () => {
    setValidationError('');

    const cleanDest = destination.trim();
    const cleanCheckIn = normalizeDateInput(checkIn);
    const cleanCheckOut = normalizeDateInput(checkOut);

    if (!cleanDest || !cleanCheckIn || !cleanCheckOut) {
      setValidationError('Please enter all required fields');
      return;
    }

    const checkInDate = new Date(cleanCheckIn);
    const checkOutDate = new Date(cleanCheckOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      setValidationError('Invalid date format (YYYY-MM-DD)');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setValidationError('Check-out must be after check-in');
      return;
    }

    try {
      await searchHotels({
        city: cleanDest,
        destination: cleanDest,
        checkIn: cleanCheckIn,
        checkOut: cleanCheckOut,
        guests: 2,
      });
      setIsCollapsed(true);
    } catch {
      // Handled by store hotelError
    }
  };

  const handleSelectHotel = (hotel) => {
    selectHotel?.(hotel);
    if (navigation?.navigate) {
      navigation.navigate('HotelDetails', { hotelId: hotel.id });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Header Subtitle */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>Compare luxury stays, boutique hotels & resorts worldwide</Text>
        </View>

        {/* Collapsible Search Panel */}
        {isCollapsed ? (
          <TouchableOpacity
            style={[
              styles.collapsedBar,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => setIsCollapsed(false)}
            activeOpacity={0.8}
          >
            <View style={styles.collapsedInfo}>
              <Text style={[styles.collapsedCity, { color: themeColors.text }]}>⌂ {destination || 'Da Nang'}</Text>
              <Text style={[styles.collapsedDates, { color: themeColors.textMuted }]}>
                {checkIn} → {checkOut} • 2 guests
              </Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            {/* Quick City Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {QUICK_CITIES.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.cityChip,
                    {
                      backgroundColor: mode === 'light' ? '#F0F6FF' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: themeColors.border,
                    },
                    destination === city && styles.cityChipActive,
                  ]}
                  onPress={() => {
                    setDestination(city);
                    setValidationError('');
                  }}
                >
                  <Text
                    style={[
                      styles.cityChipText,
                      { color: themeColors.textMuted },
                      destination === city && styles.cityChipTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Destination City"
              placeholder="e.g. Da Nang, Tokyo (Destination city)"
              value={destination}
              onChangeText={(text) => {
                setDestination(text);
                setValidationError('');
              }}
            />

            <View style={styles.dateInputsRow}>
              <View style={styles.dateCol}>
                <Input
                  label="Check-in Date"
                  placeholder="e.g. 2026-11-01 (Check-in date)"
                  value={checkIn}
                  onChangeText={(text) => {
                    setCheckIn(text);
                    setValidationError('');
                  }}
                />
              </View>
              <View style={styles.dateCol}>
                <Input
                  label="Check-out Date"
                  placeholder="e.g. 2026-11-04 (Check-out date)"
                  value={checkOut}
                  onChangeText={(text) => {
                    setCheckOut(text);
                    setValidationError('');
                  }}
                />
              </View>
            </View>

            {validationError ? (
              <Text style={styles.validationErrorText}>{validationError}</Text>
            ) : null}

            {hotelError ? (
              <Text style={styles.validationErrorText}>{hotelError}</Text>
            ) : null}

            <Button
              title="Search Hotels"
              onPress={handleSearch}
              loading={isLoadingHotels}
              style={styles.searchButton}
            />
          </View>
        )}

        {/* Results List */}
        {isLoadingHotels ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Searching for the best hotel deals...</Text>
          </View>
        ) : (
          <FlatList
            data={hotels}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HotelCard
                hotel={item}
                onSelect={handleSelectHotel}
                testID={`hotel-card-${item.id}`}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              hotels.length === 0 && !isLoadingHotels ? (
                <View style={styles.enrichedEmptyContainer}>
                  <Text style={[styles.emptyPromptText, { color: themeColors.textMuted }]}>
                    Enter a destination above to explore ideal stays & resorts, or browse by vibe:
                  </Text>

                  {/* Explore by Vibe */}
                  <View style={styles.vibeSection}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                      Explore By Vibe
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.vibeScroll}
                      contentContainerStyle={styles.vibeScrollContent}
                    >
                      {STAY_VIBES.map((vibe) => (
                        <TouchableOpacity
                          key={vibe.id}
                          style={[
                            styles.vibeChip,
                            {
                              backgroundColor: destination === vibe.destination ? (mode === 'light' ? '#EBF5FF' : '#1E293B') : themeColors.card,
                              borderColor: destination === vibe.destination ? themeColors.primary : themeColors.border,
                            },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => handleSelectVibe(vibe)}
                        >
                          <Text
                            style={[
                              styles.vibeChipText,
                              {
                                color: destination === vibe.destination ? themeColors.primary : themeColors.text,
                              },
                            ]}
                          >
                            {vibe.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Featured Curated Stays Spotlight */}
                  <View style={styles.featuredSection}>
                    <View style={styles.featuredHeaderRow}>
                      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                        Featured Curated Stays
                      </Text>
                      <Text style={[styles.exploreLink, { color: themeColors.primary }]}>
                        All 240+ ›
                      </Text>
                    </View>

                    <View style={styles.featuredGrid}>
                      {FEATURED_STAYS.map((stay) => (
                        <TouchableOpacity
                          key={stay.id}
                          style={[
                            styles.featuredCard,
                            {
                              backgroundColor: themeColors.card,
                              borderColor: themeColors.border,
                            },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => handleSelectFeaturedStay(stay)}
                        >
                          <View
                            style={[
                              styles.featuredBanner,
                              {
                                backgroundColor: stay.id === 'featured-1' ? (mode === 'light' ? '#EBF5FF' : '#1A2E44') : (mode === 'light' ? '#F3E8FF' : '#2D1B4E'),
                              },
                            ]}
                          >
                            <View style={styles.featuredBadge}>
                              <Text style={styles.featuredBadgeText}>{stay.rating}</Text>
                            </View>
                            <Text style={styles.featuredEmoji}>{stay.emoji}</Text>
                          </View>

                          <View style={styles.featuredBody}>
                            <Text
                              style={[styles.featuredName, { color: themeColors.text }]}
                              numberOfLines={1}
                            >
                              {stay.name}
                            </Text>
                            <Text style={[styles.featuredLoc, { color: themeColors.textMuted }]}>
                              {stay.location}
                            </Text>
                            <Text style={[styles.featuredPrice, { color: themeColors.primary }]}>
                              {stay.price} <Text style={[styles.perNight, { color: themeColors.textMuted }]}>/ night</Text>
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Nomadix Squad Stay Perks Banner */}
                  <View
                    style={[
                      styles.squadBanner,
                      {
                        backgroundColor: mode === 'light' ? '#F0FDF4' : '#142E25',
                        borderColor: mode === 'light' ? '#DCFCE7' : '#1E4638',
                      },
                    ]}
                  >
                    <Text style={styles.squadIcon}>👥</Text>
                    <View style={styles.squadTextGroup}>
                      <Text style={[styles.squadTitle, { color: mode === 'light' ? '#166534' : '#4ADE80' }]}>
                        Nomadix Squad Stay Perks
                      </Text>
                      <Text style={[styles.squadSub, { color: mode === 'light' ? '#15803D' : '#86EFAC' }]}>
                        Book for 3+ squad travelers and unlock free late checkout & automated bill splitting.
                      </Text>
                    </View>
                  </View>
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
  collapsedCity: {
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
  cityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cityChipActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
    borderColor: colors.primary,
  },
  cityChipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  cityChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  dateInputsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateCol: {
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
  enrichedEmptyContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyPromptText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  vibeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  vibeScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  vibeScrollContent: {
    paddingRight: 16,
    gap: 8,
  },
  vibeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  vibeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  featuredSection: {
    marginBottom: 20,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exploreLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  featuredGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  featuredCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  featuredBanner: {
    height: 80,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featuredBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD60A',
  },
  featuredEmoji: {
    fontSize: 20,
  },
  featuredBody: {
    padding: 10,
  },
  featuredName: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  featuredLoc: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 6,
  },
  featuredPrice: {
    fontSize: 13,
    fontWeight: '900',
  },
  perNight: {
    fontSize: 9,
    fontWeight: '400',
  },
  squadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  squadIcon: {
    fontSize: 24,
  },
  squadTextGroup: {
    flex: 1,
  },
  squadTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  squadSub: {
    fontSize: 11,
    lineHeight: 15,
  },
});

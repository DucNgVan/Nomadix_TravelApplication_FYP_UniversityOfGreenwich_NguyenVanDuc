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
import HotelCard from '../../components/booking/HotelCard';
import { useBookingStore } from '../../stores/booking.store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const QUICK_CITIES = ['Đà Lạt', 'Đà Nẵng', 'Hà Nội', 'TP. Hồ Chí Minh', 'Phú Quốc'];

export default function HotelSearchScreen({ navigation }) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { hotels, isLoadingHotels, hotelError, searchHotels, selectHotel } = useBookingStore();

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
      setValidationError('Vui lòng nhập đầy đủ thành phố, ngày nhận phòng và ngày trả phòng');
      return;
    }

    const checkInDate = new Date(cleanCheckIn);
    const checkOutDate = new Date(cleanCheckOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      setValidationError('Định dạng ngày không hợp lệ (YYYY-MM-DD)');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setValidationError('Ngày trả phòng phải sau ngày nhận phòng');
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Khám phá khách sạn</Text>
          <Text style={styles.subtitle}>Resort, khách sạn & homestay tốt nhất theo giá phòng</Text>
        </View>

        {/* Collapsible Search Panel */}
        {isCollapsed ? (
          <TouchableOpacity
            style={styles.collapsedBar}
            onPress={() => setIsCollapsed(false)}
            activeOpacity={0.8}
          >
            <View style={styles.collapsedInfo}>
              <Text style={styles.collapsedCity}>⌂ {destination || 'Đà Lạt'}</Text>
              <Text style={styles.collapsedDates}>
                {checkIn} → {checkOut} • 2 khách
              </Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editText}>Thay đổi</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.searchBox}>
            {/* Quick City Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {QUICK_CITIES.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.cityChip,
                    destination === city && styles.cityChipActive,
                  ]}
                  onPress={() => {
                    setDestination(city);
                    if (!checkIn) setCheckIn('2026-10-15');
                    if (!checkOut) setCheckOut('2026-10-18');
                    setValidationError('');
                  }}
                >
                  <Text
                    style={[
                      styles.cityChipText,
                      destination === city && styles.cityChipTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Thành phố / Điểm đến"
              placeholder="Thành phố / Điểm đến"
              value={destination}
              onChangeText={(text) => {
                setDestination(text);
                setValidationError('');
              }}
            />

            <View style={styles.dateInputsRow}>
              <View style={styles.dateCol}>
                <Input
                  label="Nhận phòng"
                  placeholder="Ngày nhận phòng (check-in)"
                  value={checkIn}
                  onChangeText={(text) => {
                    setCheckIn(text);
                    setValidationError('');
                  }}
                />
              </View>
              <View style={styles.dateCol}>
                <Input
                  label="Trả phòng"
                  placeholder="Ngày trả phòng (check-out)"
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
              title="Tìm khách sạn"
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
            <Text style={styles.loadingText}>Đang tìm kiếm khách sạn phù hợp...</Text>
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
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nhập địa điểm để khám phá nơi lưu trú lý tưởng</Text>
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
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0 đ';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

export default function HotelCard({ hotel, onSelect, testID }) {
  if (!hotel) return null;

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={() => onSelect && onSelect(hotel)}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.addressText} numberOfLines={1}>{hotel.address}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{hotel.starRating} sao ★</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        {hotel.reviewScore ? (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{hotel.reviewScore.toFixed(1)} Tuyệt vời</Text>
          </View>
        ) : null}
        {hotel.nights ? (
          <Text style={styles.nightsText}>{hotel.nights} đêm</Text>
        ) : null}
      </View>

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.pricePerNightText}>
            {formatCurrency(hotel.pricePerNight)} / đêm
          </Text>
        </View>
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPriceText}>
            {formatCurrency(hotel.totalPrice || hotel.pricePerNight)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  hotelName: {
    ...typography.h3,
    color: colors.text,
  },
  addressText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  scoreBadge: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },
  scoreText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  nightsText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  pricePerNightText: {
    ...typography.body,
    color: colors.textMuted,
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  totalPriceText: {
    ...typography.h3,
    color: colors.success,
    fontWeight: '700',
  },
});

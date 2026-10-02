import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '0h 0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0 đ';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

export default function FlightCard({ flight, onSelect, testID }) {
  if (!flight) return null;

  const isDirect = flight.stops === 0;
  const stopsText = isDirect ? 'Bay thẳng' : `${flight.stops} điểm dừng`;
  const priceAmount = flight.price?.amount ?? 0;

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={() => onSelect && onSelect(flight)}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.airlineName}>{flight.airlineName}</Text>
          <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
        </View>
        <View style={[styles.badge, isDirect ? styles.directBadge : styles.stopsBadge]}>
          <Text style={[styles.badgeText, isDirect ? styles.directBadgeText : styles.stopsBadgeText]}>
            {stopsText}
          </Text>
        </View>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.stationBlock}>
          <Text style={styles.airportCode}>{flight.origin}</Text>
          {flight.departureTime ? (
            <Text style={styles.timeText}>
              {new Date(flight.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          ) : null}
        </View>

        <View style={styles.middleRoute}>
          <Text style={styles.durationText}>{formatDuration(flight.durationMinutes)}</Text>
          <View style={styles.routeLine} />
          <Text style={styles.cabinClassText}>{flight.cabinClass || 'ECONOMY'}</Text>
        </View>

        <View style={[styles.stationBlock, styles.alignRight]}>
          <Text style={styles.airportCode}>{flight.destination}</Text>
          {flight.arrivalTime ? (
            <Text style={styles.timeText}>
              {new Date(flight.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.priceLabel}>Giá mỗi khách</Text>
        <Text style={styles.priceAmount}>{formatCurrency(priceAmount)}</Text>
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
    marginBottom: 12,
  },
  airlineName: {
    ...typography.h3,
    color: colors.text,
  },
  flightNumber: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  directBadge: {
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
  },
  directBadgeText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  stopsBadge: {
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
  },
  stopsBadgeText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  stationBlock: {
    minWidth: 60,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  airportCode: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  timeText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  middleRoute: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  durationText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  routeLine: {
    height: 1.5,
    backgroundColor: colors.border,
    width: '100%',
    marginVertical: 4,
  },
  cabinClassText: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  priceAmount: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';
import BoardingPassModal from '../../components/booking/BoardingPassModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { mode, colors: themeColors, toggleTheme } = useThemeStore();
  const bookedTickets = useBookingStore((state) => state.bookedTickets) || [];
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fullName = user?.fullName || 'John Doe';
  const email = user?.email || 'traveler@nomadix.vn';
  const initial = (fullName.charAt(0) || 'J').toUpperCase();

  // If no tickets booked yet in current session, display pre-seeded realistic confirmed ticket
  const defaultTicket = {
    id: 'tkt-seed-001',
    pnr: 'VN-8X2K9P',
    ticketNumber: '738-2491048291',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-10-15T07:00:00Z',
    arrivalTime: '2026-10-15T09:10:00Z',
    durationMinutes: 130,
    stops: 0,
    aircraft: 'Airbus A350-900',
    cabinClass: 'Economy',
    totalPrice: 2073060,
    passenger: { fullName, email },
    status: 'CONFIRMED',
  };

  const ticketsToDisplay = bookedTickets.length > 0 ? bookedTickets : [defaultTicket];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Subtitle */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>Travel profile, explorer rank & account settings</Text>
        </View>

        {/* Profile Card with Avatar & Stats */}
        <View style={[styles.profileCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.avatarGlow}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          </View>

          <Text style={[styles.userName, { color: themeColors.text }]}>{fullName}</Text>
          <Text style={[styles.userEmail, { color: themeColors.textMuted }]}>{email}</Text>

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>
              ◈ Explorer Level 5 • 1,450 XP
            </Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: themeColors.text }]}>4</Text>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#30D158' }]}>12</Text>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>Check-ins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: themeColors.primary }]}>6</Text>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>Badges</Text>
            </View>
          </View>
        </View>

        {/* Booked Flights Section */}
        <View style={styles.bookedSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeaderTitle, { color: themeColors.textMuted }]}>✈ My Booked Flights</Text>
            <View style={styles.ticketCountBadge}>
              <Text style={styles.ticketCountText}>{ticketsToDisplay.length} {ticketsToDisplay.length === 1 ? 'ticket' : 'tickets'} saved</Text>
            </View>
          </View>

          {ticketsToDisplay.map((ticket, index) => (
            <TouchableOpacity
              key={ticket.id || ticket.pnr || index}
              testID={index === 0 ? "profile-ticket-card" : `profile-ticket-card-${ticket.id}`}
              style={[
                styles.ticketCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedTicket(ticket)}
            >
              <View style={styles.ticketCardHeader}>
                <View style={styles.airlinePill}>
                  <View style={[styles.miniBadge, { backgroundColor: ticket.airlineCode === 'VJ' ? '#E11B22' : '#007AFF' }]}>
                    <Text style={styles.miniBadgeText}>{ticket.airlineCode || 'VN'}</Text>
                  </View>
                  <Text style={[styles.ticketAirlineText, { color: themeColors.text }]}>{ticket.airlineName} • {ticket.flightNumber}</Text>
                </View>
                <View style={styles.confirmedBadge}>
                  <Text style={styles.confirmedBadgeText}>Confirmed</Text>
                </View>
              </View>

              <View style={styles.ticketRouteRow}>
                <View>
                  <Text style={[styles.ticketRouteText, { color: themeColors.text }]}>{ticket.origin || 'SGN'} → {ticket.destination || 'HAN'}</Text>
                  <Text style={[styles.ticketTimeText, { color: themeColors.textMuted }]}>
                    {ticket.departureTime ? ticket.departureTime.slice(11, 16) : '07:00'} • {ticket.aircraft || 'Airbus A350'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.pnrCodeLabel}>PNR CODE</Text>
                  <Text style={[styles.pnrCodeValue, { color: themeColors.text }]}>{ticket.pnr || 'VN-8X2K9P'}</Text>
                </View>
              </View>

              <View style={styles.ticketFooter}>
                <Text style={styles.boardingPassLink}>🎫 View Boarding Pass</Text>
                <Text style={styles.ticketPriceText}>{Number(ticket.totalPrice || 2073060).toLocaleString('en-US')} VND</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dedicated Appearance & Theme Switcher Card */}
        <View style={[styles.themeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.themeHeader}>
            <Text style={[styles.themeCardTitle, { color: themeColors.text }]}>Appearance & Theme</Text>
            <Text style={[styles.themeCardSub, { color: themeColors.textMuted }]}>
              Customize visual mode ({mode === 'light' ? 'Light' : 'Dark'})
            </Text>
          </View>
          <View style={styles.themePillsRow}>
            <TouchableOpacity
              testID="app-theme-toggle"
              style={[
                styles.themePillBtn,
                mode === 'light' && styles.themePillBtnActive,
                {
                  borderColor: mode === 'light' ? themeColors.primary : themeColors.border,
                  backgroundColor: mode === 'light' ? themeColors.primaryLight : 'transparent',
                },
              ]}
              onPress={() => mode !== 'light' && toggleTheme()}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.themePillBtnText,
                  { color: mode === 'light' ? themeColors.primary : themeColors.textMuted },
                ]}
              >
                ☀️ Light Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="theme-toggle-row"
              style={[
                styles.themePillBtn,
                mode === 'dark' && styles.themePillBtnActive,
                {
                  borderColor: mode === 'dark' ? themeColors.primary : themeColors.border,
                  backgroundColor: mode === 'dark' ? (mode === 'dark' ? '#273549' : themeColors.primaryLight) : 'transparent',
                },
              ]}
              onPress={() => mode !== 'dark' && toggleTheme()}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.themePillBtnText,
                  { color: mode === 'dark' ? '#38BDF8' : themeColors.textMuted },
                ]}
              >
                🌙 Dark Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Items List */}
        <View style={[styles.actionMenuCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>✓</Text>
              <Text style={[styles.actionText, { color: themeColors.text }]}>Identity Verification (KYC)</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>⊞</Text>
              <Text style={[styles.actionText, { color: themeColors.text }]}>Bank Account for Debt Settlements</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>◬</Text>
              <Text style={[styles.actionText, { color: themeColors.text }]}>Notifications & Squad Invites</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, styles.logoutRow]}
            onPress={() => logout?.()}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Text style={[styles.actionIcon, styles.logoutIcon]}>⎋</Text>
              <Text style={[styles.actionText, styles.logoutText]}>Log Out</Text>
            </View>
            <Text style={[styles.actionArrow, styles.logoutIcon]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Interactive Boarding Pass Modal */}
      <BoardingPassModal
        visible={!!selectedTicket}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  avatarGlow: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(10, 132, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  userName: {
    ...typography.h2,
    color: colors.text,
  },
  userEmail: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 10,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD60A',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionMenuCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionText: {
    ...typography.body,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  actionArrow: {
    fontSize: 18,
    color: colors.textMuted,
  },
  logoutRow: {
    borderBottomWidth: 0,
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
  },
  logoutIcon: {
    color: '#FF453A',
  },
  logoutText: {
    color: '#FF453A',
    fontWeight: '700',
  },
  bookedSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ticketCountBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ticketCountText: {
    fontSize: 11,
    fontWeight: '750',
    color: '#007AFF',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  ticketCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  airlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniBadge: {
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  ticketAirlineText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  confirmedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confirmedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  ticketRouteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  ticketRouteText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1C1C1E',
  },
  ticketTimeText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 2,
  },
  pnrCodeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E8E93',
  },
  pnrCodeValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#007AFF',
    letterSpacing: 0.5,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F2F2F7',
    marginTop: 4,
  },
  boardingPassLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
  ticketPriceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#495057',
  },
  themeCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  themeHeader: {
    marginBottom: 12,
  },
  themeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  themeCardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  themePillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themePillBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    overflow: 'hidden',
  },
  themePillBtnActive: {
    elevation: 0,
    shadowOpacity: 0,
  },
  themePillBtnText: {
    fontSize: 13,
    fontWeight: '800',
    backgroundColor: 'transparent',
    includeFontPadding: false,
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const fullName = user?.fullName || 'Nguyễn Văn Đức';
  const email = user?.email || 'traveler@nomadix.vn';
  const initial = (fullName.charAt(0) || 'N').toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tài khoản cá nhân</Text>
          <Text style={styles.subtitle}>Hồ sơ du lịch, cấp độ & thiết lập thanh toán</Text>
        </View>

        {/* Profile Card with Avatar & Stats */}
        <View style={styles.profileCard}>
          <View style={styles.avatarGlow}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>
              ◈ Phượt thủ Cấp độ 5 • 1.450 XP
            </Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Chuyến đi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#30D158' }]}>12</Text>
              <Text style={styles.statLabel}>Địa danh check-in</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>6</Text>
              <Text style={styles.statLabel}>Huy hiệu</Text>
            </View>
          </View>
        </View>

        {/* Action Items List */}
        <View style={styles.actionMenuCard}>
          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>✓</Text>
              <Text style={styles.actionText}>Xác minh danh tính KYC</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>⊞</Text>
              <Text style={styles.actionText}>Tài khoản ngân hàng nhận tiền nợ</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>◬</Text>
              <Text style={styles.actionText}>Thông báo & Lời mời Squad</Text>
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
              <Text style={[styles.actionText, styles.logoutText]}>Đăng xuất tài khoản</Text>
            </View>
            <Text style={[styles.actionArrow, styles.logoutIcon]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useItineraryStore } from '../../stores/itinerary.store';
import { useExpenseStore } from '../../stores/expense.store';
import { usePlacesStore } from '../../stores/places.store';
import { useThemeStore } from '../../stores/theme.store';
import PlanMapDiscovery from '../../components/plan/PlanMapDiscovery';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function PlanScreen() {
  const { mode, colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const [activeSubTab, setActiveSubTab] = useState('itinerary'); // 'map' | 'itinerary' | 'expense'
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);

  // Invite Companion Modal State
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('EDITOR');

  // Add Stop Modal State
  const [addStopModalVisible, setAddStopModalVisible] = useState(false);
  const [stopName, setStopName] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [stopDuration, setStopDuration] = useState('90');
  // Create Trip Modal State
  const [createTripModalVisible, setCreateTripModalVisible] = useState(false);
  const [createTripError, setCreateTripError] = useState('');
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDest, setNewTripDest] = useState('');
  const [newTripStartDate, setNewTripStartDate] = useState('2026-11-01');
  const [newTripEndDate, setNewTripEndDate] = useState('2026-11-03');

  const {
    currentTrip,
    trips,
    fetchTrips,
    inviteCompanion,
    addStop,
    createTrip,
    applyAiPlan,
  } = useItineraryStore();

  useEffect(() => {
    try {
      const p = fetchTrips?.();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    } catch {
      // Ignored
    }
  }, []);

  const placesStore = usePlacesStore();

  const {
    expenses,
    debtSummary,
    settleDebt,
  } = useExpenseStore();

  const rawTrip = currentTrip || (trips && trips.length > 0 ? trips[0] : null);
  const trip = rawTrip?.itinerary || rawTrip;

  const handleGenerateAiPlan = async (selectedList) => {
    try {
      let durationDays = 3;
      if (trip?.startDate && trip?.endDate) {
        const diff =
          Math.ceil(
            Math.abs(new Date(trip.endDate) - new Date(trip.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1;
        if (diff > 0) durationDays = diff;
      }

      const aiPlan = await placesStore.generateAiPlan?.(durationDays, selectedList);
      if (aiPlan?.days && trip?.id) {
        applyAiPlan?.(trip.id, aiPlan.days);
      }
      setActiveSubTab('itinerary');
    } catch {
      setActiveSubTab('itinerary');
    }
  };

  const handleCreateTrip = async () => {
    if (!newTripTitle.trim() || !newTripDest.trim()) {
      setCreateTripError('Vui lòng nhập tên chuyến đi và điểm đến');
      return;
    }
    setCreateTripError('');
    try {
      await createTrip?.({
        title: newTripTitle.trim(),
        destination: newTripDest.trim(),
        destinationCity: newTripDest.trim(),
        startDate: newTripStartDate || '2026-11-01',
        endDate: newTripEndDate || '2026-11-03',
      });
      setNewTripTitle('');
      setNewTripDest('');
      setCreateTripError('');
      setCreateTripModalVisible(false);
    } catch (err) {
      setCreateTripError(err?.message || 'Lỗi khi tạo chuyến đi');
    }
  };

  const currentDay =
    trip?.days?.find((d) => (d.dayIndex ?? d.dayNumber) === selectedDayIndex) ||
    trip?.days?.[0] || { items: [] };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await inviteCompanion?.(trip.id, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteEmail('');
      setInviteModalVisible(false);
    } catch {
      // Handled by store
    }
  };

  const handleSaveStop = async () => {
    if (!stopName.trim()) return;
    try {
      await addStop?.(trip.id, {
        dayIndex: selectedDayIndex,
        name: stopName.trim(),
        arrivalTime: stopTime.trim() || '09:00',
        durationMinutes: parseInt(stopDuration, 10) || 60,
      });
      setStopName('');
      setStopTime('');
      setStopDuration('90');
      setAddStopModalVisible(false);
    } catch {
      // Handled by store
    }
  };

  const handleSettle = async (settlement) => {
    try {
      await settleDebt?.(trip.id, {
        payerId: settlement?.fromUserId,
        receiverId: settlement?.toUserId,
        amount: settlement?.amount,
      });
    } catch {
      // Handled by store
    }
  };

  const formatVND = (amount) => {
    const num = Number(amount) || 0;
    return num.toLocaleString('vi-VN') + ' đ';
  };

  const renderCreateTripModal = () => (
    <Modal
      visible={createTripModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setCreateTripModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tạo kế hoạch chuyến đi</Text>
          <Text style={styles.modalSubtitle}>Nhập thông tin hành trình của bạn</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Tên chuyến đi (VD: Hành trình Đà Lạt 3 ngày)"
            placeholderTextColor={themeColors.textMuted}
            value={newTripTitle}
            onChangeText={setNewTripTitle}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Điểm đến (VD: Đà Lạt)"
            placeholderTextColor={themeColors.textMuted}
            value={newTripDest}
            onChangeText={setNewTripDest}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Ngày bắt đầu (YYYY-MM-DD)"
            placeholderTextColor={themeColors.textMuted}
            value={newTripStartDate}
            onChangeText={setNewTripStartDate}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Ngày kết thúc (YYYY-MM-DD)"
            placeholderTextColor={themeColors.textMuted}
            value={newTripEndDate}
            onChangeText={setNewTripEndDate}
          />
          {createTripError ? (
            <Text style={{ color: '#EF4444', fontSize: 13, marginBottom: 12, textAlign: 'center', fontWeight: '500' }}>
              {createTripError}
            </Text>
          ) : null}
          <View style={styles.modalActionsRow}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setCreateTripModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleCreateTrip}
            >
              <Text style={styles.modalSubmitText}>Tạo chuyến đi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!trip) {
    if (activeSubTab === 'map') {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => setActiveSubTab('itinerary')}
                style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: themeColors.card }}
              >
                <Text style={{ color: themeColors.primary, fontWeight: 'bold' }}>← Quay lại</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Khám phá địa điểm</Text>
              <View style={{ width: 60 }} />
            </View>
            <PlanMapDiscovery
              places={placesStore.places}
              selectedPlaceIds={placesStore.selectedPlaceIds}
              onTogglePlace={placesStore.togglePlaceSelection}
              onGenerateAiPlan={(selectedList) => {
                setCreateTripError('');
                setCreateTripModalVisible(true);
              }}
            />
            {renderCreateTripModal()}
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Kế hoạch chuyến đi</Text>
            <Text style={styles.subtitle}>Lên lịch trình & quản lý chi tiêu nhóm thông minh</Text>
          </View>
          <View style={styles.emptyPlanContainer}>
            <Text style={styles.emptyPlanIcon}>🗺️</Text>
            <Text style={styles.emptyPlanTitle}>Chưa có kế hoạch nào</Text>
            <Text style={styles.emptyPlanSubtitle}>
              Bắt đầu tạo kế hoạch chuyến đi đầu tiên của bạn để lập lịch trình và chia sẻ chi phí cùng bạn bè.
            </Text>
            <TouchableOpacity
              style={styles.createTripBtn}
              onPress={() => {
                setCreateTripError('');
                setCreateTripModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.createTripBtnText}>+ Tạo kế hoạch mới</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createTripBtn,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: themeColors.primary,
                  marginTop: 12,
                },
              ]}
              onPress={() => setActiveSubTab('map')}
              activeOpacity={0.8}
            >
              <Text style={[styles.createTripBtnText, { color: themeColors.primary }]}>
                🗺️ Khám phá bản đồ trước
              </Text>
            </TouchableOpacity>
          </View>
          {renderCreateTripModal()}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={styles.title}>Kế hoạch chuyến đi</Text>
              <Text style={styles.subtitle}>
                {(trip.destinationCity || trip.destination || 'Chưa đặt tên')} • {trip.startDate} - {trip.endDate}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.headerNewTripBtn}
              onPress={() => setCreateTripModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.headerNewTripText}>+ Tạo mới</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sub-Tab Switcher: Map Discovery vs Itinerary & Squad vs Expenses & Splitting */}
        <View style={styles.subTabBar}>
          <TouchableOpacity
            style={[
              styles.subTabButton,
              activeSubTab === 'map' && styles.subTabButtonActive,
            ]}
            onPress={() => setActiveSubTab('map')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.subTabLabel,
                activeSubTab === 'map' && styles.subTabLabelActive,
              ]}
            >
              Bản đồ & Khám phá
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.subTabButton,
              activeSubTab === 'itinerary' && styles.subTabButtonActive,
            ]}
            onPress={() => setActiveSubTab('itinerary')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.subTabLabel,
                activeSubTab === 'itinerary' && styles.subTabLabelActive,
              ]}
            >
              Lịch trình & Đội nhóm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.subTabButton,
              activeSubTab === 'expense' && styles.subTabButtonActive,
            ]}
            onPress={() => setActiveSubTab('expense')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.subTabLabel,
                activeSubTab === 'expense' && styles.subTabLabelActive,
              ]}
            >
              Chi tiêu & Chia tiền
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sub-Tab 0: Map Discovery */}
        {activeSubTab === 'map' && (
          <PlanMapDiscovery
            places={placesStore.places}
            selectedPlaceIds={placesStore.selectedPlaceIds}
            onTogglePlace={placesStore.togglePlaceSelection}
            onGenerateAiPlan={handleGenerateAiPlan}
          />
        )}

        {/* Sub-Tab 1: Itinerary & Squad */}
        {activeSubTab === 'itinerary' && (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Squad Members Section */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Bạn đồng hành ({trip.collaborators?.length || 0})</Text>
                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => setInviteModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.inviteButtonText}>+ Mời bạn</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.memberList}>
                {trip.collaborators?.map((collab, index) => (
                  <View key={collab.userId || index} style={styles.memberItem}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {(collab.fullName || collab.email || 'U').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{collab.fullName || collab.email}</Text>
                      <Text style={styles.memberStatus}>{collab.status || 'ACCEPTED'}</Text>
                    </View>
                    <View
                      style={[
                        styles.roleBadge,
                        collab.role === 'OWNER' && styles.ownerBadge,
                        collab.role === 'EDITOR' && styles.editorBadge,
                      ]}
                    >
                      <Text style={styles.roleBadgeText}>{collab.role}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Days Selector */}
            <View style={styles.daySelectorRow}>
              {trip.days?.map((day, idx) => {
                const dayNum = day.dayIndex ?? day.dayNumber ?? (idx + 1);
                return (
                  <TouchableOpacity
                    key={dayNum}
                    style={[
                      styles.dayChip,
                      selectedDayIndex === dayNum && styles.dayChipActive,
                    ]}
                    onPress={() => setSelectedDayIndex(dayNum)}
                  >
                    <Text
                      style={[
                        styles.dayChipText,
                        selectedDayIndex === dayNum && styles.dayChipTextActive,
                      ]}
                    >
                      Ngày {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Timeline Stops */}
            <View style={styles.timelineSection}>
              <View style={styles.timelineHeaderRow}>
                <Text style={styles.sectionTitle}>Lịch trình chi tiết (Ngày {selectedDayIndex})</Text>
                <TouchableOpacity
                  style={styles.addStopSmallBtn}
                  onPress={() => setAddStopModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addStopSmallBtnText}>+ Thêm điểm dừng</Text>
                </TouchableOpacity>
              </View>

              {currentDay.items?.length === 0 ? (
                <View style={styles.emptyStopsBox}>
                  <Text style={styles.emptyText}>Chưa có điểm dừng nào cho ngày này.</Text>
                  <TouchableOpacity
                    style={styles.addFirstStopBtn}
                    onPress={() => setAddStopModalVisible(true)}
                  >
                    <Text style={styles.addFirstStopText}>+ Thêm điểm dừng đầu tiên</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                currentDay.items?.map((item, idx) => (
                  <View key={item.id || idx} style={styles.timelineCard}>
                    <View style={styles.timeBadge}>
                      <Text style={styles.timeText}>{item.arrivalTime || '08:00'}</Text>
                      <Text style={styles.durationText}>{item.durationMinutes}m</Text>
                    </View>

                    <View style={styles.timelineContent}>
                      <Text style={styles.stopName}>{item.name}</Text>
                      {item.transitToNext && (
                        <View style={styles.transitRow}>
                          <Text style={styles.transitText}>
                            Di chuyển tiếp theo: {item.transitToNext.distanceKm} km (
                            {item.transitToNext.durationMinutes} phút)
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}

        {/* Sub-Tab 2: Expenses & Splitting */}
        {activeSubTab === 'expense' && (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Total Expense Hero Card */}
            <View style={styles.heroExpenseCard}>
              <Text style={styles.heroExpenseLabel}>Tổng chi tiêu chuyến đi</Text>
              <Text style={styles.heroExpenseValue}>
                {formatVND(debtSummary?.totalExpense || 3600000)}
              </Text>
              <Text style={styles.heroExpenseDesc}>
                Tự động cân bằng chi tiêu & giải quyết công nợ
              </Text>
            </View>

            {/* Member Balances Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Bảng cân đối công nợ</Text>
              {(debtSummary?.memberBalances || []).map((mb, idx) => (
                <View key={mb.userId || idx} style={styles.balanceRow}>
                  <Text style={styles.balanceMemberName}>{mb.fullName || 'Thành viên'}</Text>
                  <Text
                    style={[
                      styles.balanceAmount,
                      mb.netBalance >= 0 ? styles.positiveBalance : styles.negativeBalance,
                    ]}
                  >
                    {mb.netBalance >= 0 ? '+' : ''}
                    {formatVND(mb.netBalance)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Greedy Simplified Debt Settlements */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Lộ trình thanh toán tối ưu (Greedy)</Text>
              <Text style={styles.sectionSubDesc}>
                Thuật toán tối thiểu hóa số giao dịch cần chuyển
              </Text>

              {(debtSummary?.simplifiedSettlements || []).map((st, idx) => (
                <View key={idx} style={styles.settlementCard}>
                  <View style={styles.settlementTextCol}>
                    <Text style={styles.settlementRoute}>
                      {st.fromUserName || 'Hoàng Nam'} chuyển {st.toUserName || 'Đức Nguyễn'}
                    </Text>
                    <Text style={styles.settlementAmount}>{formatVND(st.amount)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.settleButton}
                    onPress={() => handleSettle(st)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.settleButtonText}>Thanh toán nợ</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Modal: Invite Companion */}
        <Modal
          visible={inviteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setInviteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Mời bạn đồng hành</Text>
              <Text style={styles.modalSubtitle}>
                Nhập email của bạn bè để cùng lên kế hoạch & chia tiền
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="email@example.com"
                placeholderTextColor={themeColors.textMuted}
                value={inviteEmail}
                onChangeText={setInviteEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View style={styles.roleSelectionRow}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    inviteRole === 'EDITOR' && styles.roleOptionActive,
                  ]}
                  onPress={() => setInviteRole('EDITOR')}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      inviteRole === 'EDITOR' && styles.roleOptionTextActive,
                    ]}
                  >
                    EDITOR
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    inviteRole === 'VIEWER' && styles.roleOptionActive,
                  ]}
                  onPress={() => setInviteRole('VIEWER')}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      inviteRole === 'VIEWER' && styles.roleOptionTextActive,
                    ]}
                  >
                    VIEWER
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setInviteModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleInvite}
                >
                  <Text style={styles.modalSubmitText}>Gửi lời mời</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal: Add Stop */}
        <Modal
          visible={addStopModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setAddStopModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Thêm điểm dừng mới</Text>
              <Text style={styles.modalSubtitle}>
                Nhập thông tin điểm tham quan cho Ngày {selectedDayIndex}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Tên địa điểm (VD: Thác Datanla)"
                placeholderTextColor={themeColors.textMuted}
                value={stopName}
                onChangeText={setStopName}
              />

              <View style={styles.modalTwoInputsRow}>
                <TextInput
                  style={[styles.modalInput, styles.halfInput]}
                  placeholder="Giờ đến (VD: 10:30)"
                  placeholderTextColor={themeColors.textMuted}
                  value={stopTime}
                  onChangeText={setStopTime}
                />
                <TextInput
                  style={[styles.modalInput, styles.halfInput]}
                  placeholder="Thời lượng phút (VD: 120)"
                  placeholderTextColor={themeColors.textMuted}
                  value={stopDuration}
                  onChangeText={setStopDuration}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setAddStopModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleSaveStop}
                >
                  <Text style={styles.modalSubmitText}>Lưu điểm dừng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
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
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  subTabButtonActive: {
    backgroundColor: colors.primary,
  },
  subTabLabel: {
    ...typography.body,
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  subTabLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  sectionSubDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  inviteButton: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inviteButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  memberList: {
    gap: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  memberStatus: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ownerBadge: {
    backgroundColor: 'rgba(255, 159, 10, 0.2)',
  },
  editorBadge: {
    backgroundColor: 'rgba(48, 209, 88, 0.2)',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  daySelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayChipText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  dayChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  timelineSection: {
    marginTop: 4,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addStopSmallBtn: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addStopSmallBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyStopsBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  addFirstStopBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addFirstStopText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  timelineCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  timeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 55,
  },
  timeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  durationText: {
    color: colors.textMuted,
    fontSize: 10,
  },
  timelineContent: {
    flex: 1,
  },
  stopName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  transitRow: {
    marginTop: 4,
  },
  transitText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  heroExpenseCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  heroExpenseLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  heroExpenseValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 4,
  },
  heroExpenseDesc: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  balanceMemberName: {
    ...typography.body,
    color: colors.text,
  },
  balanceAmount: {
    ...typography.body,
    fontWeight: '700',
  },
  positiveBalance: {
    color: '#30D158',
  },
  negativeBalance: {
    color: '#FF453A',
  },
  settlementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  settlementTextCol: {
    flex: 1,
  },
  settlementRoute: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  settlementAmount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  settleButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  settleButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    color: colors.text,
    fontSize: 14,
    marginBottom: 12,
  },
  modalTwoInputsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  roleSelectionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  roleOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
  },
  roleOptionText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 12,
  },
  roleOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  modalSubmitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  modalSubmitText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  headerNewTripBtn: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerNewTripText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyPlanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyPlanIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyPlanTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyPlanSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  createTripBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createTripBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

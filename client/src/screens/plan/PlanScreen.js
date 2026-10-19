import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItineraryStore } from '../../stores/itinerary.store';
import { useExpenseStore } from '../../stores/expense.store';
import { usePlacesStore } from '../../stores/places.store';
import { useThemeStore } from '../../stores/theme.store';
import PlanMapDiscovery from '../../components/plan/PlanMapDiscovery';
import MultiCityPlanWizard from '../../components/plan/MultiCityPlanWizard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function PlanScreen() {
  const { mode, colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const [activeSubTab, setActiveSubTab] = useState('itinerary'); // 'map' | 'itinerary' | 'expense'
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [showWizard, setShowWizard] = useState(false);

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

  const handleWizardComplete = async (planData) => {
    try {
      const cities = planData?.cities || ['Da Nang'];
      const totalDays = planData?.totalDays || 3;
      const selectedPlaces = planData?.selectedPlaces || planData?.places || [];

      const startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() + 1);
      const endDateObj = new Date(startDateObj);
      endDateObj.setDate(startDateObj.getDate() + Math.max(0, totalDays - 1));

      const startDateStr = startDateObj.toISOString().split('T')[0];
      const endDateStr = endDateObj.toISOString().split('T')[0];
      const tripTitle = planData?.title || `Journey: ${cities.join(' - ')}`;
      const destStr = cities.join(' - ');

      const newTrip = await createTrip?.({
        title: tripTitle,
        destination: destStr,
        destinationCity: cities[0] || destStr,
        startDate: startDateStr,
        endDate: endDateStr,
      });

      const tripId = newTrip?.id || newTrip?.itinerary?.id || (trip && trip.id);
      if (selectedPlaces.length > 0) {
        const aiPlan = await placesStore.generateAiPlan?.(totalDays, selectedPlaces);
        if (aiPlan?.days && tripId) {
          applyAiPlan?.(tripId, aiPlan.days);
        }
      }
      setShowWizard(false);
      setActiveSubTab('itinerary');
    } catch {
      setShowWizard(false);
      setActiveSubTab('itinerary');
    }
  };

  const handleCreateTrip = async () => {
    if (!newTripTitle.trim() || !newTripDest.trim()) {
      setCreateTripError('Please enter trip title and destination');
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
      setCreateTripError(err?.message || 'Error creating trip');
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
    return num.toLocaleString('en-US') + ' ₫';
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
          <Text style={styles.modalTitle}>Create New Trip</Text>
          <Text style={styles.modalSubtitle}>Enter journey details below</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Da Nang 3-Day Adventure"
            placeholderTextColor={themeColors.textMuted}
            value={newTripTitle}
            onChangeText={setNewTripTitle}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Destination (Tokyo, Paris)"
            placeholderTextColor={themeColors.textMuted}
            value={newTripDest}
            onChangeText={setNewTripDest}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. 2026-11-01"
            placeholderTextColor={themeColors.textMuted}
            value={newTripStartDate}
            onChangeText={setNewTripStartDate}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. 2026-11-03"
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
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleCreateTrip}
            >
              <Text style={styles.modalSubmitText}>Create Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (showWizard) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <MultiCityPlanWizard
          places={placesStore.places}
          onCancel={() => setShowWizard(false)}
          onCompletePlan={handleWizardComplete}
        />
      </SafeAreaView>
    );
  }

  if (!trip) {
    if (activeSubTab === 'map') {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.mapDiscoveryHeaderRow}>
              <TouchableOpacity
                onPress={() => setActiveSubTab('itinerary')}
                style={[styles.mapHeaderBackBtn, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
                activeOpacity={0.7}
              >
                <Text style={{ color: themeColors.primary, fontWeight: '700', fontSize: 13 }}>← Back</Text>
              </TouchableOpacity>
              <Text style={[styles.mapHeaderTitle, { color: themeColors.text }]} numberOfLines={1}>
                Explore Places on Map
              </Text>
              <TouchableOpacity
                onPress={() => setShowWizard(true)}
                style={styles.mapHeaderWizardBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.mapHeaderWizardBtnText}>✨ Wizard</Text>
              </TouchableOpacity>
            </View>
            <PlanMapDiscovery
              places={placesStore.places}
              selectedPlaceIds={placesStore.selectedPlaceIds}
              onTogglePlace={placesStore.togglePlaceSelection}
              onGenerateAiPlan={(selectedList) => {
                setShowWizard(true);
              }}
            />
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>Collaborative travel planning & smart expense splitting</Text>
          </View>
          <View style={styles.emptyPlanContainer}>
            <Text style={styles.emptyPlanIcon}>🗺️</Text>
            <Text style={styles.emptyPlanTitle}>No Travel Plan Yet</Text>
            <Text style={styles.emptyPlanSubtitle}>
              Choose an option below to start your journey:
            </Text>

            {/* Exactly 2 Primary Options */}
            <TouchableOpacity
              style={styles.wizardPrimaryBtn}
              onPress={() => setShowWizard(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.wizardPrimaryBtnText}>
                ✨ Smart Journey Wizard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.exploreMapOutlineBtn, { borderColor: themeColors.primary }]}
              onPress={() => setActiveSubTab('map')}
              activeOpacity={0.8}
            >
              <Text style={[styles.exploreMapOutlineBtnText, { color: themeColors.primary }]}>
                🗺️ Explore Places on Map First
              </Text>
            </TouchableOpacity>
          </View>
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
              <Text style={styles.title}>Trip Itinerary</Text>
              <Text style={styles.subtitle}>
                {(trip.destinationCity || trip.destination || 'Untitled Trip')} • {trip.startDate} - {trip.endDate}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.headerNewTripBtn}
              onPress={() => setCreateTripModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.headerNewTripText}>+ New Trip</Text>
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
              Map & Places
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
              Itinerary & Squad
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
              Expenses & Splits
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sub-Tab 0: Map Discovery */}
        {activeSubTab === 'map' && (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.wizardQuickBar}
              onPress={() => setShowWizard(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.wizardQuickBarText}>
                ✨ Smart Wizard (Plan Multi-City Journey A → B → C)
              </Text>
            </TouchableOpacity>
            <PlanMapDiscovery
              places={placesStore.places}
              selectedPlaceIds={placesStore.selectedPlaceIds}
              onTogglePlace={placesStore.togglePlaceSelection}
              onGenerateAiPlan={handleGenerateAiPlan}
            />
          </View>
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
                <Text style={styles.sectionTitle}>Squad Members ({trip.collaborators?.length || 0})</Text>
                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => setInviteModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.inviteButtonText}>+ Invite Friend</Text>
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
                      Day {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Day Route Map Visualizer Banner */}
            {currentDay.items?.length > 0 && (
              <View testID="itinerary-day-route-map" style={styles.dayRouteMapBanner}>
                <View style={styles.dayRouteHeader}>
                  <Text style={styles.dayRouteTitle}>
                    🗺️ Day {selectedDayIndex} Route ({currentDay.items.length} stops)
                  </Text>
                  <View style={styles.dayRouteDistanceBadge}>
                    <Text style={styles.dayRouteDistanceText}>
                      ~{currentDay.items
                        .reduce((acc, it) => acc + (it.transitToNext?.distanceKm || 0), 0)
                        .toFixed(1)}km route
                    </Text>
                  </View>
                </View>

                {/* Mapbox Route Preview */}
                <View style={styles.dayRouteMapCanvas}>
                  <Image
                    source={{
                      uri: `https://api.mapbox.com/styles/v1/mapbox/${mode === 'dark' ? 'dark-v11' : 'streets-v12'}/static/${currentDay.items
                        .map((it, i) => {
                          const lng = Number(it.lng || 108.2272 + i * 0.015).toFixed(4);
                          const lat = Number(it.lat || 16.061 + i * 0.015).toFixed(4);
                          return `pin-s-${i + 1}+3B82F6(${lng},${lat})`;
                        })
                        .join(',')}/auto/600x120@2x?access_token=${
                        process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
                        'pk.eyJ1Ijoibm9tYWRpeCIsImEiOiJjbTFub21hZGl4ZGVtb3Rva2VuIn0.demo_token'
                      }`,
                    }}
                    style={styles.dayRouteMapImage}
                    resizeMode="cover"
                  />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dayRouteStopsRow}
                  >
                    {currentDay.items.map((it, i) => (
                      <View key={it.id || i} style={styles.dayRouteStopChip}>
                        <View style={styles.dayRouteStopNum}>
                          <Text style={styles.dayRouteStopNumText}>{i + 1}</Text>
                        </View>
                        <Text style={styles.dayRouteStopName} numberOfLines={1}>
                          Stop {i + 1}: {it.name}
                        </Text>
                        {i < currentDay.items.length - 1 && (
                          <Text style={styles.dayRouteArrow}>→</Text>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            {/* Timeline Stops */}
            <View style={styles.timelineSection}>
              <View style={styles.timelineHeaderRow}>
                <Text style={styles.sectionTitle}>Detailed Schedule (Day {selectedDayIndex})</Text>
                <TouchableOpacity
                  style={styles.addStopSmallBtn}
                  onPress={() => setAddStopModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addStopSmallBtnText}>+ Add Stop</Text>
                </TouchableOpacity>
              </View>

              {currentDay.items?.length === 0 ? (
                <View style={styles.emptyStopsBox}>
                  <Text style={styles.emptyText}>No stops scheduled for this day.</Text>
                  <TouchableOpacity
                    style={styles.addFirstStopBtn}
                    onPress={() => setAddStopModalVisible(true)}
                  >
                    <Text style={styles.addFirstStopText}>+ Add First Stop</Text>
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
                            Next transit: {item.transitToNext.distanceKm} km (
                            {item.transitToNext.durationMinutes} mins)
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
              <Text style={styles.heroExpenseLabel}>Total Trip Expenses</Text>
              <Text style={styles.heroExpenseValue}>
                {formatVND(debtSummary?.totalExpense || 3600000)}
              </Text>
              <Text style={styles.heroExpenseDesc}>
                Automated debt simplification & cash flow optimization
              </Text>
            </View>

            {/* Member Balances Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Member Balance Sheet</Text>
              {(debtSummary?.memberBalances || []).map((mb, idx) => (
                <View key={mb.userId || idx} style={styles.balanceRow}>
                  <Text style={styles.balanceMemberName}>{mb.fullName || 'Member'}</Text>
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
              <Text style={styles.sectionTitle}>Optimal Settlement Plan (Greedy)</Text>
              <Text style={styles.sectionSubDesc}>
                Minimum cash-flow algorithm reduces tangled debts to fewest transactions
              </Text>

              {(debtSummary?.simplifiedSettlements || []).map((st, idx) => (
                <View key={idx} style={styles.settlementCard}>
                  <View style={styles.settlementTextCol}>
                    <Text style={styles.settlementRoute}>
                      {st.fromUserName || 'Member'} pays {st.toUserName || 'Member'}
                    </Text>
                    <Text style={styles.settlementAmount}>{formatVND(st.amount)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.settleButton}
                    onPress={() => handleSettle(st)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.settleButtonText}>Settle Up</Text>
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
              <Text style={styles.modalTitle}>Invite Squad Member</Text>
              <Text style={styles.modalSubtitle}>
                Enter your friend's email to collaborate on itineraries and split expenses
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="e.g. friend@example.com"
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
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleInvite}
                >
                  <Text style={styles.modalSubmitText}>Send Invite</Text>
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
              <Text style={styles.modalTitle}>Add New Stop</Text>
              <Text style={styles.modalSubtitle}>
                Enter stop details for Day {selectedDayIndex}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Ba Na Hills, Datanla Waterfall, Eiffel Tower"
                placeholderTextColor={themeColors.textMuted}
                value={stopName}
                onChangeText={setStopName}
              />

              <View style={styles.modalTwoInputsRow}>
                <TextInput
                  style={[styles.modalInput, styles.halfInput]}
                  placeholder="e.g. 10:30 AM"
                  placeholderTextColor={themeColors.textMuted}
                  value={stopTime}
                  onChangeText={setStopTime}
                />
                <TextInput
                  style={[styles.modalInput, styles.halfInput]}
                  placeholder="e.g. 90 mins"
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
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleSaveStop}
                >
                  <Text style={styles.modalSubmitText}>Save Stop</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {renderCreateTripModal()}
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
  mapDiscoveryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  mapHeaderBackBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  mapHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  mapHeaderWizardBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#6366F1',
  },
  mapHeaderWizardBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  wizardPrimaryBtn: {
    width: '100%',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  wizardPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  exploreMapOutlineBtn: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowOpacity: 0,
  },
  exploreMapOutlineBtnText: {
    fontSize: 15,
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  dayRouteMapBanner: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayRouteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayRouteTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  dayRouteDistanceBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dayRouteDistanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
  },
  dayRouteMapCanvas: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  dayRouteMapImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  dayRouteStopsRow: {
    padding: 8,
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
  },
  dayRouteStopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayRouteStopNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayRouteStopNumText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dayRouteStopName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    maxWidth: 100,
  },
  dayRouteArrow: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 2,
  },
  wizardQuickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card === '#1E293B' ? '#1E1B4B' : '#EEF2FF',
    borderWidth: 1,
    borderColor: colors.card === '#1E293B' ? '#4F46E5' : '#C7D2FE',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  wizardQuickBarText: {
    color: colors.card === '#1E293B' ? '#A5B4FC' : '#4F46E5',
    fontWeight: '700',
    fontSize: 13,
  },
});


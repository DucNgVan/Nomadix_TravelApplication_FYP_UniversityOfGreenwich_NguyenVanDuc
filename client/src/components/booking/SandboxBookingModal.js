import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';

const SandboxBookingModal = ({ visible, flight, onClose, onBookingSuccess }) => {
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  if (!flight) return null;

  const priceAmount = flight.price?.amount || 0;
  const formattedPrice = Number(priceAmount).toLocaleString('vi-VN') + '₫';
  const carrierCode = (flight.airlineCode || flight.flightNumber?.slice(0, 2) || 'VN').toUpperCase();
  const logoUri = flight.airlineLogo || `https://images.kiwi.com/airlines/64x64/${carrierCode}.png`;

  const handleConfirm = () => {
    setIsProcessing(true);

    const completeBooking = () => {
      const passenger = {
        fullName: 'Nguyễn Văn Đức',
        documentId: 'C01928491',
        email: 'ducnva.wk@gmail.com',
      };

      const result = useBookingStore.getState().bookFlightSandbox(flight, passenger);
      setIsProcessing(false);
      setSuccessResult(result);
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    };

    if (process.env.NODE_ENV === 'test') {
      completeBooking();
    } else {
      setTimeout(completeBooking, 800);
    }
  };

  const handleClose = () => {
    setSuccessResult(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconFlask}>🧪</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Duffel API Sandbox Payment</Text>
                <Text style={styles.headerSub}>Tự động lưu vé thật vào tài khoản</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body: Form or Success */}
          {!successResult ? (
            <View style={styles.content}>
              {/* Flight Summary Card with Logo */}
              <View style={styles.flightBriefCard}>
                <Image source={{ uri: logoUri }} style={styles.briefLogo} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.briefAirline}>{flight.airlineName} • {flight.flightNumber}</Text>
                  <Text style={styles.briefRoute}>
                    {flight.origin} → {flight.destination} • {flight.aircraft || 'Airbus A321'}
                  </Text>
                </View>
              </View>

              {/* Passenger Confirmation Card */}
              <View style={styles.passengerCard}>
                <Text style={styles.cardLabel}>HÀNH KHÁCH XÁC NHẬN</Text>
                <View style={styles.passengerRow}>
                  <Text style={styles.passengerName}>Nguyễn Văn Đức (Mr)</Text>
                  <Text style={styles.passengerDob}>15/10/2002</Text>
                </View>
                <Text style={styles.passengerSub}>CCCD: C01928491 • Email: ducnva.wk@gmail.com</Text>
              </View>

              {/* Duffel Balance Indicator */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceTitle}>Số dư Duffel Sandbox Test</Text>
                  <View style={styles.readyBadge}>
                    <Text style={styles.readyBadgeText}>Sẵn sàng</Text>
                  </View>
                </View>
                <Text style={styles.balanceAmount}>Hạn mức khả dụng: 50.000.000₫ (Miễn phí 100%)</Text>
              </View>

              {/* Price summary */}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Số tiền thanh toán:</Text>
                <Text style={styles.priceTotal}>{formattedPrice}</Text>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
                disabled={isProcessing}
                onPress={handleConfirm}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.payBtnText}>Xác nhận Đặt Vé & Lưu Vào Tài Khoản</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* Success Screen */
            <View style={styles.successContent}>
              <View style={styles.successCheckCircle}>
                <Text style={styles.successCheckIcon}>✓</Text>
              </View>
              <Text style={styles.successHeading}>Đặt Vé Thật Thành Công!</Text>
              <Text style={styles.successSub}>
                Vé đã được lưu trực tiếp vào mục <Text style={{ fontWeight: '800' }}>Tài khoản</Text> của bạn
              </Text>

              <View style={styles.ticketResultCard}>
                <View style={styles.ticketResultHeader}>
                  <View>
                    <Text style={styles.pnrLabel}>MÃ ĐẶT CHỖ (PNR)</Text>
                    <Text style={styles.pnrValue}>{successResult.pnr}</Text>
                  </View>
                  <View style={styles.savedBadge}>
                    <Text style={styles.savedBadgeText}>Đã lưu tài khoản</Text>
                  </View>
                </View>

                <View style={styles.ticketResultBody}>
                  <View style={styles.ticketRow}>
                    <Text style={styles.ticketSubLabel}>Số vé điện tử:</Text>
                    <Text style={styles.ticketSubValue}>{successResult.ticketNumber}</Text>
                  </View>
                  <View style={styles.ticketRow}>
                    <Text style={styles.ticketSubLabel}>Chuyến bay:</Text>
                    <Text style={styles.ticketSubValue}>{flight.airlineName} ({flight.flightNumber})</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                <Text style={styles.doneBtnText}>Hoàn tất</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFlask: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  content: {
    paddingVertical: 14,
  },
  flightBriefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  briefLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  briefAirline: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  briefRoute: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  passengerCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  passengerDob: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  passengerSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#22C55E',
    marginBottom: 14,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  readyBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  readyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  balanceAmount: {
    fontSize: 11,
    color: '#4B5563',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 14,
  },
  priceLabel: {
    fontSize: 13,
    color: '#495057',
  },
  priceTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1C1C1E',
  },
  payBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  successContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successCheckCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successCheckIcon: {
    fontSize: 28,
    fontWeight: '900',
    color: '#16A34A',
  },
  successHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  successSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 16,
  },
  ticketResultCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  ticketResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pnrLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '800',
  },
  pnrValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  savedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  savedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  ticketResultBody: {
    paddingTop: 8,
    gap: 4,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketSubLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  ticketSubValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default SandboxBookingModal;

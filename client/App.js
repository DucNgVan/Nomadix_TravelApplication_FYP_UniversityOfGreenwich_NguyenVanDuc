import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import FlightSearchScreen from './src/screens/booking/FlightSearchScreen';
import HotelSearchScreen from './src/screens/booking/HotelSearchScreen';
import PlanScreen from './src/screens/plan/PlanScreen';
import ProfileScreen from './src/screens/account/ProfileScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import { useAuthStore } from './src/stores/auth.store';
import { useThemeStore } from './src/stores/theme.store';
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const { mode, colors: themeColors, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('flights'); // 'flights' | 'hotels' | 'plan' | 'account'
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'register'

  const authNavigation = {
    navigate: (screen) => {
      if (screen === 'Register' || screen === 'register') {
        setAuthScreen('register');
      } else {
        setAuthScreen('login');
      }
    },
  };

  // Auth Guard: Require login/register before entering application
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <StatusBar
          barStyle={mode === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={themeColors.background}
        />
        {authScreen === 'register' ? (
          <RegisterScreen navigation={authNavigation} />
        ) : (
          <LoginScreen navigation={authNavigation} />
        )}
      </SafeAreaView>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'flights':
        return <FlightSearchScreen />;
      case 'hotels':
        return <HotelSearchScreen />;
      case 'plan':
        return <PlanScreen />;
      case 'account':
        return <ProfileScreen />;
      default:
        return <FlightSearchScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={mode === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={themeColors.background}
      />

      {/* Top Header with Theme Switcher */}
      <View style={[styles.topBar, { backgroundColor: themeColors.background, borderBottomColor: themeColors.border }]}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandDot, { color: themeColors.primary }]}>●</Text>
          <Text style={[styles.brandTitle, { color: themeColors.text }]}>NOMADIX</Text>
        </View>
        <TouchableOpacity
          style={[styles.themePill, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
          onPress={toggleTheme}
          activeOpacity={0.8}
          testID="app-theme-toggle"
        >
          <Text style={[styles.themePillText, { color: themeColors.text }]}>
            {mode === 'light' ? '☀️ Sáng' : '🌙 Tối'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Screen Content */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Bottom Navigation Bar: Exactly 4 Tabs with Monochrome Icons */}
      <View style={[styles.bottomBar, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'flights' && styles.tabButtonActive]}
          onPress={() => setActiveTab('flights')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabGlyph, activeTab === 'flights' && styles.tabGlyphActive]}>
            ✈
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'flights' && styles.tabLabelActive]}>
            Chuyến bay
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'hotels' && styles.tabButtonActive]}
          onPress={() => setActiveTab('hotels')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabGlyph, activeTab === 'hotels' && styles.tabGlyphActive]}>
            ⌂
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'hotels' && styles.tabLabelActive]}>
            Khách sạn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'plan' && styles.tabButtonActive]}
          onPress={() => setActiveTab('plan')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabGlyph, activeTab === 'plan' && styles.tabGlyphActive]}>
            ⊞
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'plan' && styles.tabLabelActive]}>
            Kế hoạch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'account' && styles.tabButtonActive]}
          onPress={() => setActiveTab('account')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabGlyph, activeTab === 'account' && styles.tabGlyphActive]}>
            ⊙
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'account' && styles.tabLabelActive]}>
            Tài khoản
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandDot: {
    fontSize: 14,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  themePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
  },
  tabGlyph: {
    fontSize: 20,
    color: colors.textMuted,
    marginBottom: 3,
  },
  tabGlyphActive: {
    color: colors.primary,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});

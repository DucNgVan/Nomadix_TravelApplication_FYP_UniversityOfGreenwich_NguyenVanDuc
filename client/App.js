import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
      <SafeAreaProvider>
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
      </SafeAreaProvider>
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

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'flights':
        return 'Search Flights';
      case 'hotels':
        return 'Hotels & Resorts';
      case 'plan':
        return 'Trip Planner';
      case 'account':
        return 'My Profile';
      default:
        return 'NOMADIX';
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <StatusBar
          barStyle={mode === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={themeColors.background}
        />

        {/* Top Header: Screen Title on Left & Small NOMADIX on Right */}
        <View style={[styles.topBar, { backgroundColor: themeColors.background, borderBottomColor: themeColors.border }]}>
          <Text style={[styles.screenTitleTop, { color: themeColors.text }]}>
            {getScreenTitle()}
          </Text>
          <View style={[styles.brandBadgeRight, { backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,122,255,0.08)' }]}>
            <Text style={[styles.brandDotSmall, { color: themeColors.primary }]}>●</Text>
            <Text style={[styles.brandTitleSmall, { color: themeColors.primary }]}>NOMADIX</Text>
          </View>
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
              Flights
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
              Hotels
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
              Plan
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
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  screenTitleTop: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  brandBadgeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  brandDotSmall: {
    fontSize: 8,
  },
  brandTitleSmall: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
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

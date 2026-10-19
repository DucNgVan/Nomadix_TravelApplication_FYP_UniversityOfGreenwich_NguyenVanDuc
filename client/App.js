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
        return 'Flight Booking';
      case 'hotels':
        return 'Hotel Booking';
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
        <View style={[styles.topBar, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
          <View>
            <Text style={[styles.screenTitleTop, { color: themeColors.text }]}>
              {getScreenTitle()}
            </Text>
          </View>
          <View style={[styles.brandBadgeRight, { backgroundColor: mode === 'dark' ? 'rgba(0,102,255,0.15)' : 'rgba(0,102,255,0.08)' }]}>
            <View style={[styles.brandDotSmall, { backgroundColor: themeColors.primary }]} />
            <Text style={[styles.brandTitleSmall, { color: themeColors.primary }]}>NOMADIX</Text>
          </View>
        </View>

        {/* Main Screen Content */}
        <View style={styles.screenContainer}>{renderActiveScreen()}</View>

        {/* Bottom Navigation Bar: Exactly 4 Tabs with Ergonomic Active Pills */}
        <View style={[styles.bottomBar, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'flights' && [styles.tabButtonActive, { backgroundColor: mode === 'dark' ? 'rgba(0,102,255,0.2)' : 'rgba(0,102,255,0.08)' }]]}
            onPress={() => setActiveTab('flights')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabGlyph, activeTab === 'flights' && { color: themeColors.primary }]}>
              ✈
            </Text>
            <Text style={[styles.tabLabel, { color: activeTab === 'flights' ? themeColors.primary : themeColors.textMuted }, activeTab === 'flights' && styles.tabLabelActive]}>
              Flights
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'hotels' && [styles.tabButtonActive, { backgroundColor: mode === 'dark' ? 'rgba(0,102,255,0.2)' : 'rgba(0,102,255,0.08)' }]]}
            onPress={() => setActiveTab('hotels')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabGlyph, activeTab === 'hotels' && { color: themeColors.primary }]}>
              🏨
            </Text>
            <Text style={[styles.tabLabel, { color: activeTab === 'hotels' ? themeColors.primary : themeColors.textMuted }, activeTab === 'hotels' && styles.tabLabelActive]}>
              Hotels
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'plan' && [styles.tabButtonActive, { backgroundColor: mode === 'dark' ? 'rgba(0,102,255,0.2)' : 'rgba(0,102,255,0.08)' }]]}
            onPress={() => setActiveTab('plan')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabGlyph, activeTab === 'plan' && { color: themeColors.primary }]}>
              🗺
            </Text>
            <Text style={[styles.tabLabel, { color: activeTab === 'plan' ? themeColors.primary : themeColors.textMuted }, activeTab === 'plan' && styles.tabLabelActive]}>
              Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'account' && [styles.tabButtonActive, { backgroundColor: mode === 'dark' ? 'rgba(0,102,255,0.2)' : 'rgba(0,102,255,0.08)' }]]}
            onPress={() => setActiveTab('account')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabGlyph, activeTab === 'account' && { color: themeColors.primary }]}>
              👤
            </Text>
            <Text style={[styles.tabLabel, { color: activeTab === 'account' ? themeColors.primary : themeColors.textMuted }, activeTab === 'account' && styles.tabLabelActive]}>
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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  screenTitleTop: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  brandBadgeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  brandDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  brandTitleSmall: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  screenContainer: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tabButtonActive: {
    transform: [{ scale: 1.02 }],
  },
  tabGlyph: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});

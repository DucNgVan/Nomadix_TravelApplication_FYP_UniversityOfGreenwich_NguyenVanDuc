import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';

export default function RegisterScreen({ navigation }) {
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { register, isLoading, error: authError } = useAuthStore();

  const validate = () => {
    let isValid = true;

    if (!fullName || fullName.trim().length < 2) {
      setFullNameError('Full name must be at least 2 characters');
      isValid = false;
    } else {
      setFullNameError('');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
    } catch (err) {
      // Handled by store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.logo}>NOMADIX</Text>
          <Text style={styles.subtitle}>Create a new account to begin your journey</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="e.g. John Doe"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (fullNameError) setFullNameError('');
            }}
            error={fullNameError}
          />

          <Input
            label="Email Address"
            placeholder="e.g. alex@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            error={emailError}
          />

          <Input
            label="Password"
            placeholder="e.g. ••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            secureTextEntry
            error={passwordError}
          />

          {authError ? <Text style={styles.authError}>{authError}</Text> : null}

          <Button
            title="Create Account"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    letterSpacing: 2,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  submitBtn: {
    marginTop: 16,
  },
  authError: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

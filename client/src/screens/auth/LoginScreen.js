import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../stores/auth.store';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isLoading, error: authError } = useAuthStore();

  const validate = () => {
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailError('Vui lòng nhập email hợp lệ');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await login(email.trim(), password);
    } catch {
      // Auth error handled by store
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('abc@gmail.com');
    setPassword('123');
    try {
      await login('abc@gmail.com', '123');
    } catch {
      // Handled by store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.logo}>NOMADIX</Text>
          <Text style={styles.subtitle}>Khám phá & Lập kế hoạch du lịch nhóm thông minh</Text>
        </View>

        <View style={styles.card}>
          {/* Quick Demo Login Badge */}
          <TouchableOpacity
            style={styles.demoLoginBtn}
            onPress={handleQuickDemoLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.demoLoginText}>⚡ 1-Tap: Vào ngay Demo (abc@gmail.com / 123)</Text>
          </TouchableOpacity>

          <Input
            label="Email"
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            error={emailError}
          />

          <Input
            label="Mật khẩu / Password"
            placeholder="Nhập mật khẩu"
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
            title="Đăng nhập / Login"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    letterSpacing: 3,
    fontWeight: '900',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoLoginBtn: {
    backgroundColor: 'rgba(255, 214, 10, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  demoLoginText: {
    color: '#FFD60A',
    fontWeight: '700',
    fontSize: 12,
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
    marginTop: 18,
  },
  footerText: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 13,
  },
  registerLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});

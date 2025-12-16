// LoginScreen - Authentication screen with email/password
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { signUp, signIn } from '../services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('입력 오류', '비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login using authService
        await signIn({ email, password });
      } else {
        // Sign up using authService (creates user profile, character, daily state)
        await signUp({ email, password });
        Alert.alert('가입 완료', '회원가입이 완료되었습니다!');
      }
    } catch (error: any) {
      console.log('[LoginScreen] Auth error full:', JSON.stringify(error, null, 2));
      const message = error?.message || '인증에 실패했습니다.';
      Alert.alert('오류', `${message}\n\n(Code: ${error?.code || 'unknown'})`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    // Generate unique demo email with timestamp
    const timestamp = Date.now();
    const demoEmail = `demo${timestamp}@carenavi.app`;
    const demoPassword = 'demo123456';

    setIsLoading(true);
    try {
      // Create new demo account using authService
      await signUp({ email: demoEmail, password: demoPassword });
    } catch (error: any) {
      console.log('[LoginScreen] Demo error full:', JSON.stringify(error, null, 2));
      const message = error?.message || '데모 로그인에 실패했습니다.';
      const details = JSON.stringify(error, null, 2);
      Alert.alert('오류', `${message}\n\nCode: ${error?.code || 'unknown'}\nStatus: ${error?.status || 'unknown'}\n\nDetails:\n${details.substring(0, 500)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🐣</Text>
            <Text style={styles.title}>CareNavi</Text>
            <Text style={styles.subtitle}>AI 기반 건강 케어 앱</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? '로그인' : '회원가입'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Login */}
          <View style={styles.demoSection}>
            <Text style={styles.demoText}>또는</Text>
            <TouchableOpacity
              style={[styles.demoButton, isLoading && styles.buttonDisabled]}
              onPress={handleDemoLogin}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>체험하기 (로그인 없이)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#4A90D9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchText: {
    color: '#4A90D9',
    fontSize: 14,
  },
  demoSection: {
    alignItems: 'center',
  },
  demoText: {
    color: '#999',
    marginBottom: 12,
  },
  demoButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#4A90D9',
  },
  demoButtonText: {
    color: '#4A90D9',
    fontSize: 16,
    fontWeight: '600',
  },
});

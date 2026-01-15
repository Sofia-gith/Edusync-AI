import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../styles/auth.styles';
import { Colors } from '../styles/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = () => {
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    // TODO: Implementar lógica de reset de senha
    console.log('Reset password for:', email);
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <View style={authStyles.container}>
        <ScrollView contentContainerStyle={authStyles.scrollContent}>
          {/* Back Button */}
          <TouchableOpacity
            style={{ padding: 16, alignSelf: 'flex-start' }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          {/* Success Message */}
          <View style={[authStyles.form, { justifyContent: 'center', alignItems: 'center' }]}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: Colors.primaryLight,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Ionicons name="mail-outline" size={48} color={Colors.primary} />
            </View>

            <Text
              style={[
                authStyles.title,
                { textAlign: 'center', marginBottom: 12 },
              ]}
            >
              Check Your Email
            </Text>

            <Text
              style={[
                authStyles.subtitle,
                { textAlign: 'center', marginBottom: 32 },
              ]}
            >
              We&apos;ve sent a password reset link to{'\n'}
              <Text style={{ fontWeight: '600', color: Colors.primary }}>
                {email}
              </Text>
            </Text>

            <TouchableOpacity
              style={authStyles.button}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={authStyles.buttonText}>Back to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 16, padding: 12 }}
              onPress={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              <Text style={{ color: Colors.primary, fontSize: 16 }}>
                Resend Email
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={{ padding: 16, alignSelf: 'flex-start' }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={[authStyles.header, { paddingTop: 20 }]}>
          <View style={authStyles.logo}>
            <Text style={authStyles.logoText}>E</Text>
          </View>
        </View>

        {/* Form */}
        <View style={authStyles.form}>
          <Text style={authStyles.title}>Forgot Password?</Text>
          <Text style={authStyles.subtitle}>
            Don&apos;t worry! Enter your email and we&apos;ll send you a link to
            reset your password.
          </Text>

          {/* Email Input */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Email</Text>
            <View
              style={[
                authStyles.inputWrapper,
                emailFocused && authStyles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailFocused ? Colors.primary : Colors.textTertiary}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {error ? <Text style={authStyles.errorText}>{error}</Text> : null}
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={[
              authStyles.button,
              !email && authStyles.buttonDisabled,
            ]}
            onPress={handleResetPassword}
            disabled={!email}
          >
            <Text style={authStyles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 24, padding: 12 }}
            onPress={() => router.back()}
          >
            <Text style={{ color: Colors.textSecondary, fontSize: 16 }}>
              Remember your password?{' '}
              <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

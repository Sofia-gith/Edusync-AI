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
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../styles/auth.styles';
import { Colors } from '../styles/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    // Resetar erros
    setErrors({ email: '', password: '' });

    // Validações
    let hasError = false;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // TODO: Implementar lógica de autenticação
    console.log('Login:', { email, password });
    
    // Navegar para home após login bem-sucedido
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={authStyles.header}>
          <View style={authStyles.logo}>
            <Text style={authStyles.logoText}>E</Text>
          </View>
          <Text style={authStyles.appName}>EduSync</Text>
          <Text style={authStyles.tagline}>Your pocket mentor</Text>
        </View>

        {/* Form */}
        <View style={authStyles.form}>
          <Text style={authStyles.title}>Welcome back!</Text>
          <Text style={authStyles.subtitle}>
            Sign in to continue your teaching journey
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
            {errors.email ? (
              <Text style={authStyles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Password</Text>
            <View
              style={[
                authStyles.inputWrapper,
                passwordFocused && authStyles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordFocused ? Colors.primary : Colors.textTertiary}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Enter your password"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={authStyles.inputIconRight}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={authStyles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={authStyles.forgotPassword}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={authStyles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              authStyles.button,
              (!email || !password) && authStyles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!email || !password}
          >
            <Text style={authStyles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={authStyles.divider}>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.dividerText}>OR</Text>
            <View style={authStyles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={authStyles.socialButtons}>
            <TouchableOpacity style={authStyles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={authStyles.socialButtonText}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.socialButton}>
              <Ionicons name="logo-apple" size={24} color="#000" />
              <Text style={authStyles.socialButtonText}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={authStyles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../styles/auth.styles';
import { Colors } from '../styles/theme';

const SCHOOL_TYPES = ['Rural', 'Urban', 'Semi-urban'];
const GRADES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSchoolTypePicker, setShowSchoolTypePicker] = useState(false);
  const [showGradesPicker, setShowGradesPicker] = useState(false);
  
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [schoolNameFocused, setSchoolNameFocused] = useState(false);
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    schoolType: '',
    grades: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const toggleGrade = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter(g => g !== grade));
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  const handleRegister = () => {
    // Resetar erros
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolName: '',
      schoolType: '',
      grades: '',
    });

    // Validações
    let hasError = false;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolName: '',
      schoolType: '',
      grades: '',
    };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      hasError = true;
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (!schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
      hasError = true;
    }

    if (!schoolType) {
      newErrors.schoolType = 'Please select school type';
      hasError = true;
    }

    if (selectedGrades.length === 0) {
      newErrors.grades = 'Please select at least one grade';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // TODO: Implementar lógica de registro
    console.log('Register:', {
      name,
      email,
      password,
      schoolName,
      schoolType,
      grades: selectedGrades,
    });

    // Navegar para home após registro bem-sucedido
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
          <Text style={authStyles.title}>Create Account</Text>
          <Text style={authStyles.subtitle}>
            Join EduSync and transform your teaching
          </Text>

          {/* Name Input */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Full Name</Text>
            <View
              style={[
                authStyles.inputWrapper,
                nameFocused && authStyles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={nameFocused ? Colors.primary : Colors.textTertiary}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                autoCapitalize="words"
              />
            </View>
            {errors.name ? (
              <Text style={authStyles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

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
                placeholder="Create a password"
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

          {/* Confirm Password Input */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Confirm Password</Text>
            <View
              style={[
                authStyles.inputWrapper,
                confirmPasswordFocused && authStyles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={confirmPasswordFocused ? Colors.primary : Colors.textTertiary}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Confirm your password"
                placeholderTextColor={Colors.textTertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={authStyles.inputIconRight}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={authStyles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          {/* School Name Input */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>School Name</Text>
            <View
              style={[
                authStyles.inputWrapper,
                schoolNameFocused && authStyles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="school-outline"
                size={20}
                color={schoolNameFocused ? Colors.primary : Colors.textTertiary}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Enter your school name"
                placeholderTextColor={Colors.textTertiary}
                value={schoolName}
                onChangeText={setSchoolName}
                onFocus={() => setSchoolNameFocused(true)}
                onBlur={() => setSchoolNameFocused(false)}
                autoCapitalize="words"
              />
            </View>
            {errors.schoolName ? (
              <Text style={authStyles.errorText}>{errors.schoolName}</Text>
            ) : null}
          </View>

          {/* School Type Picker */}
          <View style={authStyles.pickerContainer}>
            <Text style={authStyles.pickerLabel}>School Type</Text>
            <TouchableOpacity
              style={authStyles.pickerWrapper}
              onPress={() => setShowSchoolTypePicker(true)}
            >
              <Text
                style={[
                  authStyles.pickerText,
                  !schoolType && authStyles.pickerPlaceholder,
                ]}
              >
                {schoolType || 'Select school type'}
              </Text>
            </TouchableOpacity>
            {errors.schoolType ? (
              <Text style={authStyles.errorText}>{errors.schoolType}</Text>
            ) : null}
          </View>

          {/* Grades Picker */}
          <View style={authStyles.pickerContainer}>
            <Text style={authStyles.pickerLabel}>Grades You Teach</Text>
            <TouchableOpacity
              style={authStyles.pickerWrapper}
              onPress={() => setShowGradesPicker(true)}
            >
              <Text
                style={[
                  authStyles.pickerText,
                  selectedGrades.length === 0 && authStyles.pickerPlaceholder,
                ]}
              >
                {selectedGrades.length > 0
                  ? selectedGrades.join(', ')
                  : 'Select grades'}
              </Text>
            </TouchableOpacity>
            {errors.grades ? (
              <Text style={authStyles.errorText}>{errors.grades}</Text>
            ) : null}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[authStyles.button, { marginTop: 8 }]}
            onPress={handleRegister}
          >
            <Text style={authStyles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={authStyles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      {/* School Type Picker Modal */}
      <Modal
        visible={showSchoolTypePicker}
        transparent
        animationType="slide"
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPress={() => setShowSchoolTypePicker(false)}
        >
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 }}>
            <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>Select School Type</Text>
            </View>
            {SCHOOL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderLight }}
                onPress={() => {
                  setSchoolType(type);
                  setShowSchoolTypePicker(false);
                }}
              >
                <Text style={{ fontSize: 16, color: schoolType === type ? Colors.primary : Colors.textPrimary }}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Grades Picker Modal */}
      <Modal
        visible={showGradesPicker}
        transparent
        animationType="slide"
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPress={() => setShowGradesPicker(false)}
        >
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40, maxHeight: '60%' }}>
            <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>Select Grades</Text>
              <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 4 }}>
                Select multiple grades
              </Text>
            </View>
            <ScrollView>
              {GRADES.map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.borderLight,
                  }}
                  onPress={() => toggleGrade(grade)}
                >
                  <Ionicons
                    name={selectedGrades.includes(grade) ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={selectedGrades.includes(grade) ? Colors.primary : Colors.textTertiary}
                  />
                  <Text style={{ fontSize: 16, marginLeft: 12, color: Colors.textPrimary }}>
                    {grade} Grade
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[authStyles.button, { marginHorizontal: 20, marginTop: 20 }]}
              onPress={() => setShowGradesPicker(false)}
            >
              <Text style={authStyles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
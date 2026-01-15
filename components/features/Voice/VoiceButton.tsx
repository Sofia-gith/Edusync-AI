import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, Shadows } from '../../../app/styles/theme';



interface VoiceButtonProps {
  isListening: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  isListening, 
  onPress,
  disabled = false 
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isListening) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
      fadeAnim.setValue(0.3);
    }
  }, [isListening, pulseAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Pulsing circle animation */}
      <Animated.View 
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: pulseAnim }],
            opacity: isListening ? fadeAnim : 0,
            backgroundColor: isListening ? '#DC2626' : Colors.primary,
          }
        ]} 
      />
      
      {/* Main voice button */}
      <TouchableOpacity 
        style={[
          styles.button, 
          isListening && styles.buttonListening,
          disabled && styles.buttonDisabled
        ]} 
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Ionicons 
          name={isListening ? "mic" : "mic-outline"} 
          size={64} 
          color={Colors.white} 
        />
      </TouchableOpacity>
      
      <Text style={styles.label}>
        {isListening ? 'Listening...' : 'Tap to speak'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: 0,
    left: '50%',
    marginLeft: -100,
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.medium,
    position: 'relative',
    zIndex: 1,
  },
  buttonListening: {
    backgroundColor: '#DC2626',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../../../app/styles/theme';

interface PedagogicalTipProps {
  tip: string;
  onClose: () => void;
  title?: string;
}

export const PedagogicalTip: React.FC<PedagogicalTipProps> = ({ 
  tip, 
  onClose,
  title = "QUICK TIP" 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="bulb-outline" size={24} color={Colors.accent} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>{tip}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.accent,
  },
  text: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});
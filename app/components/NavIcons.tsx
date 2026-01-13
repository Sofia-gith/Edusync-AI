// app/components/NavIcons.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IconProps {
  color: string;
  focused?: boolean;
}

export const HomeIcon = ({ color }: IconProps) => (
  <View style={styles.iconContainer}>
    <View style={[styles.homeBase, { backgroundColor: color }]} />
    <View style={[styles.homeRoof, { borderBottomColor: color }]} />
  </View>
);

export const HistoryIcon = ({ color }: IconProps) => (
  <View style={styles.iconContainer}>
    <View style={[styles.clockCircle, { borderColor: color }]}>
      <View style={[styles.clockHourHand, { backgroundColor: color }]} />
      <View style={[styles.clockMinuteHand, { backgroundColor: color }]} />
    </View>
  </View>
);

export const ResourcesIcon = ({ color }: IconProps) => (
  <View style={styles.iconContainer}>
    <View style={[styles.bookCover, { backgroundColor: color }]} />
    <View style={[styles.bookPages, { borderColor: color }]} />
  </View>
);

export const ProfileIcon = ({ color }: IconProps) => (
  <View style={styles.iconContainer}>
    <View style={[styles.personHead, { backgroundColor: color }]} />
    <View style={[styles.personBody, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Home Icon
  homeBase: {
    width: 16,
    height: 10,
    position: 'absolute',
    bottom: 2,
  },
  homeRoof: {
    position: 'absolute',
    top: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  
  // History/Clock Icon
  clockCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockHourHand: {
    position: 'absolute',
    width: 2,
    height: 5,
    top: 2,
  },
  clockMinuteHand: {
    position: 'absolute',
    width: 2,
    height: 7,
    bottom: 2,
  },
  
  // Resources/Book Icon
  bookCover: {
    width: 14,
    height: 18,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  bookPages: {
    position: 'absolute',
    right: 4,
    width: 12,
    height: 16,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  
  // Profile/Person Icon
  personHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 2,
  },
  personBody: {
    width: 14,
    height: 10,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    position: 'absolute',
    bottom: 2,
  },
});
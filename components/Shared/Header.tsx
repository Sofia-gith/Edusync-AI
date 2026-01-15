import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights } from '../../app/styles/theme';

interface AppHeaderProps {
  userName?: string;
  appName: string;
  subtitle?: string;
  showSettings?: boolean;
  showProfile?: boolean;
  showOfflineStatus?: boolean;
  onSettingsPress?: () => void;
  onProfilePress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  userName,
  appName,
  subtitle,
  showSettings = false,
  showProfile = false,
  showOfflineStatus = true,
  onSettingsPress,
  onProfilePress,
}) => {
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : 'E';

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <View>
          <Text style={styles.title}>{appName}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.headerRight}>
        {showOfflineStatus && (
          <View style={styles.statusBadge}>
            <View style={styles.offlineDot} />
            <Text style={styles.badgeText}>Offline</Text>
          </View>
        )}
        
        {showSettings && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onSettingsPress}
          >
            <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
        
        {showProfile && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onProfilePress}
          >
            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textTertiary,
  },
  badgeText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  iconButton: {
    padding: Spacing.xs,
  },
});
// styles/profile.styles.ts
import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from './theme';

export const profileStyles = StyleSheet.create({
  // Profile Section
  profileSection: {
    alignItems: 'center',
    padding: Spacing.huge,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE8D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarIcon: {
    fontSize: 48,
  },
  userName: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userRole: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xxl,
    backgroundColor: '#F0F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  statNumber: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Context Items
  contextItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  contextLabel: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  contextValue: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  // Settings Items
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: FontSizes.xxl,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: FontSizes.xxl,
    color: Colors.border,
    fontWeight: '300',
  },

  // Toggle Switch
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 2,
    alignItems: 'flex-end',
  },
  toggleActive: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: Colors.white,
  },

  // Logout Button
  logoutButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.error,
  },
});
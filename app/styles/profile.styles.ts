import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from './theme';

export const profileStyles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    padding: Spacing.xxxl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userRole: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userSchool: {
    fontSize: FontSizes.base,
    color: Colors.textTertiary,
  },

  // Stats
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
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
  },
  statNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Settings
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
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
    marginTop: Spacing.sm,
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
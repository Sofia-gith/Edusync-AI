import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from './theme';

export const historyStyles = StyleSheet.create({
  searchButton: {
    padding: Spacing.sm,
  },
  searchIcon: {
    fontSize: 20,
  },

  conversationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  cardDate: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
  },
  cardPreview: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  actionIcon: {
    fontSize: FontSizes.xl,
  },
});

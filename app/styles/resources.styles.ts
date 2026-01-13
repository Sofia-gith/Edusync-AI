import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from './theme';

export const resourcesStyles = StyleSheet.create({
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.xl,
    gap: Spacing.xs,
  },
  syncIcon: {
    fontSize: FontSizes.base,
  },
  syncText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },

  // Category Filter
  categoryContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.borderLight,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: FontSizes.lg,
  },
  categoryLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  categoryLabelActive: {
    color: Colors.white,
  },

  // Resource Card
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  resourceIconText: {
    fontSize: FontSizes.xxl,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  resourceDescription: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: Colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  categoryTagText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  downloadButton: {
    padding: Spacing.xs,
  },
  downloadIcon: {
    fontSize: FontSizes.xl,
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  infoBannerIcon: {
    fontSize: FontSizes.xxl,
    marginRight: Spacing.md,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.info,
    marginBottom: Spacing.xs,
  },
  infoBannerText: {
    fontSize: FontSizes.sm,
    color: Colors.infoDark,
    lineHeight: 18,
  },
});
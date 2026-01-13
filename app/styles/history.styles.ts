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
  
  // Ícone de alto-falante pequeno
  speakerIconSmall: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  speakerBodySmall: {
    width: 6,
    height: 8,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  speakerWaveSmall: {
    width: 5,
    height: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderLeftWidth: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    marginLeft: 1,
  },
  
  // Ícone de mais opções (três pontos)
  moreIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  moreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
  },
});
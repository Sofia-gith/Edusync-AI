// styles/home.styles.ts
import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from './theme';

export const homeStyles = StyleSheet.create({
  greetingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
    marginTop: Spacing.xl,
  },
  greeting: {
    fontSize: FontSizes.huge,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  question: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
  },

  // Voice Button Container
  voiceContainer: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
    position: 'relative',
  },

  // Pulsing circle animation
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    top: 0,
    left: '50%',
    marginLeft: -100,
  },

  // Minimalist Voice Button
  voiceButtonMinimal: {
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
  voiceButtonActive: {
    backgroundColor: Colors.primaryDark,
  },
  voiceButtonListening: {
    backgroundColor: '#DC2626', // Vermelho quando está escutando
  },

  // Minimalist Microphone Icon
  micIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBody: {
    width: 32,
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 4,
  },
  micBase: {
    width: 48,
    height: 3,
    backgroundColor: Colors.white,
    borderRadius: 2,
    marginBottom: 2,
  },
  micStand: {
    width: 3,
    height: 12,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },

  voiceLabel: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },

  // Pedagogical Tip
  tipContainer: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tipIconContainer: {
    marginRight: Spacing.sm,
  },
  // Ícone de lâmpada minimalista
  lightbulbIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightbulbTop: {
    width: 12,
    height: 14,
    backgroundColor: Colors.accent,
    borderRadius: 6,
    marginBottom: 1,
  },
  lightbulbBase: {
    width: 8,
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  tipTitle: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.accent,
  },
  // Ícone de fechar minimalista (X)
  closeIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  closeLine1: {
    position: 'absolute',
    width: 14,
    height: 2,
    backgroundColor: Colors.textTertiary,
    transform: [{ rotate: '45deg' }],
  },
  closeLine2: {
    position: 'absolute',
    width: 14,
    height: 2,
    backgroundColor: Colors.textTertiary,
    transform: [{ rotate: '-45deg' }],
  },
  tipText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    lineHeight: 20,
  },

  // Last Conversation
  lastConversation: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  // Ícone de chat minimalista
  chatIcon: {
    width: 24,
    height: 24,
    marginRight: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBubble: {
    width: 18,
    height: 14,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  chatTail: {
    position: 'absolute',
    bottom: 2,
    left: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
  },
  conversationTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },

  // User Message
  messageUser: {
    backgroundColor: Colors.userMessage,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomRightRadius: Spacing.xs,
    marginBottom: Spacing.md,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  messageUserText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    lineHeight: 20,
  },
  messageTimeUser: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },

  // Assistant Message
  messageAssistant: {
    flexDirection: 'row',
    maxWidth: '90%',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginTop: Spacing.xs,
  },
  // Ícone de robô minimalista
  robotIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotHead: {
    width: 14,
    height: 12,
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  robotAntenna: {
    position: 'absolute',
    top: -3,
    width: 2,
    height: 4,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  messageAssistantContent: {
    flex: 1,
    backgroundColor: Colors.assistantMessage,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: Spacing.xs,
  },
  messageAssistantText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  messageTime: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
  },
  // Ícone de alto-falante minimalista
  speakerIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  speakerBody: {
    width: 8,
    height: 10,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  speakerWave1: {
    width: 4,
    height: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderLeftWidth: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginLeft: 1,
  },
  speakerWave2: {
    width: 6,
    height: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderLeftWidth: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    marginLeft: 1,
  },
});
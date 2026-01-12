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

  // Voice Button
  voiceContainer: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },
  voiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },
  voiceButtonActive: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 1.05 }],
  },
  micIcon: {
    fontSize: 40,
  },
  voiceLabel: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
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
  tipIcon: {
    fontSize: 20,
  },
  tipTitle: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.accent,
  },
  closeButton: {
    fontSize: FontSizes.xl,
    color: Colors.textTertiary,
    padding: Spacing.xs,
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
  conversationIcon: {
    fontSize: FontSizes.xl,
    marginRight: Spacing.sm,
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
  assistantAvatarText: {
    fontSize: FontSizes.lg,
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
  audioIcon: {
    fontSize: FontSizes.lg,
  },
});
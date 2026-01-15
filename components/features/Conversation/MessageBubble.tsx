import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../../app/styles/theme';

export type MessageRole = 'user' | 'assistant';

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  timestamp: string;
  onPlayAudio?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  timestamp,
  onPlayAudio,
}) => {
  if (role === 'user') {
    return (
      <View style={styles.messageUser}>
        <Text style={styles.messageUserText}>{content}</Text>
        <Text style={styles.messageTimeUser}>{timestamp}</Text>
      </View>
    );
  }

  return (
    <View style={styles.messageAssistant}>
      <View style={styles.assistantAvatar}>
        <Ionicons name="logo-android" size={20} color={Colors.white} />
      </View>
      <View style={styles.messageAssistantContent}>
        <Text style={styles.messageAssistantText}>{content}</Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{timestamp}</Text>
          {onPlayAudio && (
            <TouchableOpacity onPress={onPlayAudio}>
              <Ionicons name="volume-high" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
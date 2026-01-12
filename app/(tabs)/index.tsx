import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView 
} from 'react-native';

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const handleVoicePress = () => {
    setIsListening(!isListening);
    // Add voice recognition logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>E</Text>
          </View>
          <View>
            <Text style={styles.title}>EduSync</Text>
            <Text style={styles.subtitle}>Your pocket mentor</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusBadge}>
            <View style={styles.offlineDot} />
            <Text style={styles.statusText}>Offline</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
      >
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello, Sunita! 👋</Text>
          <Text style={styles.question}>How can I help your class today?</Text>
        </View>

        {/* Voice Button */}
        <View style={styles.voiceContainer}>
          <TouchableOpacity 
            style={[
              styles.voiceButton, 
              isListening && styles.voiceButtonActive
            ]} 
            onPress={handleVoicePress}
            activeOpacity={0.8}
          >
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
          <Text style={styles.voiceLabel}>Tap to speak</Text>
        </View>

        {/* Pedagogical Tip */}
        {showTip && (
          <View style={styles.tipContainer}>
            <View style={styles.tipHeader}>
              <View style={styles.tipIconContainer}>
                <Text style={styles.tipIcon}>💡</Text>
              </View>
              <Text style={styles.tipTitle}>QUICK TIP</Text>
              <TouchableOpacity onPress={() => setShowTip(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.tipText}>
              In multi-grade classrooms, older students can serve as 'peer monitors' 
              for younger ones. This develops leadership skills and frees you up to 
              support students who need the most help.
            </Text>
          </View>
        )}

        {/* Last Conversation */}
        <View style={styles.lastConversation}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationIcon}>💬</Text>
            <Text style={styles.conversationTitle}>Last conversation</Text>
          </View>

          {/* User Message */}
          <View style={styles.messageUser}>
            <Text style={styles.messageUserText}>
              How to organize activities for multi-grade classroom with limited resources?
            </Text>
            <Text style={styles.messageTimeUser}>13:53</Text>
          </View>

          {/* Assistant Response */}
          <View style={styles.messageAssistant}>
            <View style={styles.assistantAvatar}>
              <Text style={styles.assistantAvatarText}>🤖</Text>
            </View>
            <View style={styles.messageAssistantContent}>
              <Text style={styles.messageAssistantText}>
                Sunita, for multi-grade classrooms with limited resources, I recommend 
                the 'Rotating Stations' strategy: divide your classroom into 3 corners - 
                silent reading, guided activity with you, and collaborative work between 
                grades. Rotate every 15 minutes. Older students can be 'tutors' for 
                younger ones.
              </Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>13:53</Text>
                <TouchableOpacity>
                  <Text style={styles.audioIcon}>🔊</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5DCED9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  iconButton: {
    padding: 4,
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  question: {
    fontSize: 16,
    color: '#666',
  },
  voiceContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  voiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5DCED9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  voiceButtonActive: {
    backgroundColor: '#4AB8C4',
    transform: [{ scale: 1.05 }],
  },
  micIcon: {
    fontSize: 40,
  },
  voiceLabel: {
    fontSize: 14,
    color: '#666',
  },
  tipContainer: {
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIconContainer: {
    marginRight: 8,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  closeButton: {
    fontSize: 18,
    color: '#999',
    padding: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  lastConversation: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  conversationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  messageUser: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 4,
    marginBottom: 12,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  messageUserText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  messageTimeUser: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageAssistant: {
    flexDirection: 'row',
    maxWidth: '90%',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5DCED9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  assistantAvatarText: {
    fontSize: 16,
  },
  messageAssistantContent: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
  },
  messageAssistantText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  audioIcon: {
    fontSize: 16,
  },
});
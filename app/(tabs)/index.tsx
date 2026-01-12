import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView 
} from 'react-native';
import { commonStyles, homeStyles } from '../styles';

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const handleVoicePress = () => {
    setIsListening(!isListening);
    // Add voice recognition logic here
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <View style={commonStyles.headerLeft}>
          <View style={commonStyles.avatar}>
            <Text style={commonStyles.avatarText}>E</Text>
          </View>
          <View>
            <Text style={commonStyles.title}>EduSync</Text>
            <Text style={commonStyles.subtitle}>Your pocket mentor</Text>
          </View>
        </View>
        <View style={commonStyles.headerRight}>
          <View style={commonStyles.statusBadge}>
            <View style={commonStyles.offlineDot} />
            <Text style={commonStyles.badgeText}>Offline</Text>
          </View>
          <TouchableOpacity style={commonStyles.iconButton}>
            <Text>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={commonStyles.iconButton}>
            <Text>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={commonStyles.content} 
        contentContainerStyle={commonStyles.contentContainer}
      >
        {/* Greeting */}
        <View style={homeStyles.greetingContainer}>
          <Text style={homeStyles.greeting}>Hello, Sunita! 👋</Text>
          <Text style={homeStyles.question}>How can I help your class today?</Text>
        </View>

        {/* Voice Button */}
        <View style={homeStyles.voiceContainer}>
          <TouchableOpacity 
            style={[
              homeStyles.voiceButton, 
              isListening && homeStyles.voiceButtonActive
            ]} 
            onPress={handleVoicePress}
            activeOpacity={0.8}
          >
            <Text style={homeStyles.micIcon}>🎤</Text>
          </TouchableOpacity>
          <Text style={homeStyles.voiceLabel}>Tap to speak</Text>
        </View>

        {/* Pedagogical Tip */}
        {showTip && (
          <View style={homeStyles.tipContainer}>
            <View style={homeStyles.tipHeader}>
              <View style={homeStyles.tipIconContainer}>
                <Text style={homeStyles.tipIcon}>💡</Text>
              </View>
              <Text style={homeStyles.tipTitle}>QUICK TIP</Text>
              <TouchableOpacity onPress={() => setShowTip(false)}>
                <Text style={homeStyles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={homeStyles.tipText}>
              In multi-grade classrooms, older students can serve as 'peer monitors' 
              for younger ones. This develops leadership skills and frees you up to 
              support students who need the most help.
            </Text>
          </View>
        )}

        {/* Last Conversation */}
        <View style={homeStyles.lastConversation}>
          <View style={homeStyles.conversationHeader}>
            <Text style={homeStyles.conversationIcon}>💬</Text>
            <Text style={homeStyles.conversationTitle}>Last conversation</Text>
          </View>

          {/* User Message */}
          <View style={homeStyles.messageUser}>
            <Text style={homeStyles.messageUserText}>
              How to organize activities for multi-grade classroom with limited resources?
            </Text>
            <Text style={homeStyles.messageTimeUser}>13:53</Text>
          </View>

          {/* Assistant Response */}
          <View style={homeStyles.messageAssistant}>
            <View style={homeStyles.assistantAvatar}>
              <Text style={homeStyles.assistantAvatarText}>🤖</Text>
            </View>
            <View style={homeStyles.messageAssistantContent}>
              <Text style={homeStyles.messageAssistantText}>
                Sunita, for multi-grade classrooms with limited resources, I recommend 
                the 'Rotating Stations' strategy: divide your classroom into 3 corners - 
                silent reading, guided activity with you, and collaborative work between 
                grades. Rotate every 15 minutes. Older students can be 'tutors' for 
                younger ones.
              </Text>
              <View style={homeStyles.messageFooter}>
                <Text style={homeStyles.messageTime}>13:53</Text>
                <TouchableOpacity>
                  <Text style={homeStyles.audioIcon}>🔊</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
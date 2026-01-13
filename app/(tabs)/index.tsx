import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Animated
} from 'react-native';
import { commonStyles, homeStyles } from '../styles';

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [showTip, setShowTip] = useState(true);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isListening) {
      // Pulsing animation when listening
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      // Reset animation
      pulseAnim.setValue(1);
      fadeAnim.setValue(0.3);
    }
  }, [isListening, pulseAnim, fadeAnim]);

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
          <Text style={homeStyles.greeting}>Hello, Sunita!</Text>
          <Text style={homeStyles.question}>How can I help your class today?</Text>
        </View>

        {/* Voice Button with Pulsing Animation */}
        <View style={homeStyles.voiceContainer}>
          {/* Outer pulsing circle */}
          <Animated.View 
            style={[
              homeStyles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
                opacity: isListening ? fadeAnim : 0,
                backgroundColor: isListening ? '#DC2626' : undefined,
              }
            ]} 
          />
          
          {/* Main voice button */}
          <TouchableOpacity 
            style={[
              homeStyles.voiceButtonMinimal, 
              isListening && homeStyles.voiceButtonListening
            ]} 
            onPress={handleVoicePress}
            activeOpacity={0.8}
          >
            <View style={homeStyles.micIconContainer}>
              <View style={homeStyles.micBody} />
              <View style={homeStyles.micBase} />
              <View style={homeStyles.micStand} />
            </View>
          </TouchableOpacity>
          
          <Text style={homeStyles.voiceLabel}>
            {isListening ? 'Listening...' : 'Tap to speak'}
          </Text>
        </View>

        {/* Pedagogical Tip */}
        {showTip && (
          <View style={homeStyles.tipContainer}>
            <View style={homeStyles.tipHeader}>
              <View style={homeStyles.tipIconContainer}>
                <View style={homeStyles.lightbulbIcon}>
                  <View style={homeStyles.lightbulbTop} />
                  <View style={homeStyles.lightbulbBase} />
                </View>
              </View>
              <Text style={homeStyles.tipTitle}>QUICK TIP</Text>
              <TouchableOpacity onPress={() => setShowTip(false)}>
                <View style={homeStyles.closeIcon}>
                  <View style={homeStyles.closeLine1} />
                  <View style={homeStyles.closeLine2} />
                </View>
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
            <View style={homeStyles.chatIcon}>
              <View style={homeStyles.chatBubble} />
              <View style={homeStyles.chatTail} />
            </View>
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
              <View style={homeStyles.robotIcon}>
                <View style={homeStyles.robotHead} />
                <View style={homeStyles.robotAntenna} />
              </View>
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
                  <View style={homeStyles.speakerIcon}>
                    <View style={homeStyles.speakerBody} />
                    <View style={homeStyles.speakerWave1} />
                    <View style={homeStyles.speakerWave2} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
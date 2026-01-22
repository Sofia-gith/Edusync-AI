import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

// Components
import { MessageBubble } from "@/components/features/Conversation/MessageBubble";
import { PedagogicalTip } from "@/components/features/Tips/PedagogicalTip";
import { VoiceButton } from "@/components/features/Voice/VoiceButton";
import { AppHeader } from "@/components/Shared/Header";

// Hooks
import { useConversations } from "@/hooks/useConversations";

// Side effects
import { useEffect } from "react";
// Styles
import voiceService from "@/services/VoiceService";
import { commonStyles, homeStyles } from "../styles";
import { Colors } from "../styles/theme";

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const { currentConversation, addMessage, createConversation } =
    useConversations();

  useEffect(() => {
    (async () => {
      if (!currentConversation) {
        const conv = createConversation("Voice session");
        await voiceService.startSession({ language: "en-US" });
      }
    })();
    return () => {
      voiceService.endSession();
    };
  }, []);

  const handleVoicePress = () => {
    (async () => {
      if (!currentConversation) return;
      if (!isListening) {
        try {
          await voiceService.startRecording();
          setIsListening(true);
        } catch (e) {
          setIsListening(false);
        }
      } else {
        try {
          const resp = await voiceService.stopAndSendAudio(true);
          const userText =
            (resp as any)?.meta?.transcript || (resp as any)?.transcript || "";
          if (userText) {
            addMessage(currentConversation.id, "user", userText);
          }
          const assistantText = resp?.text || "";
          if (assistantText) {
            addMessage(currentConversation.id, "assistant", assistantText);
          }
        } catch (e) {
        } finally {
          setIsListening(false);
        }
      }
    })();
  };

  const handlePlayAudio = (messageId: string) => {
    console.log("Playing audio for message:", messageId);
    // Audio playback logic will be implemented later
  };

  // Get last messages for preview
  const lastUserMessage = currentConversation?.messages
    .filter((m) => m.role === "user")
    .slice(-1)[0];

  const lastAssistantMessage = currentConversation?.messages
    .filter((m) => m.role === "assistant")
    .slice(-1)[0];

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <AppHeader
        userName="Sunita"
        appName="EduSync"
        subtitle="Your pocket mentor"
        showSettings
        showProfile
      />

      {/* Main Content */}
      <ScrollView
        style={commonStyles.content}
        contentContainerStyle={commonStyles.contentContainer}
      >
        {/* Greeting */}
        <View style={homeStyles.greetingContainer}>
          <Text style={homeStyles.greeting}>Hello, Sunita!</Text>
          <Text style={homeStyles.question}>
            How can I help your class today?
          </Text>
        </View>

        {/* Voice Button */}
        <VoiceButton isListening={isListening} onPress={handleVoicePress} />

        {/* Pedagogical Tip */}
        {showTip && (
          <PedagogicalTip
            onClose={() => setShowTip(false)}
            tip="In multi-grade classrooms, older students can serve as 'peer monitors' for younger ones. This develops leadership skills and frees you up to support students who need the most help."
          />
        )}

        {/* Last Conversation */}
        {(lastUserMessage || lastAssistantMessage) && (
          <View style={homeStyles.lastConversation}>
            <View style={homeStyles.conversationHeader}>
              <Ionicons name="chatbubble" size={24} color={Colors.primary} />
              <Text style={homeStyles.conversationTitle}>
                Last conversation
              </Text>
            </View>

            {lastUserMessage && (
              <MessageBubble
                role="user"
                content={lastUserMessage.content}
                timestamp={lastUserMessage.timestamp}
              />
            )}

            {lastAssistantMessage && (
              <MessageBubble
                role="assistant"
                content={lastAssistantMessage.content}
                timestamp={lastAssistantMessage.timestamp}
                onPlayAudio={() => handlePlayAudio(lastAssistantMessage.id)}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

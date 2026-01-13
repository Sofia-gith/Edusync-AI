import React from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { commonStyles, historyStyles } from '../styles';

interface ConversationItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  time: string;
}

export default function HistoryScreen() {
  const conversations: ConversationItem[] = [
    {
      id: '1',
      title: 'Multi-grade classroom organization',
      preview: 'How to organize activities for multi-grade classroom with limited resources?',
      date: 'Today',
      time: '13:53'
    },
    {
      id: '2',
      title: 'Managing diverse learning levels',
      preview: 'Students in 4th grade reading at different levels - how to differentiate?',
      date: 'Yesterday',
      time: '10:22'
    },
    {
      id: '3',
      title: 'Math subtraction strategies',
      preview: 'Help with teaching subtraction with zeros to struggling students',
      date: 'Jan 10',
      time: '14:15'
    },
    {
      id: '4',
      title: 'Behavior management tips',
      preview: 'Dealing with disruptive behavior during independent work time',
      date: 'Jan 9',
      time: '11:30'
    },
    {
      id: '5',
      title: 'Reading comprehension activities',
      preview: 'Low-resource activities to improve reading comprehension across grades',
      date: 'Jan 8',
      time: '16:45'
    },
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Conversation History</Text>
        <TouchableOpacity style={historyStyles.searchButton}>
          <Text style={historyStyles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={commonStyles.content}
        contentContainerStyle={commonStyles.contentContainer}
      >
        {conversations.map((conversation) => (
          <TouchableOpacity 
            key={conversation.id} 
            style={historyStyles.conversationCard}
            activeOpacity={0.7}
          >
            <View style={historyStyles.cardHeader}>
              <Text style={historyStyles.cardTitle}>{conversation.title}</Text>
              <Text style={historyStyles.cardDate}>{conversation.date}</Text>
            </View>
            <Text style={historyStyles.cardPreview} numberOfLines={2}>
              {conversation.preview}
            </Text>
            <View style={historyStyles.cardFooter}>
              <Text style={historyStyles.cardTime}>{conversation.time}</Text>
              <View style={historyStyles.cardActions}>
                <TouchableOpacity style={historyStyles.actionButton}>
                  <Text style={historyStyles.actionIcon}>🔊</Text>
                </TouchableOpacity>
                <TouchableOpacity style={historyStyles.actionButton}>
                  <Text style={historyStyles.actionIcon}>⋯</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State (hidden when there are conversations) */}
        {conversations.length === 0 && (
          <View style={commonStyles.emptyState}>
            <Text style={commonStyles.emptyStateIcon}>💬</Text>
            <Text style={commonStyles.emptyStateTitle}>No conversations yet</Text>
            <Text style={commonStyles.emptyStateText}>
              Start a conversation on the Home tab to see your history here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
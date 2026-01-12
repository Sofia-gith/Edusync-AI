import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';

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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversation History</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {conversations.map((conversation) => (
          <TouchableOpacity 
            key={conversation.id} 
            style={styles.conversationCard}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{conversation.title}</Text>
              <Text style={styles.cardDate}>{conversation.date}</Text>
            </View>
            <Text style={styles.cardPreview} numberOfLines={2}>
              {conversation.preview}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardTime}>{conversation.time}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>🔊</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>⋯</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State (hidden when there are conversations) */}
        {conversations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>
              Start a conversation on the Home tab to see your history here
            </Text>
          </View>
        )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  conversationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: '📚' },
    { id: 'math', label: 'Math', icon: '➕' },
    { id: 'reading', label: 'Reading', icon: '📖' },
    { id: 'classroom', label: 'Classroom', icon: '🏫' },
    { id: 'behavior', label: 'Behavior', icon: '✨' },
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Multi-grade Teaching Strategies',
      description: 'Comprehensive guide for managing classrooms with students at different grade levels',
      category: 'classroom',
      icon: '👥'
    },
    {
      id: '2',
      title: 'Low-Resource Math Activities',
      description: 'Creative math exercises that require minimal materials but deliver maximum impact',
      category: 'math',
      icon: '🔢'
    },
    {
      id: '3',
      title: 'Reading Comprehension Techniques',
      description: 'Evidence-based strategies to improve reading skills across different proficiency levels',
      category: 'reading',
      icon: '📚'
    },
    {
      id: '4',
      title: 'Peer Tutoring Framework',
      description: 'How to implement effective peer-to-peer learning in your classroom',
      category: 'classroom',
      icon: '🤝'
    },
    {
      id: '5',
      title: 'Positive Behavior Management',
      description: 'Practical approaches to encourage good behavior and handle disruptions constructively',
      category: 'behavior',
      icon: '⭐'
    },
    {
      id: '6',
      title: 'Subtraction with Regrouping',
      description: 'Step-by-step lesson plans and visual aids for teaching subtraction with zeros',
      category: 'math',
      icon: '➖'
    },
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
        <TouchableOpacity style={styles.syncButton}>
          <Text style={styles.syncIcon}>🔄</Text>
          <Text style={styles.syncText}>Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryLabel,
              selectedCategory === category.id && styles.categoryLabelActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resources List */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredResources.map((resource) => (
          <TouchableOpacity 
            key={resource.id} 
            style={styles.resourceCard}
            activeOpacity={0.7}
          >
            <View style={styles.resourceIcon}>
              <Text style={styles.resourceIconText}>{resource.icon}</Text>
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceDescription} numberOfLines={2}>
                {resource.description}
              </Text>
              <View style={styles.resourceFooter}>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>
                    {categories.find(c => c.id === resource.category)?.label}
                  </Text>
                </View>
                <TouchableOpacity style={styles.downloadButton}>
                  <Text style={styles.downloadIcon}>⬇️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>ℹ️</Text>
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>Offline Resources</Text>
            <Text style={styles.infoBannerText}>
              All resources are available offline. Sync when connected to download updates.
            </Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5DCED9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  syncIcon: {
    fontSize: 14,
  },
  syncText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#5DCED9',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  resourceCard: {
    flexDirection: 'row',
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
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceIconText: {
    fontSize: 24,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  downloadButton: {
    padding: 4,
  },
  downloadIcon: {
    fontSize: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoBannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
});
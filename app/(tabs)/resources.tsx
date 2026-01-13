import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { commonStyles, resourcesStyles } from '../styles';
import { Colors } from '../styles/theme';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: 'library' as const },
    { id: 'math', label: 'Math', icon: 'calculator' as const },
    { id: 'reading', label: 'Reading', icon: 'book' as const },
    { id: 'classroom', label: 'Classroom', icon: 'school' as const },
    { id: 'behavior', label: 'Behavior', icon: 'star' as const },
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Multi-grade Teaching Strategies',
      description: 'Comprehensive guide for managing classrooms with students at different grade levels',
      category: 'classroom',
      icon: 'people'
    },
    {
      id: '2',
      title: 'Low-Resource Math Activities',
      description: 'Creative math exercises that require minimal materials but deliver maximum impact',
      category: 'math',
      icon: 'calculator'
    },
    {
      id: '3',
      title: 'Reading Comprehension Techniques',
      description: 'Evidence-based strategies to improve reading skills across different proficiency levels',
      category: 'reading',
      icon: 'book'
    },
    {
      id: '4',
      title: 'Peer Tutoring Framework',
      description: 'How to implement effective peer-to-peer learning in your classroom',
      category: 'classroom',
      icon: 'people-circle'
    },
    {
      id: '5',
      title: 'Positive Behavior Management',
      description: 'Practical approaches to encourage good behavior and handle disruptions constructively',
      category: 'behavior',
      icon: 'star'
    },
    {
      id: '6',
      title: 'Subtraction with Regrouping',
      description: 'Step-by-step lesson plans and visual aids for teaching subtraction with zeros',
      category: 'math',
      icon: 'remove-circle'
    },
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Resources</Text>
        <TouchableOpacity style={resourcesStyles.syncButton}>
          <Ionicons name="sync" size={16} color={Colors.white} />
          <Text style={resourcesStyles.syncText}>Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={resourcesStyles.categoryContainer}
        contentContainerStyle={resourcesStyles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              resourcesStyles.categoryButton,
              selectedCategory === category.id && resourcesStyles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={18} 
              color={selectedCategory === category.id ? Colors.white : Colors.textSecondary} 
            />
            <Text style={[
              resourcesStyles.categoryLabel,
              selectedCategory === category.id && resourcesStyles.categoryLabelActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resources List */}
      <ScrollView 
        style={commonStyles.content}
        contentContainerStyle={commonStyles.contentContainer}
      >
        {filteredResources.map((resource) => (
          <TouchableOpacity 
            key={resource.id} 
            style={resourcesStyles.resourceCard}
            activeOpacity={0.7}
          >
            <View style={resourcesStyles.resourceIcon}>
              <Ionicons name={resource.icon} size={24} color={Colors.primary} />
            </View>
            <View style={resourcesStyles.resourceContent}>
              <Text style={resourcesStyles.resourceTitle}>{resource.title}</Text>
              <Text style={resourcesStyles.resourceDescription} numberOfLines={2}>
                {resource.description}
              </Text>
              <View style={resourcesStyles.resourceFooter}>
                <View style={resourcesStyles.categoryTag}>
                  <Text style={resourcesStyles.categoryTagText}>
                    {categories.find(c => c.id === resource.category)?.label}
                  </Text>
                </View>
                <TouchableOpacity style={resourcesStyles.downloadButton}>
                  <Ionicons name="download-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Info Banner */}
        <View style={resourcesStyles.infoBanner}>
          <Ionicons name="information-circle" size={24} color={Colors.info} />
          <View style={resourcesStyles.infoBannerContent}>
            <Text style={resourcesStyles.infoBannerTitle}>Offline Resources</Text>
            <Text style={resourcesStyles.infoBannerText}>
              All resources are available offline. Sync when connected to download updates.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
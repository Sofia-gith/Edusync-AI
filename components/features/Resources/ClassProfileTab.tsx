import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resourcesTabsStyles } from '../../../app/styles/resources-tabs.styles';
import { Colors } from '../../../app/styles';

export const ClassProfileTab: React.FC = () => {
  const [description, setDescription] = useState(
    'Multi-grade class with 28 students in 4th, 5th, and 6th grade. Main challenges: limited attention span during long activities, very different reading levels, and a few students who need extra support. Strengths: highly collaborative group and strong natural curiosity. Limited resources: few books and printed materials available.'
  );

  const quickTags = [
    { icon: 'people', label: 'Multi-grade classroom' },
    { icon: 'book', label: 'Limited resources' },
    { icon: 'star', label: 'Highly active students' },
    { icon: 'school', label: 'Mixed learning levels' },
    { icon: 'location', label: 'Rural context' },
  ];

  const handleGenerateSuggestions = () => {
    console.log('Generating personalized suggestions...');
    // TODO: Integrar com IA para gerar sugestões
  };

  return (
    <ScrollView style={resourcesTabsStyles.classProfileContainer}>
      {/* Profile Card */}
      <View style={resourcesTabsStyles.profileCard}>
        <View style={resourcesTabsStyles.profileHeader}>
          <View style={resourcesTabsStyles.profileIcon}>
            <Ionicons name="people" size={24} color={Colors.primary} />
          </View>
          <View style={resourcesTabsStyles.profileTitle}>
            <Text style={resourcesTabsStyles.profileTitleText}>
              Classroom profile
            </Text>
            <Text style={resourcesTabsStyles.profileSubtitle}>
              Describe your class to receive tailored suggestions
            </Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={resourcesTabsStyles.descriptionSection}>
          <Text style={resourcesTabsStyles.sectionLabel}>
            Describe your class
          </Text>
          <TextInput
            style={resourcesTabsStyles.descriptionText}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholder="Describe key challenges, strengths, and specific needs of your class..."
            placeholderTextColor={Colors.textTertiary}
          />
          <Text style={resourcesTabsStyles.wordCount}>
            {description.split(' ').length} words
          </Text>
        </View>

        {/* Quick Tags */}
        <View style={resourcesTabsStyles.quickTagsSection}>
          <Text style={resourcesTabsStyles.quickTagsLabel}>
            Quick add:
          </Text>
          <View style={resourcesTabsStyles.tagsContainer}>
            {quickTags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={resourcesTabsStyles.tag}
                onPress={() => {
                  // Adicionar tag ao texto
                  setDescription(prev => `${prev} + ${tag.label}`);
                }}
              >
                <Ionicons name={tag.icon as any} size={16} color={Colors.textSecondary} />
                <Text style={resourcesTabsStyles.tagText}>+ {tag.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={resourcesTabsStyles.generateButton}
          onPress={handleGenerateSuggestions}
        >
          <Ionicons name="sparkles" size={20} color={Colors.white} />
          <Text style={resourcesTabsStyles.generateButtonText}>
            Generate personalized suggestions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Available Materials Section */}
      <View style={resourcesTabsStyles.materialsSection}>
        <Text style={resourcesTabsStyles.materialsHeader}>
          Available materials
        </Text>
        
        <View style={resourcesTabsStyles.profileCard}>
          <Text
            style={{
              fontSize: 14,
              color: Colors.textSecondary,
              textAlign: 'center',
            }}
          >
            Select &quot;Generate personalized suggestions&quot; to unlock
            resources that match this classroom profile.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

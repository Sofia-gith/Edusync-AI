import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, resourcesStyles } from '../styles';
import { resourcesTabsStyles } from '../styles/resources-tabs.styles';
import { Colors } from '../styles';

// Components
import { ClassProfileTab } from '@/components/features/Resources/ClassProfileTab';

type TabType = 'profile' | 'study';

export default function ResourcesScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('profile');

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

      {/* Tab Navigation */}
      <View style={resourcesTabsStyles.tabBar}>
        <TouchableOpacity
          style={[
            resourcesTabsStyles.tab,
            selectedTab === 'profile' && resourcesTabsStyles.tabActive,
          ]}
          onPress={() => setSelectedTab('profile')}
        >
          <Text
            style={[
              resourcesTabsStyles.tabText,
              selectedTab === 'profile' && resourcesTabsStyles.tabTextActive,
            ]}
          >
            Class Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            resourcesTabsStyles.tab,
            selectedTab === 'study' && resourcesTabsStyles.tabActive,
          ]}
          onPress={() => setSelectedTab('study')}
        >
          <Text
            style={[
              resourcesTabsStyles.tabText,
              selectedTab === 'study' && resourcesTabsStyles.tabTextActive,
            ]}
          >
            Study
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {selectedTab === 'profile' && <ClassProfileTab />}
    
    </SafeAreaView>
  );
}
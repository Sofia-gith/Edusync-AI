import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Colors, commonStyles, resourcesStyles } from "../styles";
import { resourcesTabsStyles } from "../styles/resources-tabs.styles";

import { ClassProfileTab } from "@/components/features/Resources/ClassProfileTab";
import { StudyMaterialsTab } from "@/components/features/Resources/StudyMaterialsTab";

type TabType = "profile" | "study";

export default function ResourcesScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>("profile");

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.headerLeft}>
          <Text style={commonStyles.headerTitle}>Resources</Text>
          <Text style={resourcesStyles.headerSubtitle}>
            Your offline teaching support hub
          </Text>
        </View>
        <View style={commonStyles.headerRight}>
          <TouchableOpacity style={resourcesStyles.syncButton}>
            <Ionicons name="sync" size={16} color={Colors.primary} />
            <Text style={resourcesStyles.syncText}>Sync</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={resourcesTabsStyles.tabBar}>
        <TouchableOpacity
          style={[
            resourcesTabsStyles.tab,
            selectedTab === "profile" && resourcesTabsStyles.tabActive,
          ]}
          onPress={() => setSelectedTab("profile")}
        >
          <Text
            style={[
              resourcesTabsStyles.tabText,
              selectedTab === "profile" && resourcesTabsStyles.tabTextActive,
            ]}
          >
            Class Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            resourcesTabsStyles.tab,
            selectedTab === "study" && resourcesTabsStyles.tabActive,
          ]}
          onPress={() => setSelectedTab("study")}
        >
          <Text
            style={[
              resourcesTabsStyles.tabText,
              selectedTab === "study" && resourcesTabsStyles.tabTextActive,
            ]}
          >
            Materials
          </Text>
        </TouchableOpacity>
      </View>

      <View style={resourcesStyles.infoBanner}>
        <Ionicons
          name="sparkles-outline"
          size={20}
          color={Colors.info}
          style={resourcesStyles.infoBannerIcon}
        />
        <View style={resourcesStyles.infoBannerContent}>
          <Text style={resourcesStyles.infoBannerTitle}>
            Smart suggestions enabled
          </Text>
          <Text style={resourcesStyles.infoBannerText}>
            The resources below are tailored to your class profile and work even
            when you are offline.
          </Text>
        </View>
      </View>

      {selectedTab === "profile" && <ClassProfileTab />}
      {selectedTab === "study" && <StudyMaterialsTab />}
    </SafeAreaView>
  );
}

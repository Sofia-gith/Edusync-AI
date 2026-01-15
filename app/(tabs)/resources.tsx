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
        <Text style={commonStyles.headerTitle}>Recursos</Text>
        <TouchableOpacity style={resourcesStyles.syncButton}>
          <Ionicons name="sync" size={16} color={Colors.white} />
          <Text style={resourcesStyles.syncText}>Sincronizar</Text>
        </TouchableOpacity>
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
            Perfil da Turma
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
            Materiais
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "profile" && <ClassProfileTab />}
      {selectedTab === "study" && <StudyMaterialsTab />}
    </SafeAreaView>
  );
}

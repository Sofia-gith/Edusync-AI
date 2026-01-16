// app/(tabs)/resources.tsx - REFATORADO COM 2 TABS
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../app/styles";
import { resourcesTabsStyles } from "../../../app/styles/resources-tabs.styles";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "pdf" | "course";
  duration?: string;
  pages?: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export const StudyMaterialsTab: React.FC = () => {
  const [materials] = useState<StudyMaterial[]>([
    {
      id: "1",
      title: "Managing multi-grade classrooms",
      description:
        "Learn practical strategies to organize and manage classes with students at very different learning levels.",
      type: "article",
      duration: "15 min",
      difficulty: "Beginner",
    },
    {
      id: "2",
      title: "Differentiated instruction in practice",
      description:
        "Concrete techniques to adapt content and activities to the individual needs of each student.",
      type: "video",
      duration: "25 min",
      difficulty: "Intermediate",
    },
    {
      id: "3",
      title: "Teaching with limited resources",
      description:
        "Step-by-step guide to create effective learning materials using simple, low-cost resources.",
      type: "pdf",
      pages: 42,
      difficulty: "Beginner",
    },
    {
      id: "4",
      title: "Literacy in rural contexts",
      description:
        "Methodologies designed for literacy in rural schools, adapted to local realities and constraints.",
      type: "course",
      duration: "2h 30min",
      difficulty: "Advanced",
    },
    {
      id: "5",
      title: "Positive behavior management",
      description:
        "Positive strategies to respond to challenging behavior and build a safe, productive classroom climate.",
      type: "video",
      duration: "18 min",
      difficulty: "Intermediate",
    },
    {
      id: "6",
      title: "Practical formative assessment",
      description:
        "How to monitor student progress continuously and use the data to adjust your teaching in real time.",
      type: "article",
      duration: "12 min",
      difficulty: "Intermediate",
    },
  ]);

  const getTypeIcon = (type: StudyMaterial["type"]) => {
    switch (type) {
      case "article":
        return "document-text";
      case "video":
        return "play-circle";
      case "pdf":
        return "document";
      case "course":
        return "school";
      default:
        return "book";
    }
  };

  const getTypeColor = (type: StudyMaterial["type"]) => {
    switch (type) {
      case "article":
        return Colors.info;
      case "video":
        return Colors.error;
      case "pdf":
        return Colors.warning;
      case "course":
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  const getDifficultyColor = (difficulty: StudyMaterial["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return Colors.success;
      case "Intermediate":
        return Colors.warning;
      case "Advanced":
        return Colors.error;
    }
  };

  const handleOpenMaterial = (materialId: string) => {
    console.log("Opening material:", materialId);
    // TODO: Implementar abertura do material
  };

  return (
    <ScrollView style={resourcesTabsStyles.classProfileContainer}>
      <Text style={resourcesTabsStyles.materialsHeader}>
        Teacher study materials
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: Colors.textSecondary,
          marginBottom: 16,
        }}
      >
        Deepen your practice with curated content designed for educators.
      </Text>

      {materials.map((material) => (
        <View key={material.id} style={resourcesTabsStyles.studyMaterialCard}>
          <View style={resourcesTabsStyles.studyMaterialHeader}>
            <Text style={resourcesTabsStyles.studyMaterialTitle}>
              {material.title}
            </Text>
            <View
              style={[
                resourcesTabsStyles.studyMaterialBadge,
                {
                  backgroundColor: `${getDifficultyColor(
                    material.difficulty
                  )}20`,
                },
              ]}
            >
              <Text
                style={[
                  resourcesTabsStyles.studyMaterialBadgeText,
                  { color: getDifficultyColor(material.difficulty) },
                ]}
              >
                {material.difficulty}
              </Text>
            </View>
          </View>

          <Text style={resourcesTabsStyles.studyMaterialDescription}>
            {material.description}
          </Text>

          <View style={resourcesTabsStyles.studyMaterialFooter}>
            <View style={resourcesTabsStyles.studyMaterialMeta}>
              <View style={resourcesTabsStyles.studyMaterialMetaItem}>
                <Ionicons
                  name={getTypeIcon(material.type)}
                  size={16}
                  color={getTypeColor(material.type)}
                />
                <Text style={resourcesTabsStyles.studyMaterialMetaText}>
                  {material.type === "pdf"
                    ? "PDF"
                    : material.type.charAt(0).toUpperCase() +
                      material.type.slice(1)}
                </Text>
              </View>

              <View style={resourcesTabsStyles.studyMaterialMetaItem}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={Colors.textTertiary}
                />
                <Text style={resourcesTabsStyles.studyMaterialMetaText}>
                  {material.duration ||
                    `${material.pages} pages`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={resourcesTabsStyles.studyMaterialButton}
              onPress={() => handleOpenMaterial(material.id)}
            >
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              <Text style={resourcesTabsStyles.studyMaterialButtonText}>
                Open
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

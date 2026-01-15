// app/(tabs)/resources.tsx - REFATORADO COM 2 TABS
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resourcesTabsStyles } from '../../../app/styles/resources-tabs.styles';
import { Colors } from '../../../app/styles';

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'pdf' | 'course';
  duration?: string;
  pages?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const StudyMaterialsTab: React.FC = () => {
  const [materials] = useState<StudyMaterial[]>([
    {
      id: '1',
      title: 'Gestão de Salas Multi-série',
      description: 'Aprenda estratégias eficazes para organizar e gerenciar turmas com diferentes níveis de aprendizagem.',
      type: 'article',
      duration: '15 min',
      difficulty: 'Beginner',
    },
    {
      id: '2',
      title: 'Diferenciação Pedagógica na Prática',
      description: 'Técnicas comprovadas para adaptar conteúdos e atividades às necessidades individuais dos alunos.',
      type: 'video',
      duration: '25 min',
      difficulty: 'Intermediate',
    },
    {
      id: '3',
      title: 'Ensino com Recursos Limitados',
      description: 'Guia completo sobre como criar materiais didáticos de qualidade usando recursos simples e acessíveis.',
      type: 'pdf',
      pages: 42,
      difficulty: 'Beginner',
    },
    {
      id: '4',
      title: 'Alfabetização em Contextos Rurais',
      description: 'Metodologias específicas para alfabetização em escolas rurais, considerando a realidade local.',
      type: 'course',
      duration: '2h 30min',
      difficulty: 'Advanced',
    },
    {
      id: '5',
      title: 'Gestão de Comportamento em Sala',
      description: 'Estratégias positivas para lidar com desafios comportamentais e criar um ambiente de aprendizagem produtivo.',
      type: 'video',
      duration: '18 min',
      difficulty: 'Intermediate',
    },
    {
      id: '6',
      title: 'Avaliação Formativa Prática',
      description: 'Como avaliar o progresso dos alunos de forma contínua e usar os dados para melhorar o ensino.',
      type: 'article',
      duration: '12 min',
      difficulty: 'Intermediate',
    },
  ]);

  const getTypeIcon = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'article':
        return 'document-text';
      case 'video':
        return 'play-circle';
      case 'pdf':
        return 'document';
      case 'course':
        return 'school';
      default:
        return 'book';
    }
  };

  const getTypeColor = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'article':
        return '#2196F3';
      case 'video':
        return '#FF5252';
      case 'pdf':
        return '#FF9800';
      case 'course':
        return '#4CAF50';
      default:
        return Colors.primary;
    }
  };

  const getDifficultyColor = (difficulty: StudyMaterial['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Advanced':
        return '#FF5252';
    }
  };

  const handleOpenMaterial = (materialId: string) => {
    console.log('Opening material:', materialId);
    // TODO: Implementar abertura do material
  };

  return (
    <ScrollView style={resourcesTabsStyles.classProfileContainer}>
      <Text style={resourcesTabsStyles.materialsHeader}>
        Materiais para Revisão do Professor
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: Colors.textSecondary,
          marginBottom: 16,
        }}
      >
        Aprimore suas habilidades com conteúdos selecionados para educadores
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
                { backgroundColor: `${getDifficultyColor(material.difficulty)}20` },
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
                  {material.type === 'pdf' ? 'PDF' : material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                </Text>
              </View>

              <View style={resourcesTabsStyles.studyMaterialMetaItem}>
                <Ionicons name="time-outline" size={16} color={Colors.textTertiary} />
                <Text style={resourcesTabsStyles.studyMaterialMetaText}>
                  {material.duration || `${material.pages} páginas`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={resourcesTabsStyles.studyMaterialButton}
              onPress={() => handleOpenMaterial(material.id)}
            >
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              <Text style={resourcesTabsStyles.studyMaterialButtonText}>
                Acessar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
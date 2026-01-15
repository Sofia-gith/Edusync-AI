import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resourcesTabsStyles } from '../../../app/styles/resources-tabs.styles';
import { Colors } from '../../../app/styles';

export const ClassProfileTab: React.FC = () => {
  const [description, setDescription] = useState(
    'Turma multi-série com 28 alunos do 4º, 5º e 6º ano. Principais desafios: atenção dispersa durante atividades longas, níveis de leitura muito variados entre os alunos. Pontos fortes: os alunos são colaborativos e têm muita curiosidade natural. Temos 2 alunos com dificuldade de aprendizagem que precisam de atenção extra. Recursos limitados - poucos livros e materiais didáticos.'
  );

  const quickTags = [
    { icon: 'people', label: 'Turma multi-série' },
    { icon: 'book', label: 'Poucos recursos' },
    { icon: 'star', label: 'Alunos agitados' },
    { icon: 'school', label: 'Níveis variados' },
    { icon: 'location', label: 'Zona rural' },
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
              Perfil da Sala
            </Text>
            <Text style={resourcesTabsStyles.profileSubtitle}>
              Descreva sua turma e receba sugestões
            </Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={resourcesTabsStyles.descriptionSection}>
          <Text style={resourcesTabsStyles.sectionLabel}>
            Descreva sua turma
          </Text>
          <TextInput
            style={resourcesTabsStyles.descriptionText}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholder="Descreva os desafios, pontos fortes e necessidades da sua turma..."
            placeholderTextColor={Colors.textTertiary}
          />
          <Text style={resourcesTabsStyles.wordCount}>
            {description.split(' ').length} palavras
          </Text>
        </View>

        {/* Quick Tags */}
        <View style={resourcesTabsStyles.quickTagsSection}>
          <Text style={resourcesTabsStyles.quickTagsLabel}>
            Adicione rapidamente:
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
            Gerar Sugestões Personalizadas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Available Materials Section */}
      <View style={resourcesTabsStyles.materialsSection}>
        <Text style={resourcesTabsStyles.materialsHeader}>
          Materiais Disponíveis
        </Text>
        
        <View style={resourcesTabsStyles.profileCard}>
          <Text
            style={{
              fontSize: 14,
              color: Colors.textSecondary,
              textAlign: 'center',
            }}
          >
            Clique em &quot;Gerar Sugestões Personalizadas&quot; para receber
            materiais adaptados ao perfil da sua turma
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

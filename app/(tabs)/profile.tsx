import React from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, profileStyles } from '../styles';
import { Colors } from '../styles/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Profile</Text>
        <View style={commonStyles.headerRight}>
          <View style={commonStyles.statusBadge}>
            <View style={commonStyles.offlineDot} />
            <Text style={commonStyles.badgeText}>Offline</Text>
          </View>
          <TouchableOpacity style={commonStyles.iconButton}>
            <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={commonStyles.content}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* User Profile Section */}
        <View style={profileStyles.profileSection}>
          <View style={profileStyles.avatarContainer}>
            <Ionicons name="school" size={48} color="#FF9800" />
          </View>
          <Text style={profileStyles.userName}>Sunita Sharma</Text>
          <Text style={profileStyles.userRole}>Teacher · Rural School Jaipur</Text>
        </View>

        {/* Stats Cards */}
        <View style={profileStyles.statsContainer}>
          <View style={profileStyles.statCard}>
            <View style={profileStyles.statIconContainer}>
              <Ionicons name="book" size={24} color={Colors.primary} />
            </View>
            <Text style={profileStyles.statLabel}>CLASSES</Text>
            <Text style={profileStyles.statNumber}>3</Text>
          </View>
          
          <View style={profileStyles.statCard}>
            <View style={profileStyles.statIconContainer}>
              <Ionicons name="people" size={24} color={Colors.primary} />
            </View>
            <Text style={profileStyles.statLabel}>STUDENTS</Text>
            <Text style={profileStyles.statNumber}>45</Text>
          </View>
          
          <View style={profileStyles.statCard}>
            <View style={profileStyles.statIconContainer}>
              <Ionicons name="chatbubbles" size={24} color={Colors.primary} />
            </View>
            <Text style={profileStyles.statLabel}>CONSULTATIONS</Text>
            <Text style={profileStyles.statNumber}>47</Text>
          </View>
        </View>

        {/* Configured Context Section */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Configured Context</Text>
          
          <View style={profileStyles.contextItem}>
            <Text style={profileStyles.contextLabel}>Grades:</Text>
            <Text style={profileStyles.contextValue}>4th, 5th and 6th grade</Text>
          </View>
          
          <View style={profileStyles.contextItem}>
            <Text style={profileStyles.contextLabel}>School type:</Text>
            <Text style={profileStyles.contextValue}>Rural</Text>
          </View>
          
          <View style={profileStyles.contextItem}>
            <Text style={profileStyles.contextLabel}>Language:</Text>
            <Text style={profileStyles.contextValue}>Portuguese</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="globe-outline" size={24} color={Colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={profileStyles.settingTitle}>Language</Text>
                <Text style={profileStyles.settingSubtitle}>English</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="mic-outline" size={24} color={Colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={profileStyles.settingTitle}>Voice Settings</Text>
                <Text style={profileStyles.settingSubtitle}>Adjust voice input</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="bulb-outline" size={24} color={Colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={profileStyles.settingTitle}>Daily Tips</Text>
                <Text style={profileStyles.settingSubtitle}>Show pedagogical tips</Text>
              </View>
            </View>
            <View style={profileStyles.toggle}>
              <View style={profileStyles.toggleActive} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Data & Storage Section */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Data & Storage</Text>
          
          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="cloud-outline" size={24} color={Colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={profileStyles.settingTitle}>Sync Data</Text>
                <Text style={profileStyles.settingSubtitle}>Last sync: 2 hours ago</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="save-outline" size={24} color={Colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={profileStyles.settingTitle}>Storage Usage</Text>
                <Text style={profileStyles.settingSubtitle}>1.2 GB / 5 GB used</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="trash-outline" size={24} color={Colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={profileStyles.settingTitle}>Clear Cache</Text>
                <Text style={profileStyles.settingSubtitle}>Free up space</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
              <Text style={[profileStyles.settingTitle, { marginLeft: 12 }]}>Help & Tutorial</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.primary} />
              <Text style={[profileStyles.settingTitle, { marginLeft: 12 }]}>Send Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={profileStyles.settingTitle}>App Version</Text>
                <Text style={profileStyles.settingSubtitle}>1.0.0</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={profileStyles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} style={{ marginRight: 8 }} />
          <Text style={profileStyles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
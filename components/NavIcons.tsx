import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  color: string;
  focused?: boolean;
  size?: number;
}

export const HomeIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="home" size={size} color={color} />
);

export const HistoryIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="time-outline" size={size} color={color} />
);

export const ResourcesIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="book-outline" size={size} color={color} />
);

export const ProfileIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="person-outline" size={size} color={color} />
);

export const SettingsIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="settings-outline" size={size} color={color} />
);

export const SearchIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="search" size={size} color={color} />
);

export const MicIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="mic" size={size} color={color} />
);

export const MicOffIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="mic-off" size={size} color={color} />
);

export const VolumeHighIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="volume-high" size={size} color={color} />
);

export const ChatBubbleIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="chatbubble" size={size} color={color} />
);

export const LightbulbIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="bulb-outline" size={size} color={color} />
);

export const CloseIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="close" size={size} color={color} />
);

export const DownloadIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="download-outline" size={size} color={color} />
);

export const SyncIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="sync" size={size} color={color} />
);

export const CloudIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="cloud-outline" size={size} color={color} />
);

export const TrashIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="trash-outline" size={size} color={color} />
);

export const MoreVerticalIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="ellipsis-vertical" size={size} color={color} />
);

export const ChevronRightIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="chevron-forward" size={size} color={color} />
);

export const InfoIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="information-circle-outline" size={size} color={color} />
);

export const SchoolIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="school" size={size} color={color} />
);

export const PeopleIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="people" size={size} color={color} />
);

export const ChatbubblesIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="chatbubbles" size={size} color={color} />
);

export const GlobeIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="globe-outline" size={size} color={color} />
);

export const MicrophoneIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="mic-outline" size={size} color={color} />
);

export const SaveIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="save-outline" size={size} color={color} />
);

export const HelpCircleIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="help-circle-outline" size={size} color={color} />
);

export const SendIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="send" size={size} color={color} />
);

export const LogoutIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="log-out-outline" size={size} color={color} />
);
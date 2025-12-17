import { LucideIcon } from 'lucide-react';

export type ThemeMode = 'day' | 'night' | 'image';

export interface ThemeConfig {
  dayGradient: string;
  nightGradient: string;
  image: {
    url: string;
    blur: boolean;
    blurStrength: string;
  };
}

export interface BackgroundSettings {
  speed: number;       // Animation speed multiplier (0.1 - 5)
  blur: number;        // Blur amount in px
  hue: number;         // Hue rotation in degrees
  saturation: number;  // Saturation percentage
}

export interface ToolItem {
  name: string;
  url: string;
  iconName: string; // Key to map to Lucide icon
}

export interface ToolCategory {
  title: string; // e.g., '学校', '生活'
  items: ToolItem[];
}

export interface SocialLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconName: string; // Key to map to Lucide icon
  colorClass: string; // Tailwind color class prefix (e.g., 'blue', 'pink')
  isToolGroup?: boolean; // Special flag if this is the expandable tool group
}

export interface ProfileData {
  name: string;
  title: string;
  subtitle: string;
  avatarText: string;
  email: string;
  footerText: string;
}
import { ThemeConfig, ProfileData, SocialLink, ToolItem } from './types';

// ==========================================
// 🎨 THEME CONFIGURATION
// ==========================================
export const THEME_CONFIG: ThemeConfig = {
  // Day Mode: Bright, Aurora-like (Original)
  dayGradient: 'linear-gradient(-45deg, #2563eb, #7c3aed, #0891b2, #2563eb)',
  
  // Night Mode: Deep Blues, Purple, Dark Slate (For evening feel)
  nightGradient: 'linear-gradient(-45deg, #020617, #1e1b4b, #312e81, #111827)',
  
  // Image Mode Configuration
  image: {
    url: 'https://images.unsplash.com/photo-1764377848355-2c2ef0e5f759',
    blur: true,
    blurStrength: '16px'
  }
};

// ==========================================
// 👤 PROFILE DATA
// ==========================================
export const PROFILE: ProfileData = {
  name: 'YZG',
  title: 'YZG 的个人空间',
  subtitle: '四川大学',
  avatarText: 'YZG',
  email: 'yzgwowcn@gmail.com',
  footerText: '© 2025-2026 YZG. All Rights Reserved.',
};

// ==========================================
// 🛠️ TOOLS LIST (Appears in the dropdown)
// ==========================================
export const TOOLS: ToolItem[] = [
  {
    name: '推进原理与技术-在线计算程序',
    url: 'https://aero.systemwow.top/',
    iconName: 'Rocket',
  },
  {
    name: '天气预报',
    url: 'https://weather.systemwow.top/',
    iconName: 'Cloudy',
  },
  {
    name: 'P2P测试',
    url: 'https://p2p.systemwow.top/',
    iconName: 'MessageCircleWarning',
  },
  {
    name: 'IP查询',
    url: 'https://ip.systemwow.top/',
    iconName: 'LocateFixed',
  },
];

// ==========================================
// 🔗 MAIN LINKS GRID
// ==========================================
export const LINKS: SocialLink[] = [
  {
    id: 'tools',
    title: '在线工具集',
    subtitle: '常用开发工具与演示项目',
    url: '#',
    iconName: 'LayoutGrid',
    colorClass: 'blue',
    isToolGroup: true,
  },
  {
    id: 'bilibili',
    title: 'Bilibili',
    subtitle: '查看我的视频动态',
    url: 'https://space.bilibili.com/351754479',
    iconName: 'Tv', // Using TV icon as closest standard Lucide match for Bilibili
    colorClass: 'pink',
  },
  {
    id: 'github',
    title: 'GitHub',
    subtitle: '开源项目与代码',
    url: 'https://github.com/yzgwowcn',
    iconName: 'Github',
    colorClass: 'gray',
  },
  {
    id: 'email',
    title: 'Email',
    subtitle: '联系我',
    url: `mailto:${PROFILE.email}`,
    iconName: 'Mail',
    colorClass: 'purple',
  },
];

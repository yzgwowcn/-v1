import { ThemeConfig, ProfileData, SocialLink, ToolCategory } from './types';

// ==========================================
// 主题修改
// ==========================================
export const THEME_CONFIG: ThemeConfig = {
  // Day Mode: Bright, Aurora-like (Original)
  dayGradient: 'linear-gradient(-45deg, #2563eb, #7c3aed, #0891b2, #2563eb)',
  
  // Night Mode: Deep Blues, Purple, Dark Slate (For evening feel)
  nightGradient: 'linear-gradient(-45deg, #020617, #1e1b4b, #312e81, #111827)',
  
  // Image Mode Configuration
  image: {
    url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop',
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
// 🛠️ TOOLS LIST (Categorized)
// ==========================================
export const TOOLS: ToolCategory[] = [
  {
    title: '学校相关',
    items: [
      {
        name: '推进原理与技术混排版-在线计算',
        url: 'https://aero.systemwow.top/',
        iconName: 'Rocket',
      },
	  {
        name: '推进原理与技术分排版-在线计算',
        url: 'https://aerocivil.systemwow.top/',
        iconName: 'Rocket',
      },
	  {
        name: '四川大学图书馆',
        url: 'https://lib.scu.edu.cn/',
        iconName: 'LibraryBig',
      }
    ]
  },
  {
    title: '日常生活',
    items: [
      {
        name: '天气预报',
        url: 'https://weather.systemwow.top/',
        iconName: 'Cloudy',
      },
	  {
        name: 'Google 翻译', 
        url: 'https://translate.google.com/',
        iconName: 'Languages',
      },
	  {
        name: '壁纸',
        url: 'https://wp.systemwow.top/',
        iconName: 'Wallpaper',
      }
    ]
  },
  {
    title: '实用 / 其他',
    items: [
      {
        name: 'P2P聊天',
        url: 'https://p2p.systemwow.top/',
        iconName: 'MessageCircleWarning',
      },
	  {
        name: 'PDF快捷拆分',
        url: 'https://ezpdf.systemwow.top/',
        iconName: 'FileText',
      },
      {
        name: 'IP',
        url: 'https://ip.systemwow.top/',
        iconName: 'LocateFixed',
      }
    ]
  },
  {
    title: '游戏娱乐',
    items: [
      { name: '游戏资源-非线性列车', url: 'https://juij.fun/', iconName: 'Gamepad2' }
    ]
  },
  {
    title: 'AI工具',
    items: [
      { name: '音乐制作', url: 'https://suno.com/', iconName: 'Music' },
	  { name: 'Gemini', url: 'https://gemini.google.com/app', iconName: 'Bot' },
	  { name: 'ChatGPT', url: 'https://chatgpt.com/', iconName: 'Bot' },
	  { name: 'AI studio', url: 'https://aistudio.google.com/', iconName: 'MonitorCloud' },
	  { name: 'NotebookLM', url: 'https://notebooklm.google.com/', iconName: 'NotebookPen' },
	  { name: 'Flow', url: 'https://labs.google/fx/zh/tools/flow', iconName: 'Clapperboard' }
    ]
  }
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

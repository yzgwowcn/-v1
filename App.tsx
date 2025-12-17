import React, { useState } from 'react';
import { ExternalLink, ChevronDown, Send } from 'lucide-react';
import MouseFollower from './components/MouseFollower';
import IconHelper from './components/IconHelper';
import AboutModal from './components/AboutModal';
import ThemeSwitcher from './components/ThemeSwitcher';
import BackgroundEffect from './components/BackgroundEffect';
import StyleEditor from './components/StyleEditor';
import { LINKS, PROFILE, TOOLS, THEME_CONFIG } from './constants';
import type { ThemeMode, BackgroundSettings } from './types';

const App: React.FC = () => {
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('day');
  
  // New State for Background Customization
  const [bgSettings, setBgSettings] = useState<BackgroundSettings>({
    speed: 1.0,
    blur: 80,
    hue: 0,
    saturation: 100,
  });

  // Lookup for dynamic colors
  const colorMap: Record<string, { bg: string, text: string, hoverBg: string, border: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600', border: 'hover:border-blue-300' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-500', hoverBg: 'group-hover:bg-pink-500', border: 'hover:border-pink-300' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', hoverBg: 'group-hover:bg-slate-800', border: 'hover:border-gray-400' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-600', border: 'hover:border-purple-300' },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans transition-colors duration-700">
      
      {/* Advanced Background System with Dynamic Settings */}
      <BackgroundEffect mode={themeMode} config={THEME_CONFIG} settings={bgSettings} />

      {/* Theme Switcher (Top Right) */}
      <ThemeSwitcher currentMode={themeMode} onSelectMode={setThemeMode} />

      {/* Style Editor (Bottom Right/Center) */}
      <StyleEditor settings={bgSettings} onChange={setBgSettings} />

      {/* Mouse Follower Layer */}
      <MouseFollower />
      
      {/* Content Container (Above background) */}
      <div className="relative z-10 w-full p-4 flex justify-center mb-16"> {/* mb-16 to avoid overlapping with StyleEditor on mobile */}
        {/* Main Glass Container */}
        <div className="glass-effect w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 relative bg-white/80 backdrop-blur-2xl border border-white/40 ring-1 ring-white/30">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative flex items-center justify-center group">
              {/* Logo Animation Rings */}
              <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-2 border-blue-500 rounded-full border-dashed animate-spin-slow"></div>
              
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center shadow-lg z-10 overflow-hidden relative">
                 <span className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-widest z-10">
                   {PROFILE.avatarText}
                 </span>
                 {/* Shine effect on hover */}
                 <div className="absolute inset-0 bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-1 text-slate-800">{PROFILE.title}</h1>
            <p className="text-sm text-slate-500">{PROFILE.subtitle}</p>
          </div>

          {/* Links Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            
            {LINKS.map((link) => {
              const colors = colorMap[link.colorClass] || colorMap['blue'];

              // Special handling for the Tools Group
              if (link.isToolGroup) {
                return (
                  <div 
                    key={link.id} 
                    className={`col-span-1 md:col-span-2 bg-white/80 border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:bg-white/95 ${colors.border} group backdrop-blur-sm`}
                  >
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer" 
                      onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`${colors.bg} p-3 rounded-xl ${colors.text} ${colors.hoverBg} group-hover:text-white transition-colors`}>
                          <IconHelper name={link.iconName} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">{link.title}</h3>
                          <p className="text-xs text-slate-500">{link.subtitle}</p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`text-slate-400 transition-transform duration-300 ${isToolsExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                    
                    {/* Expanded List with Categories */}
                    <div 
                      className={`bg-slate-50/50 border-t border-slate-100/50 transition-all duration-300 ease-in-out overflow-hidden ${
                        isToolsExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-4 space-y-6">
                        {TOOLS.map((category, catIdx) => (
                          <div key={catIdx}>
                            {/* Category Title */}
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center">
                              {category.title}
                              <div className="h-px bg-slate-200 flex-1 ml-3"></div>
                            </h4>
                            
                            {/* Items Grid */}
                            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                              {category.items.map((tool, idx) => (
                                <a 
                                  key={idx}
                                  href={tool.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-blue-600 group/item border border-transparent hover:border-slate-100"
                                >
                                  <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-100 mr-3 group-hover/item:text-blue-500 transition-colors">
                                    <IconHelper name={tool.iconName} size={16} />
                                  </div>
                                  <span className="font-medium text-sm">{tool.name}</span>
                                  <ExternalLink size={12} className="ml-auto opacity-30 group-hover/item:opacity-100 transition-opacity" />
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Standard Link Card
              return (
                <a 
                  key={link.id}
                  href={link.url} 
                  target={link.url.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className={`col-span-1 ${link.id === 'email' ? 'md:col-span-2' : ''} bg-white/80 border border-slate-200/60 p-4 rounded-2xl flex items-center space-x-4 cursor-pointer ${colors.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] hover:bg-white/95 group backdrop-blur-sm`}
                >
                  <div className={`${colors.bg} p-3 rounded-xl ${colors.text} ${colors.hoverBg} group-hover:text-white transition-colors`}>
                     <IconHelper name={link.iconName} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{link.title}</h3>
                    <p className="text-xs text-slate-500">{link.subtitle}</p>
                  </div>
                  {link.id === 'email' && (
                    <Send size={20} className="text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  )}
                </a>
              );
            })}

          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-xs text-slate-500">
            <p className="mb-2">{PROFILE.footerText}</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-slate-500 hover:text-blue-600 transition-colors font-medium border-b border-transparent hover:border-blue-600"
            >
              关于
            </button>
          </div>

        </div>

        <AboutModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          profile={PROFILE}
        />
      </div>
    </div>
  );
};

export default App;
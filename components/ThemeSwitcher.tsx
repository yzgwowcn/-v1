import React from 'react';
import { ThemeMode } from '../types';
import { Sun, Moon, Image as ImageIcon, Settings2 } from 'lucide-react';

interface ThemeSwitcherProps {
  currentMode: ThemeMode;
  onSelectMode: (mode: ThemeMode) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentMode, onSelectMode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Helper for button styles
  const getBtnClass = (isActive: boolean) => 
    `flex items-center gap-2 w-full p-2 rounded-lg text-sm transition-all ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-bold' 
        : 'hover:bg-slate-100 text-slate-700'
    }`;

  return (
    <div className="absolute top-4 right-4 z-40">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg"
        title="切换主题"
      >
        <Settings2 size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 flex flex-col gap-1 min-w-[150px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
           <div className="text-xs font-bold text-slate-400 mb-2 px-1 uppercase tracking-wider">外观设置</div>
           
           <button
             onClick={() => { onSelectMode('day'); setIsOpen(false); }}
             className={getBtnClass(currentMode === 'day')}
           >
             <Sun size={16} />
             <span>日间模式</span>
           </button>

           <button
             onClick={() => { onSelectMode('night'); setIsOpen(false); }}
             className={getBtnClass(currentMode === 'night')}
           >
             <Moon size={16} />
             <span>夜间模式</span>
           </button>

           <button
             onClick={() => { onSelectMode('image'); setIsOpen(false); }}
             className={getBtnClass(currentMode === 'image')}
           >
             <ImageIcon size={16} />
             <span>图片背景</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
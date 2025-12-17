import React, { useState } from 'react';
import { Settings2, X, RefreshCw, Sparkles } from 'lucide-react';
import { BackgroundSettings } from '../types';

interface StyleEditorProps {
  settings: BackgroundSettings;
  onChange: (newSettings: BackgroundSettings) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ settings, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof BackgroundSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const handleReset = () => {
    onChange({
      speed: 1,
      blur: 80,
      hue: 0,
      saturation: 100,
    });
  };

  return (
    <>
      {/* Toggle Button - Now a sleek tab on the right edge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 py-3 pl-3 pr-2 rounded-l-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 border-l border-t border-b border-white/40 backdrop-blur-md group hover:pl-5 ${
            isOpen ? 'bg-slate-900/80 text-blue-400 translate-x-full opacity-0' : 'bg-white/30 text-slate-600 hover:bg-white/60'
        }`}
        title="打开视觉设置"
      >
        <Settings2 size={20} className="group-hover:animate-spin-slow" />
      </button>

      {/* Editor Panel - Slide in from Right */}
      <div className={`fixed top-1/2 right-6 -translate-y-1/2 w-80 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 z-50 transition-all duration-500 ease-out border border-white/10 shadow-[0_0_50px_-10px_rgba(59,130,246,0.6)] ${
        isOpen ? 'translate-x-0 opacity-100 rotate-0' : 'translate-x-[120%] opacity-0 rotate-12 pointer-events-none'
      }`}>
        
        {/* Glow Effects inside the panel */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl pointer-events-none mix-blend-screen"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                <Sparkles size={18} className="text-yellow-400" /> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                    视觉调控台
                </span>
            </h3>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleReset} 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="重置"
                >
                    <RefreshCw size={14} />
                </button>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Controls */}
        <div className="space-y-6 relative z-10">
            {/* Speed Control */}
            <div className="space-y-2 group">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1 group-hover:text-blue-300 transition-colors">⚡ 流动速度</span>
                    <span className="font-mono bg-white/10 px-1.5 rounded">{settings.speed.toFixed(1)}x</span>
                </div>
                <input 
                    type="range" 
                    min="0.1" 
                    max="5" 
                    step="0.1"
                    value={settings.speed}
                    onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />
            </div>

            {/* Blur Control */}
            <div className="space-y-2 group">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1 group-hover:text-purple-300 transition-colors">💧 模糊深度</span>
                    <span className="font-mono bg-white/10 px-1.5 rounded">{settings.blur}px</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="150" 
                    value={settings.blur}
                    onChange={(e) => handleChange('blur', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                />
            </div>

            {/* Hue Control */}
            <div className="space-y-2 group">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1 group-hover:text-green-300 transition-colors">🎨 色相偏移</span>
                    <span className="font-mono bg-white/10 px-1.5 rounded">{settings.hue}°</span>
                </div>
                <div className="relative w-full h-1.5 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-50"></div>
                    <input 
                        type="range" 
                        min="0" 
                        max="360" 
                        value={settings.hue}
                        onChange={(e) => handleChange('hue', parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
                    />
                </div>
            </div>

            {/* Saturation Control */}
            <div className="space-y-2 group">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1 group-hover:text-pink-300 transition-colors">🌈 色彩浓度</span>
                    <span className="font-mono bg-white/10 px-1.5 rounded">{settings.saturation}%</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="200" 
                    value={settings.saturation}
                    onChange={(e) => handleChange('saturation', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400"
                />
            </div>
        </div>

        {/* Decorative Footer */}
        <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-slate-500 text-center flex justify-center items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             Live Background System Active
        </div>
      </div>
    </>
  );
};

export default StyleEditor;
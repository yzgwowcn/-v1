import React from 'react';
import { ThemeMode, ThemeConfig, BackgroundSettings } from '../types';

interface BackgroundEffectProps {
  mode: ThemeMode;
  config: ThemeConfig;
  settings: BackgroundSettings;
}

const BackgroundEffect: React.FC<BackgroundEffectProps> = ({ mode, config, settings }) => {
  // If Image Mode, render the simple image background with a slight noise overlay
  if (mode === 'image') {
    return (
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* The Image */}
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-in-out transform"
          style={{ 
            backgroundImage: `url(${config.image.url})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            transform: config.image.blur ? 'scale(1.05)' : 'none',
            filter: `
              blur(${settings.blur / 5}px) 
              hue-rotate(${settings.hue}deg) 
              saturate(${settings.saturation}%)
            `
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      </div>
    );
  }

  // Configuration for Day vs Night Orbs
  const isDay = mode === 'day';
  
  // Dynamic classes for colors
  const bgBase = isDay ? 'bg-slate-50' : 'bg-[#0a0a0f]'; // Darker base for night to make lights pop
  
  // Blend Mode Logic: 
  // Day = multiply (Watercolor effect)
  // Night = screen (Glowing Light effect)
  const blendMode = isDay ? 'mix-blend-multiply' : 'mix-blend-screen';

  // Orb Colors 
  // Day: Pastel colors that darken the white background
  // Night: Bright neon colors that light up the dark background
  const orb1Color = isDay ? 'bg-blue-400' : 'bg-blue-600';
  const orb2Color = isDay ? 'bg-purple-300' : 'bg-fuchsia-600';
  const orb3Color = isDay ? 'bg-cyan-300' : 'bg-indigo-500';

  // Opacity: Night mode needs lower opacity if using screen mode to avoid blown-out white
  const opacity = isDay ? 'opacity-70' : 'opacity-40';

  // Calculate duration based on speed multiplier. 
  // Base duration is around 20s. Higher speed = Lower duration.
  // Avoid division by zero.
  const baseDuration = 20; 
  const duration = Math.max(0.1, baseDuration / Math.max(0.1, settings.speed));
  
  const commonStyle = {
    filter: `blur(${settings.blur}px) hue-rotate(${settings.hue}deg) saturate(${settings.saturation}%)`,
    '--anim-duration': `${duration}s`,
  } as React.CSSProperties;

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden transition-colors duration-1000 pointer-events-none ${bgBase}`}>
      
      {/* Orb 1: Top Left */}
      <div 
        className={`absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] rounded-full ${blendMode} ${opacity} animate-drift-1 transition-colors duration-1000 ${orb1Color}`}
        style={commonStyle} 
      />
      
      {/* Orb 2: Bottom Right */}
      <div 
        className={`absolute top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full ${blendMode} ${opacity} animate-drift-2 transition-colors duration-1000 ${orb2Color}`}
        style={{...commonStyle, animationDelay: '-5s'}} 
      />

      {/* Orb 3: Bottom Left / Center */}
      <div 
        className={`absolute -bottom-[20%] left-[10%] w-[60vw] h-[60vw] rounded-full ${blendMode} ${opacity} animate-drift-3 transition-colors duration-1000 ${orb3Color}`}
        style={{...commonStyle, animationDelay: '-10s'}}
      />

      {/* Additional Night Mode Depth Layer - subtle vignette */}
      {!isDay && (
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      )}

      {/* Noise Texture Overlay - Essential for quality */}
      <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />
      
    </div>
  );
};

export default BackgroundEffect;
import React from 'react';
import * as Icons from 'lucide-react';

interface IconHelperProps {
  name: string;
  size?: number;
  className?: string;
}

const IconHelper: React.FC<IconHelperProps> = ({ name, size = 24, className }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let LucideIcon = (Icons as any)[name];

  if (!LucideIcon) {
    // Try to find common renames or alternatives to prevent crashes
    const fallbacks: Record<string, string[]> = {
      'HelpCircle': ['CircleHelp'],
      'Sliders': ['SlidersHorizontal', 'Settings2', 'Settings'],
      'Edit': ['Pencil', 'Edit2'],
      'Tv': ['Monitor', 'Tv2'],
    };

    const alternatives = fallbacks[name] || [];
    for (const alt of alternatives) {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       if ((Icons as any)[alt]) {
         LucideIcon = (Icons as any)[alt];
         break;
       }
    }
  }

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    // Render a safe placeholder div to prevent the "Element type is invalid" crash
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`inline-block bg-slate-200/50 rounded-md ${className}`} 
        title={`Missing Icon: ${name}`}
      />
    );
  }

  return <LucideIcon size={size} className={className} />;
};

export default IconHelper;
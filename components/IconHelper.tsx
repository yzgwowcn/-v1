import React from 'react';
import * as Icons from 'lucide-react';

interface IconHelperProps {
  name: string;
  size?: number;
  className?: string;
}

const IconHelper: React.FC<IconHelperProps> = ({ name, size = 24, className }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LucideIcon = (Icons as any)[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return <Icons.HelpCircle size={size} className={className} />;
  }

  return <LucideIcon size={size} className={className} />;
};

export default IconHelper;
import React, { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';
import { ProfileData } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, profile }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Content */}
      <div 
        className={`bg-white w-full max-w-sm mx-4 rounded-2xl p-6 shadow-2xl transform transition-all duration-300 relative z-10 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
            <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">关于我</h2>
          <div className="w-16 h-1 bg-blue-500 rounded-full mx-auto mb-4"></div>
          
          <div className="space-y-1">
            <p className="text-lg text-slate-700 font-medium">{profile.name}</p>
            <p className="text-slate-500">{profile.subtitle}</p>
            <p className="text-slate-400 text-sm mt-4">
                欢迎来到我的个人主页
            </p>
          </div>
          
          <button 
            onClick={onClose} 
            className="mt-8 bg-slate-900 text-white px-6 py-2 rounded-full hover:bg-slate-800 transition-colors w-full shadow-lg shadow-slate-900/20"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, Quote } from 'lucide-react';

interface HitokotoProps {
  defaultText: string;
}

interface HitokotoData {
  hitokoto: string;
  from: string;
  from_who: string;
}

const Hitokoto: React.FC<HitokotoProps> = ({ defaultText }) => {
  const [text, setText] = useState<string>(defaultText);
  const [author, setAuthor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const fetchHitokoto = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Add a timestamp to prevent caching
      const res = await fetch(`https://v1.hitokoto.cn?c=d&c=i&c=k&t=${Date.now()}`);
      const data: HitokotoData = await res.json();
      setText(data.hitokoto);
      setAuthor(data.from_who || data.from || '佚名');
    } catch (error) {
      console.error('Hitokoto fetch failed', error);
      // Keep default text or previous text on error
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Fetch on mount
  useEffect(() => {
    fetchHitokoto();
  }, []);

  return (
    <div 
      className="relative group cursor-pointer w-full max-w-lg mx-auto mt-4 mb-6 p-4 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={fetchHitokoto}
      title="点击刷新一言"
    >
      <div className="absolute top-2 left-2 text-blue-400/20">
        <Quote size={24} className="transform -scale-x-100" />
      </div>

      <div className={`relative px-6 py-1 flex flex-col items-center justify-center transition-opacity duration-500 ${loading ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
        <p className="text-lg text-slate-700 font-serif font-medium leading-relaxed tracking-wide text-center">
            {text}
        </p>
        
        {/* Author / Source */}
        {(!loading && text !== defaultText) && (
            <div className={`mt-3 flex items-center justify-end w-full text-xs text-slate-500 font-light transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                <div className="h-px w-8 bg-slate-300 mr-2"></div>
                {author}
            </div>
        )}
      </div>

      <div className="absolute bottom-2 right-2 text-blue-400/20">
        <Quote size={24} />
      </div>

      {/* Refresh Icon on Hover - Floating at top right */}
      <div className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/50 text-slate-400 backdrop-blur-sm transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
      </div>
    </div>
  );
};

export default Hitokoto;
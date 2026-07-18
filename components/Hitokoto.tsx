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

  const fetchHitokoto = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchHitokoto();
    const timer = window.setInterval(fetchHitokoto, 45000);
    return () => window.clearInterval(timer);
  }, [fetchHitokoto]);

  return (
    <div className={`hitokoto-card ${loading ? 'is-loading' : ''}`}>
      <Quote size={23} className="hitokoto-quote hitokoto-quote-open" />
      <div className="hitokoto-copy"><p>{text}</p>{(!loading && text !== defaultText) && <span>— {author}</span>}</div>
      <button className="hitokoto-refresh" onClick={fetchHitokoto} aria-label="刷新一言" title="刷新一言"><RefreshCcw size={14} className={loading ? 'is-spinning' : ''} /></button>
      <Quote size={23} className="hitokoto-quote hitokoto-quote-close" />
    </div>
  );
};

export default Hitokoto;

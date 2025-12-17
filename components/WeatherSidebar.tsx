import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Moon, MapPin, Loader2, ChevronRight } from 'lucide-react';

interface WeatherData {
  temp: number;
  code: number;
  city: string;
  isDay: boolean;
}

const WeatherSidebar: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isVisible, setIsVisible] = useState(false); 
  
  // Responsive State
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // Tailwind md breakpoint
      setIsMobile(mobile);
      // Default to collapsed on mobile, expanded on desktop
      if (mobile) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // WMO Weather interpretation codes
  const getWeatherInfo = (code: number) => {
    if (code === 0) return { label: '晴朗', icon: Sun, color: 'text-orange-400' };
    if (code >= 1 && code <= 3) return { label: '多云', icon: Cloud, color: 'text-blue-200' };
    if (code >= 45 && code <= 48) return { label: '雾', icon: Wind, color: 'text-slate-300' };
    if (code >= 51 && code <= 67) return { label: '下雨', icon: CloudRain, color: 'text-blue-400' };
    if (code >= 71 && code <= 77) return { label: '下雪', icon: CloudSnow, color: 'text-cyan-100' };
    if (code >= 80 && code <= 82) return { label: '阵雨', icon: CloudRain, color: 'text-blue-500' };
    if (code >= 95 && code <= 99) return { label: '雷雨', icon: CloudLightning, color: 'text-purple-400' };
    return { label: '未知', icon: Cloud, color: 'text-slate-400' };
  };

  const getGreeting = (code: number, temp: number) => {
    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour >= 5 && hour < 11) timeGreeting = '早上好';
    else if (hour >= 11 && hour < 13) timeGreeting = '中午好';
    else if (hour >= 13 && hour < 18) timeGreeting = '下午好';
    else if (hour >= 18 && hour < 23) timeGreeting = '晚上好';
    else timeGreeting = '夜深了';

    let weatherTip = '';
    if (code === 0) weatherTip = '阳光正好，心情也跟着亮起来。';
    else if (code >= 51) weatherTip = '出门记得带把伞哦。';
    else if (temp < 10) weatherTip = '天气转凉，注意保暖。';
    else if (temp > 30) weatherTip = '注意防暑降温。';
    else weatherTip = '愿你度过愉快的一天。';

    return { title: timeGreeting, sub: weatherTip };
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        // Timeout to prevent hanging indefintely
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        let lat: number, lon: number, city: string;

        // 1. Try Primary Geolocation (ipwho.is)
        try {
            const res = await fetch('https://ipwho.is/', { signal: controller.signal });
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            if (!data.success) throw new Error('API error');
            lat = data.latitude;
            lon = data.longitude;
            city = data.city;
        } catch (err) {
            console.warn('Primary geo API failed, trying backup...', err);
            // 2. Try Backup Geolocation (geojs.io)
            // Note: Use HTTPS to avoid mixed content errors
            const res = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: controller.signal });
            if (!res.ok) throw new Error('Backup network error');
            const data = await res.json();
            lat = parseFloat(data.latitude);
            lon = parseFloat(data.longitude);
            city = data.city;
        }

        clearTimeout(timeoutId);

        // 3. Fetch Weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
          { signal: controller.signal }
        );
        const weatherData = await weatherRes.json();
        const current = weatherData.current_weather;
        
        if (isMounted) {
          setWeather({
            temp: current.temperature,
            code: current.weathercode,
            city: city || '本地',
            isDay: current.is_day === 1
          });
        }
      } catch (error) {
        console.error('Weather fetch failed:', error);
        
        // 4. Fallback to Default Location (Chengdu - Sichuan University)
        try {
            // Only try fallback if still mounted
            if (!isMounted) return;
            
            const fallbackRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=30.6586&longitude=104.0647&current_weather=true`
            );
            const fallbackData = await fallbackRes.json();
            const current = fallbackData.current_weather;
            
            if (isMounted) {
                setWeather({
                    temp: current.temperature,
                    code: current.weathercode,
                    city: '成都',
                    isDay: current.is_day === 1
                });
            }
        } catch (finalError) {
             if (isMounted) {
                setWeather({ temp: 0, code: 0, city: '未知', isDay: true });
             }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setTimeout(() => setIsVisible(true), 100);
        }
      }
    };

    fetchData();

    return () => { 
        isMounted = false; 
        controller.abort();
    };
  }, []);

  // Loading State
  if (loading) {
    return (
        <div className="fixed md:left-0 md:top-1/2 md:-translate-y-1/2 left-0 top-4 z-40 p-3 bg-slate-900/20 backdrop-blur-md rounded-r-xl border-y border-r border-white/10 shadow-lg">
            <Loader2 className="animate-spin text-white/70" size={20} />
        </div>
    );
  }

  const weatherInfo = weather ? getWeatherInfo(weather.code) : { label: '...', icon: Loader2, color: 'text-white' };
  const WeatherIcon = weatherInfo.icon;
  const greetData = weather ? getGreeting(weather.code, weather.temp) : { title: '你好', sub: '欢迎访问' };

  return (
    <div 
      className={`fixed z-40 transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
      }
      /* Desktop: Centered vertically */
      md:top-1/2 md:-translate-y-1/2 md:left-0
      /* Mobile: Top-left, avoiding center */
      top-4 left-0
      `}
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          bg-slate-900/30 backdrop-blur-xl border-y border-r border-white/10 rounded-r-2xl
          shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden group cursor-pointer md:cursor-default
          transition-all duration-500 ease-in-out
          ${isExpanded ? 'w-[240px] p-5' : 'w-[60px] p-3 hover:bg-slate-900/40'}
        `}
      >
        {/* Subtle Gradient Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        {weather && (
          <div className="relative z-10">
            {/* 
               Collapsed View (Mobile Default) 
               Shows only Icon + Temp in a compact stack
            */}
            <div className={`flex flex-col items-center justify-center gap-1 transition-opacity duration-300 absolute inset-0 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <WeatherIcon size={20} className={weatherInfo.color} />
                <span className="text-xs font-bold text-white/90">{Math.round(weather.temp)}°</span>
                <ChevronRight size={12} className="text-white/30 mt-1 animate-pulse" />
            </div>

            {/* 
               Expanded View (Desktop Default / Mobile Clicked)
               Shows full details
            */}
            <div className={`flex flex-col gap-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Header Row: Greeting & Temp */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 drop-shadow-sm whitespace-nowrap">
                            {greetData.title}
                        </h3>
                        <div className="flex items-center text-xs text-blue-100/70 gap-1 mt-0.5 whitespace-nowrap">
                            <MapPin size={10} />
                            {weather.city}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end pl-2">
                         <div className={`text-3xl font-light tracking-tighter ${weatherInfo.color} drop-shadow-sm`}>
                            {Math.round(weather.temp)}°
                         </div>
                         <div className="flex items-center gap-1 text-[10px] text-slate-300 uppercase tracking-wide opacity-80 whitespace-nowrap">
                             <WeatherIcon size={10} />
                             {weatherInfo.label}
                         </div>
                    </div>
                </div>
                
                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-white/5 via-white/20 to-white/5"></div>
                
                {/* Footer Message */}
                <p className="text-xs text-slate-200/80 leading-relaxed font-light min-h-[32px]">
                    {greetData.sub}
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherSidebar;

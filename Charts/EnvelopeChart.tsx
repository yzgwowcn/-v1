import React, { useEffect, useRef, useState } from 'react';
import { EngineInputs } from '../../types';
import { solveEngine } from '../../services/engineService';

interface Props {
  inputs: EngineInputs;
}

const EnvelopeChart: React.FC<Props> = ({ inputs }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [metric, setMetric] = useState<'sfc' | 'thrust'>('sfc');
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; mach: number; alt: number; val: number; error?: string } | null>(null);

  // 长宽高设置
  const width = 600;
  const height = 400;
  const stepsX = 60; 
  const stepsY = 50; 
  const maxMach = 3.5;
  const maxAlt = 20.0;

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (isMounted.current) setLoading(true);

    // 加载时间冗余，避免阻塞 UI 渲染
    const timer = setTimeout(() => {
        if (!isMounted.current) return;

        ctx.clearRect(0, 0, width, height);

        const cellW = width / stepsX;
        const cellH = height / stepsY;

        let minVal = Infinity;
        let maxVal = -Infinity;
        const gridData: (number | null)[][] = [];

        // 1. 数据计算
        for (let i = 0; i < stepsY; i++) {
            const row: (number | null)[] = [];
            const h = (i / (stepsY - 1)) * maxAlt;
            
            for (let j = 0; j < stepsX; j++) {
                const ma = (j / (stepsX - 1)) * maxMach;
                const localInputs = { ...inputs, altitude: h, mach: ma };
                const res = solveEngine(localInputs);

                const isThermallyValid = res.stations['3'].Tt <= localInputs.tt4;

                let val = NaN;
                if (isThermallyValid) {
                    if (metric === 'sfc') {
                        val = (res.Fs > 0 && res.SFC < 5.0) ? res.SFC : NaN;
                    } else {
                        val = (res.Fs > 0) ? res.F_total / 1000 : NaN; 
                    }
                }

                if (!isNaN(val)) {
                    if (val < minVal) minVal = val;
                    if (val > maxVal) maxVal = val;
                }
                
                row.push(isNaN(val) ? null : val);
            }
            gridData.push(row);
        }

        // 2. 图像绘制
        for (let i = 0; i < stepsY; i++) {
            for (let j = 0; j < stepsX; j++) {
                const val = gridData[i][j];
                
                // Invert Y: i=0 is Altitude 0 (Bottom)
                const drawY = height - (i + 1) * cellH;
                const drawX = j * cellW;

                if (val === null) {
                    ctx.fillStyle = 'rgba(241, 245, 249, 1)'; 
                } else {
                    const t = (val - minVal) / (maxVal - minVal);
                    // Standard Heatmap logic
                    const hue = (1 - t) * 240; 
                    ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;
                }

                ctx.fillRect(drawX - 0.5, drawY - 0.5, cellW + 1, cellH + 1);
            }
        }

        // 3. 当前点标注
        const curX = (inputs.mach / maxMach) * width;
        const curY = height - (inputs.altitude / maxAlt) * height;

        if (inputs.mach <= maxMach && inputs.altitude <= maxAlt) {
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 6;
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(curX, curY, 6, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#fff";
            ctx.stroke();
        }

        if (isMounted.current) setLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [inputs, metric]); 

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mach = (x / rect.width) * maxMach;
    const alt = ((rect.height - y) / rect.height) * maxAlt;

    if (mach < 0 || mach > maxMach || alt < 0 || alt > maxAlt) return;

    const localInputs = { ...inputs, altitude: alt, mach: mach };
    const res = solveEngine(localInputs);
    
    const Tt3 = res.stations['3'].Tt;
    const isOverTemp = Tt3 > inputs.tt4;

    let val = NaN;
    if (metric === 'sfc') {
        val = res.Fs > 0 ? res.SFC : NaN;
    } else {
        val = res.Fs > 0 ? res.F_total / 1000 : NaN;
    }

    setHoverInfo({ 
        x, y, mach, alt, val,
        error: isOverTemp ? `Tt3 (${Tt3.toFixed(0)}K) > Tt4` : undefined
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
  };

  const xTicks = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
  const yTicks = [0, 5, 10, 15, 20];

  return (
    <div className="w-full flex flex-col items-center">
       {/* Controls */}
       <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setMetric('sfc')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${metric === 'sfc' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            耗油率 (SFC)
          </button>
          <button 
            onClick={() => setMetric('thrust')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${metric === 'thrust' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            净推力 (Fn)
          </button>
       </div>

       {/* Chart Container */}
       <div className="relative pl-10 pb-8 select-none">
           <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-400">高度 (km)</div>
           
           <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-slate-500 font-medium py-[2px]">
              {yTicks.slice().reverse().map(t => <span key={t} className="text-right pr-2">{t}</span>)}
           </div>

           <div className="relative border border-slate-300 rounded overflow-hidden bg-slate-100 shadow-sm cursor-crosshair">
                <canvas 
                    ref={canvasRef} 
                    width={width} 
                    height={height}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="block w-full max-w-[600px] h-auto"
                />
                
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
                        <span className="text-blue-600 font-semibold animate-pulse">计算中...</span>
                    </div>
                )}

                {hoverInfo && (
                    <div 
                        className="absolute pointer-events-none bg-slate-800/95 text-white text-xs rounded-lg p-3 shadow-xl backdrop-blur-sm border border-white/20 z-20 whitespace-nowrap"
                        style={{ 
                            left: hoverInfo.x + 15, 
                            top: hoverInfo.y + 15,
                            transform: `translate(${hoverInfo.x > width * 0.7 ? '-100%' : '0'}, ${hoverInfo.y > height * 0.7 ? '-100%' : '0'})`
                        }}
                    >
                        <div className="font-bold mb-1 border-b border-white/20 pb-1 text-slate-200">
                            Ma {hoverInfo.mach.toFixed(2)} / Alt {hoverInfo.alt.toFixed(1)} km
                        </div>
                        
                        {hoverInfo.error ? (
                            <div className="text-rose-300 font-semibold flex items-center gap-1">
                                <span>⚠️ 超出热力限制</span>
                                <span className="text-[10px] opacity-80">({hoverInfo.error})</span>
                            </div>
                        ) : !isNaN(hoverInfo.val) ? (
                            <div className="flex items-center gap-2">
                               <span className={metric === 'sfc' ? 'text-blue-300' : 'text-emerald-300'}>
                                   {metric === 'sfc' ? 'SFC:' : '推力:'}
                               </span>
                               <span className="font-mono text-base font-semibold">
                                   {hoverInfo.val.toFixed(metric === 'sfc' ? 4 : 1)}
                               </span>
                               <span className="text-slate-400 scale-90">
                                   {metric === 'sfc' ? 'kg/N/h' : 'kN'}
                               </span>
                            </div>
                        ) : (
                           <div className="text-slate-400 italic">无有效数据</div>
                        )}
                    </div>
                )}
           </div>

           <div className="absolute bottom-0 left-10 right-0 h-6">
               {xTicks.map((t) => (
                   <span 
                    key={t} 
                    className="absolute text-xs text-slate-500 font-medium transform -translate-x-1/2"
                    style={{ left: `${(t / maxMach) * 100}%` }}
                   >
                       {t}
                   </span>
               ))}
           </div>
           
           <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">马赫数 (Mach)</div>
       </div>

       <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500 bg-white/50 px-4 py-2 rounded-full border border-white/60">
            <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#fbbf24] border border-white shadow-sm"></span>
                <span>当前设计点</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-slate-300"></div>
            <div className="flex items-center gap-1">
                 <span className="w-3 h-3 bg-slate-100 border border-slate-300"></span>
                 <span>空白 = 热力限制区 (Tt3 &gt; Tt4)</span>
            </div>
       </div>
    </div>
  );
};

export default EnvelopeChart;
import React, { useMemo, useCallback } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, Legend } from 'recharts';
import { EngineInputs } from '../../types';
import { solveEngine } from '../../services/engineService';

interface Props {
  inputs: EngineInputs;
}

const OptimizationChart: React.FC<Props> = ({ inputs }) => {
  const { optimizationData, minPoint, currentPoint } = useMemo(() => {
    const data = [];
    let minSFC = Infinity;
    let minPiC = 0;
    
    // 范围
    for (let pi_c_overall = 5; pi_c_overall <= 80; pi_c_overall += 1) {
      const req_pi_cH = pi_c_overall / inputs.fanPressureRatio;
      
      if (req_pi_cH < 1.0) continue;

      const res = solveEngine(inputs, req_pi_cH);
      
      // 标注
      if (res.Fs > 0 && res.SFC < 15.0) {
        if (res.SFC < minSFC) {
          minSFC = res.SFC;
          minPiC = pi_c_overall;
        }
        data.push({
          pi_c: pi_c_overall,
          sfc: res.SFC,
          fs: res.Fs
        });
      }
    }

    const currentTotalPi = inputs.fanPressureRatio * inputs.hpcPressureRatio;
    const currentRes = solveEngine(inputs);

    return { 
      optimizationData: data, 
      minPoint: { x: minPiC, y: minSFC === Infinity ? 0 : minSFC },
      currentPoint: { x: currentTotalPi, y: currentRes.SFC }
    };
  }, [inputs]);

  // Use useCallback to ensure function identity stability
  const tooltipFormatter = useCallback((value: number, name: string) => {
    if (typeof value !== 'number') return value;
    if (name.includes('SFC')) return value.toFixed(5);
    if (name.includes('Fs') || name.includes('推力')) return value.toFixed(1);
    return value.toFixed(4);
  }, []);

  if (optimizationData.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
        <div className="text-center text-slate-500">
          <p className="font-semibold">未找到有效设计点</p>
          <p className="text-xs mt-1">请尝试调整飞行条件或部件限制。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] flex flex-col">
      <div className="mb-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-800 flex-shrink-0">
        <strong>优化目标:</strong> 通过改变总压比 (π_c) 来寻找最小耗油率 (SFC)。
        <span className="block text-xs mt-1 text-blue-600">约束条件: 固定风扇压比 ({inputs.fanPressureRatio}) 和 涡轮前温度 Tt4 ({inputs.tt4}K)。</span>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={optimizationData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis 
              dataKey="pi_c" 
              label={{ value: '总压比 (Overall Pressure Ratio)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 12 }}
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              yAxisId="left" 
              domain={['auto', 'auto']}
              stroke="#ef4444" 
              label={{ value: '耗油率 SFC (kg/N/h)', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 12 }}
              tick={{ fill: '#ef4444', fontSize: 12 }}
              tickFormatter={(val) => val.toFixed(4)}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={['auto', 'auto']}
              stroke="#0284c7" 
              label={{ value: '单位推力 Fs (N/kg/s)', angle: 90, position: 'insideRight', fill: '#0284c7', fontSize: 12 }}
              tick={{ fill: '#0284c7', fontSize: 12 }}
              tickFormatter={(val) => val.toFixed(0)}
            />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(8px)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={tooltipFormatter}
            />
            <Legend wrapperStyle={{ paddingTop: '8px' }}/>
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="sfc" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6 }}
              name="耗油率 (SFC)" 
              animationDuration={500}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="fs" 
              stroke="#0284c7" 
              strokeWidth={2} 
              strokeDasharray="4 4" 
              dot={false} 
              activeDot={{ r: 6 }}
              name="单位推力 (Fs)" 
              animationDuration={500}
            />
            
            {minPoint.x > 0 && minPoint.y > 0 && minPoint.y !== Infinity && (
              <ReferenceDot 
                yAxisId="left"
                x={minPoint.x} 
                y={minPoint.y} 
                r={6} 
                fill="#ef4444" 
                stroke="#fff" 
                strokeWidth={2}
                label={{ position: 'top', value: '最小SFC', fill: '#ef4444', fontSize: 10, fontWeight: 600 }}
              />
            )}

            <ReferenceDot
               yAxisId="left"
               x={currentPoint.x}
               y={currentPoint.y}
               r={6}
               fill="#1e293b"
               stroke="#fff"
               strokeWidth={2}
               label={{ position: 'bottom', value: '当前点', fill: '#1e293b', fontSize: 10, fontWeight: 600 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OptimizationChart;
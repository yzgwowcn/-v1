import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { EngineInputs } from '../../types';
import { solveEngine } from '../../services/engineService';

interface Props {
  inputs: EngineInputs;
}

const TemperatureSensitivityChart: React.FC<Props> = ({ inputs }) => {
  const data = useMemo(() => {
    const points = [];
    const minT = 1000;
    const maxT = 2500;
    for (let T = minT; T <= maxT; T += 50) {
      const res = solveEngine(inputs, undefined, undefined, T);
      if (res.Fs > 0) {
        points.push({
          tt4: T,
          sfc: res.SFC,
          fs: res.Fs
        });
      }
    }
    return points;
  }, [inputs]);

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col h-[420px]">
      <div className="mb-4 flex-shrink-0">
        <h4 className="text-slate-800 font-bold flex items-center gap-2 text-base">
           <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm"></span>
           涡轮前温度敏感性分析
        </h4>
        <p className="text-xs text-slate-500 mt-1.5 ml-5 leading-relaxed">
          分析涡轮前温度 (Tt4) 对发动机性能的影响。
          <br/>提高 Tt4 可显著增加单位推力 (Fs)，是提升航空发动机推重比的关键途径。
        </p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="tt4" 
              label={{ value: '涡轮前温度 Tt4 (K)', position: 'insideBottom', offset: -15, fontSize: 12, fill: '#64748b', fontWeight: 500 }} 
              fontSize={12}
              tick={{ fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              yAxisId="left" 
              domain={['auto', 'auto']} 
              fontSize={12} 
              tick={{ fill: '#ef4444' }}
              axisLine={false}
              tickLine={false}
              label={{ value: '耗油率 SFC (kg/N/h)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#ef4444', dx: -5 }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={['auto', 'auto']} 
              fontSize={12} 
              tick={{ fill: '#f59e0b' }}
              axisLine={false}
              tickLine={false}
              label={{ value: '单位推力 Fs (N/kg/s)', angle: 90, position: 'insideRight', fontSize: 12, fill: '#f59e0b', dx: 5 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
              formatter={(val: number) => val.toFixed(4)}
              labelStyle={{ color: '#64748b', marginBottom: '4px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Line yAxisId="left" type="monotone" dataKey="sfc" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name="耗油率 (SFC)" />
            <Line yAxisId="right" type="monotone" dataKey="fs" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name="单位推力 (Fs)" />
            <ReferenceLine x={inputs.tt4} stroke="#1e293b" strokeDasharray="3 3" label={{ position: 'top', value: '当前点', fontSize: 10, fill: '#1e293b' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureSensitivityChart;
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { EngineInputs } from '../../types';
import { solveEngine } from '../../services/engineService';

interface Props {
  inputs: EngineInputs;
}

const BypassOptimizationChart: React.FC<Props> = ({ inputs }) => {
  const data = useMemo(() => {
    const points = [];
    for (let B = 0; B <= 12; B += 0.5) {
      const res = solveEngine(inputs, undefined, B);
      if (res.Fs > 0) {
        points.push({
          bypass: B,
          sfc: res.SFC,
          eta_p: res.eta_p * 100 // Convert to percentage
        });
      }
    }
    return points;
  }, [inputs]);

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col h-[420px]">
      <div className="mb-4 flex-shrink-0">
        <h4 className="text-slate-800 font-bold flex items-center gap-2 text-base">
           <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></span>
           涵道比敏感性分析
        </h4>
        <p className="text-xs text-slate-500 mt-1.5 ml-5 leading-relaxed">
          展示随着涵道比 (B) 的增加，推进效率 (η_p) 显著提升，从而有效降低耗油率 (SFC)。
          <br/>这解释了为何民用航空发动机倾向于采用大涵道比设计。
        </p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="bypass" 
              label={{ value: '涵道比 (B)', position: 'insideBottom', offset: -15, fontSize: 12, fill: '#64748b', fontWeight: 500 }} 
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
              domain={[0, 100]} 
              fontSize={12} 
              tick={{ fill: '#6366f1' }}
              axisLine={false}
              tickLine={false}
              label={{ value: '推进效率 η_p (%)', angle: 90, position: 'insideRight', fontSize: 12, fill: '#6366f1', dx: 5 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
              formatter={(val: number) => val.toFixed(3)}
              labelStyle={{ color: '#64748b', marginBottom: '4px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Line yAxisId="left" type="monotone" dataKey="sfc" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name="耗油率 (SFC)" />
            <Line yAxisId="right" type="monotone" dataKey="eta_p" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name="推进效率 (η_p)" />
            <ReferenceLine x={inputs.bypassRatio} stroke="#1e293b" strokeDasharray="3 3" label={{ position: 'top', value: '当前点', fontSize: 10, fill: '#1e293b' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BypassOptimizationChart;
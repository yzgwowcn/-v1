import React, { useState, useMemo } from 'react';
import Sidebar from './components/Layout/Sidebar';
import MetricCard from './components/Layout/MetricCard';
import StationChart from './components/Charts/StationChart';
import OptimizationChart from './components/Charts/OptimizationChart';
import BypassOptimizationChart from './components/Charts/BypassOptimizationChart';
import TemperatureSensitivityChart from './components/Charts/TemperatureSensitivityChart';
import EnvelopeChart from './components/Charts/EnvelopeChart';
import { EngineInputs, TabOption, StationResult } from './types';
import { solveEngine } from './services/engineService';
import { Activity, Gauge, BarChart3, TrendingUp, Layers, AlertTriangle } from 'lucide-react';

// Define defaultInputs outside the component to guarantee stability across renders
const defaultInputs: EngineInputs = {
  textbookMode: true,
  refFsWet: 1095.0,
  refSfcWet: 0.1804,
  refFsDry: 643.0,
  refSfcDry: 0.1274,
  altitude: 11.0,
  mach: 1.6,
  massFlowDesign: 100.0,
  bypassRatio: 0.4,
  fanPressureRatio: 3.8,
  hpcPressureRatio: 4.474,
  tt4: 1800.0,
  afterburnerOn: true,
  ttAb: 2000.0,
  
  // Efficiency defaults
  eta_cL: 0.868,
  eta_cH: 0.878,
  eta_tH: 0.89,
  eta_tL: 0.91,
  eta_m: 0.98,
  eta_b: 0.98,

  // Pressure Recovery defaults
  sigma_i: 0.9335,
  sigma_b: 0.97,
  sigma_bypass: 0.98,
  sigma_m: 0.97,
  sigma_e: 0.98,
  sigma_ab_dry: 0.98,
  sigma_ab_wet: 0.96,

  // Flow defaults
  beta: 0.01,
  delta_1: 0.05,
  delta_2: 0.05,
};

const App: React.FC = () => {
  // State for the form inputs (Draft mode)
  const [draftInputs, setDraftInputs] = useState<EngineInputs>(defaultInputs);

  // State for the actual calculation (Active mode)
  const [activeInputs, setActiveInputs] = useState<EngineInputs>(defaultInputs);
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.PARAM);

  // Compute Results based on ACTIVE inputs
  const results = useMemo(() => solveEngine(activeInputs), [activeInputs]);

  // Handle Calculate Click
  const handleCalculate = () => {
    setActiveInputs({ ...draftInputs });
  };

  const currentRefFs = activeInputs.afterburnerOn ? activeInputs.refFsWet : activeInputs.refFsDry;
  const currentRefSfc = activeInputs.afterburnerOn ? activeInputs.refSfcWet : activeInputs.refSfcDry;
  const d_Fs = results.Fs - currentRefFs;
  const d_Sfc = results.SFC - currentRefSfc;
  
  const F_total_kN = results.F_total / 1000;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar 
        inputs={draftInputs} 
        setInputs={setDraftInputs} 
        onCalculate={handleCalculate}
      />
      
      <main className="flex-1 lg:ml-80 p-6 lg:p-10 overflow-x-hidden">
        <div className="lg:hidden mb-6">
           <h1 className="text-2xl font-bold text-slate-800">AeroEngine Pro V2</h1>
        </div>

        {/* Physics Warning Banner */}
        {results.stations['3'] && results.stations['3'].Tt > activeInputs.tt4 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-4 animate-fadeIn shadow-sm">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600 flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">物理限制警告：燃烧室入口温度过高</h3>
              <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                当前飞行条件导致压气机出口温度 (Tt3) 达到 <strong className="font-mono text-amber-900">{results.stations['3'].Tt.toFixed(0)} K</strong>，
                超过了设定的燃烧室出口温度 (Tt4: {activeInputs.tt4} K)。
                <br/>
                此时无法喷油燃烧，发动机推力将大幅下降。建议将 Tt4 设定为 <strong className="text-amber-800 border-b-2 border-amber-800/20 cursor-help" title="建议设定值 = Tt3 + 50K">{(results.stations['3'].Tt + 50).toFixed(0)} K</strong> 以上以恢复正常循环计算。
              </p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <MetricCard 
            title="单位推力 (Fs)" 
            value={results.Fs.toFixed(1)} 
            subValue={`${d_Fs > 0 ? '+' : ''}${d_Fs.toFixed(1)} vs 参考值`}
            trend={d_Fs > 0 ? 'good' : 'neutral'}
            icon={<Activity size={20} />}
          />
          <MetricCard 
            title="耗油率 (SFC)" 
            value={results.SFC.toFixed(4)} 
            subValue={`${d_Sfc > 0 ? '+' : ''}${d_Sfc.toFixed(4)} vs 参考值`}
            trend={d_Sfc < 0 ? 'good' : 'bad'}
            icon={<Gauge size={20} />}
          />
          <MetricCard 
            title="净推力 (Fn)" 
            value={`${F_total_kN.toFixed(1)} kN`}
            subValue={`推进效率: ${(results.eta_p * 100).toFixed(1)}%`}
            icon={<TrendingUp size={20} />}
          />
          <MetricCard 
            title="总压比 (OPR)" 
            value={results.pi_total.toFixed(2)} 
            subValue={`风扇: ${activeInputs.fanPressureRatio} × 高压: ${activeInputs.hpcPressureRatio.toFixed(2)}`}
            icon={<Layers size={20} />}
          />
        </div>

        {/* Visualization Tabs */}
        <div className="glass-panel rounded-2xl p-1 min-h-[500px] flex flex-col">
           <div className="flex space-x-1 bg-slate-100/50 p-1.5 rounded-t-xl overflow-x-auto">
             {[
               { id: TabOption.PARAM, label: '截面分析 (Station)', icon: BarChart3 },
               { id: TabOption.OPT, label: '循环优化 (Optimization)', icon: TrendingUp },
               { id: TabOption.ENV, label: '飞行包线 (Envelope)', icon: Layers },
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                   ${activeTab === tab.id 
                     ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                     : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
               >
                 <tab.icon size={16} />
                 {tab.label}
               </button>
             ))}
           </div>

           <div className="p-6 bg-white/40 flex-1 rounded-b-xl backdrop-blur-sm">
             {activeTab === TabOption.PARAM && (
               <div className="animate-fadeIn">
                 <h3 className="text-lg font-semibold text-slate-800 mb-4">热力学截面参数分析</h3>
                 <StationChart data={results} />
                 <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    {(Object.entries(results.stations) as [string, StationResult][]).map(([key, val]) => (
                        <div key={key} className="bg-white/60 rounded p-2 border border-slate-100">
                            <div className="text-xs text-slate-400 uppercase font-bold">截面 {key}</div>
                            <div className="text-sm font-semibold text-slate-700">{(val.Pt/1000).toFixed(0)} kPa</div>
                            <div className="text-xs text-slate-500">{val.Tt.toFixed(0)} K</div>
                        </div>
                    ))}
                 </div>
               </div>
             )}

             {activeTab === TabOption.OPT && (
               <div className="animate-fadeIn flex flex-col gap-8">
                 <div className="bg-white/60 p-6 rounded-2xl border border-white">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">最佳总压比优化</h3>
                    <p className="text-sm text-slate-500 mb-6">寻找最低 SFC 对应的总压比。对应教材中对 OPR 的选择逻辑。</p>
                    <OptimizationChart inputs={activeInputs} />
                 </div>

                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <BypassOptimizationChart inputs={activeInputs} />
                    <TemperatureSensitivityChart inputs={activeInputs} />
                 </div>
               </div>
             )}

             {activeTab === TabOption.ENV && (
               <div className="animate-fadeIn h-full">
                 <h3 className="text-lg font-semibold text-slate-800 mb-2">性能包线图</h3>
                 <p className="text-sm text-slate-500 mb-6">在不同飞行高度与马赫数下的性能映射，已自动屏蔽 Tt3大于Tt4 的不物理区域。</p>
                 <EnvelopeChart inputs={activeInputs} />
               </div>
             )}
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;
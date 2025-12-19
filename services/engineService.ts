import { EngineInputs, EngineResult, StationResult } from '../types';

// 常数设置
const CP_A = 1005.0;
const K_A = 1.4;
const CP_G = 1244.0;
const K_G = 1.3;
const HU = 42900.0 * 1000;
const R = 287.0;
const C_T0 = 3.0; // kW/kg 

const getAtmosphere = (h: number): { T: number; P: number } => {
  let T: number;
  let P: number;

  if (h <= 11) {
    T = 288.15 - 6.5 * h;
    P = 101325 * Math.pow(1 - h / 44.308, 5.25588);
  } else {
    T = 216.65;
    if (Math.abs(h - 11.0) >= 0.1) {
      P = 22632 * Math.exp(-0.1577 * (h - 11));
    } else {
      P = 22632.0;
    }
  }
  return { T, P };
};

const calculateInletRecovery = (mach: number): number => {
  if (mach <= 1.0) {
    return 0.97;
  } else {
    const term = 1.0 - 0.075 * Math.pow(mach - 1, 1.35);
    return 0.97 * term;
  }
};

export const solveEngine = (
  inputs: EngineInputs,
  overridePiCH?: number,
  overrideB?: number,
  overrideTt4?: number
): EngineResult => {
  const {
    altitude,
    mach,
    massFlowDesign,
    bypassRatio: baseB,
    fanPressureRatio: pi_cL,
    hpcPressureRatio: basePiCH,
    tt4: baseTt4,
    afterburnerOn,
    ttAb,
    textbookMode,
    eta_cL, eta_cH, eta_tH, eta_tL, eta_m, eta_b,
    sigma_b, sigma_bypass, sigma_m, sigma_e, sigma_ab_dry, sigma_ab_wet,
    beta, delta_1, delta_2
  } = inputs;

  const currentPiCH = overridePiCH !== undefined ? overridePiCH : basePiCH;
  const B = overrideB !== undefined ? overrideB : baseB;
  const tt4 = overrideTt4 !== undefined ? overrideTt4 : baseTt4;
  
  const sigma_ab = afterburnerOn ? sigma_ab_wet : sigma_ab_dry;
  const stations: Record<string, StationResult> = {};

  const { T: T0, P: P0 } = getAtmosphere(altitude);
  const theta = T0 / 288.15;
  const delta = P0 / 101325.0;
  const W_actual = theta > 0 ? (massFlowDesign * delta) / Math.sqrt(theta) : 0;
  const a0 = Math.sqrt(K_A * R * T0);
  const c0 = mach * a0;

  const Pt0 = P0 * Math.pow(1 + ((K_A - 1) / 2) * Math.pow(mach, 2), K_A / (K_A - 1));
  const Tt0 = T0 * (1 + ((K_A - 1) / 2) * Math.pow(mach, 2));
  stations['0'] = { id: '0', Pt: Pt0, Tt: Tt0, P: P0, T: T0 };

  let currentSigmaI = inputs.sigma_i;
  if (!textbookMode) currentSigmaI = calculateInletRecovery(mach);

  const Pt2 = Pt0 * currentSigmaI;
  const Tt2 = Tt0;
  stations['2'] = { id: '2', Pt: Pt2, Tt: Tt2 };

  const Pt22 = Pt2 * pi_cL;
  const Tt22 = Tt2 * (1 + (Math.pow(pi_cL, (K_A - 1) / K_A) - 1) / eta_cL);
  stations['2.5'] = { id: '2.5', Pt: Pt22, Tt: Tt22 };

  const Pt3 = Pt22 * currentPiCH;
  const Tt3 = Tt22 * (1 + (Math.pow(currentPiCH, (K_A - 1) / K_A) - 1) / eta_cH);
  const m_3 = 1.0 - beta - delta_1 - delta_2;
  stations['3'] = { id: '3', Pt: Pt3, Tt: Tt3, m_rel: m_3 };

  const Pt4 = Pt3 * sigma_b;
  let f = 0;
  let finalTt4 = tt4;
  if (CP_G * tt4 > CP_A * Tt3) {
      f = (CP_G * tt4 - CP_A * Tt3) / (eta_b * HU - CP_G * tt4);
      if (f < 0) f = 0;
      finalTt4 = tt4;
  } else {
      f = 0;
      finalTt4 = Tt3; 
  }
  const m_rel_4 = m_3 * (1 + f);
  stations['4'] = { id: '4', Pt: Pt4, Tt: finalTt4, f, m_rel: m_rel_4 };

  const m_4a = m_rel_4 + delta_1;
  const Tt4a = (m_rel_4 * CP_G * finalTt4 + delta_1 * CP_A * Tt3) / (m_4a * CP_G);
  const dT_HPT = (CP_A * (Tt3 - Tt22)) / (m_4a * CP_G * eta_m);
  const Tt45 = Math.max(Tt4a - dT_HPT, Tt0);

  let Pt45 = Pt4;
  try {
    const pr_HPT_inv = 1 - (1 - Tt45 / Tt4a) / eta_tH;
    if (pr_HPT_inv > 0) {
      const pr_HPT = Math.pow(pr_HPT_inv, K_G / (1 - K_G));
      Pt45 = Pt4 / pr_HPT;
    }
  } catch (e) {}
  stations['4.5'] = { id: '4.5', Pt: Pt45, Tt: Tt45, m_rel: m_4a };

  const m_LPT_in = m_4a + delta_2;
  const Tt_LPT_in = (m_4a * CP_G * Tt45 + delta_2 * CP_A * Tt3) / (m_LPT_in * CP_G);
  const W_req_Fan = (1 + B) * (CP_A * (Tt22 - Tt2) + (C_T0 * 1000) / eta_m);
  const Tt5 = Math.max(Tt_LPT_in - W_req_Fan / (m_LPT_in * CP_G * eta_m), Tt0);

  let Pt5 = Pt45;
  try {
    const pr_LPT_inv = 1 - (1 - Tt5 / Tt_LPT_in) / eta_tL;
    if (pr_LPT_inv > 0) {
      const pr_LPT = Math.pow(pr_LPT_inv, K_G / (1 - K_G));
      Pt5 = Pt45 / pr_LPT;
    }
  } catch (e) {}
  stations['5'] = { id: '5', Pt: Pt5, Tt: Tt5, m_rel: m_LPT_in };

  const m_core = m_LPT_in;
  const m_bypass = B;
  const m_total = m_core + m_bypass;
  const Cp_mix = (m_core * CP_G + m_bypass * CP_A) / m_total;
  const k_mix = Cp_mix / (Cp_mix - R);
  const Tt6 = (m_core * CP_G * Tt5 + m_bypass * CP_A * Tt22) / (m_total * Cp_mix);
  const Pt6 = ((m_core * Pt5 + m_bypass * Pt22 * sigma_bypass) / m_total) * sigma_m;
  stations['6'] = { id: '6', Pt: Pt6, Tt: Tt6, Cp: Cp_mix, k: k_mix };

  const Pt7 = Pt6 * sigma_ab;
  const Tt7 = afterburnerOn ? ttAb : Tt6;
  let f_ab = 0;
  if (afterburnerOn) {
    const eta_ab_val = 0.97; 
    f_ab = Math.max((m_total * (CP_G * Tt7 - Cp_mix * Tt6)) / (eta_ab_val * HU), 0);
  }
  const Cp_noz = afterburnerOn ? CP_G : (textbookMode ? CP_G : Cp_mix);
  const k_noz = afterburnerOn ? K_G : (textbookMode ? K_G : k_mix);
  const m_nozzle = m_total + f_ab;
  stations['7'] = { id: '7', Pt: Pt7, Tt: Tt7, m_rel: m_nozzle };

  const Pt9 = Math.max(Pt7 * sigma_e, P0);
  const P9 = P0;
  const expansion = Math.max(Pt9 / P9, 1.0);
  const Ma9 = Math.sqrt((2 / (k_noz - 1)) * (Math.pow(expansion, (k_noz - 1) / k_noz) - 1));
  const T9 = Tt7 / (1 + ((k_noz - 1) / 2) * Math.pow(Ma9, 2));
  const V9 = Ma9 * Math.sqrt(k_noz * R * T9);
  stations['9'] = { id: '9', Pt: Pt9, Tt: Tt7, P: P9, T: T9, V: V9 };

  const m_in = 1.0 + B; 

  const F_total_calc = m_nozzle * V9 - m_in * c0;
  const Fs = F_total_calc / m_in;
  const f_total_mass = f * (1 - beta - delta_1 - delta_2) + f_ab;
  
  const SFC = F_total_calc > 0 ? (f_total_mass * 3600) / F_total_calc : 99.0;
  
  let eta_p = 0;
  if (F_total_calc > 0 && c0 > 0) {
    const thrust_power = F_total_calc * c0;
    const ke_out = 0.5 * m_nozzle * V9 * V9;
    const ke_in = 0.5 * m_in * c0 * c0;
    const added_ke = ke_out - ke_in;
    
    if (added_ke > 0) {
        eta_p = thrust_power / added_ke;
    }
  } else if (F_total_calc > 0 && c0 === 0) {
    eta_p = 0; // Static
  }

  return {
    stations,
    Fs,
    SFC,
    fTotalMass: f_total_mass,
    W_actual,
    F_total: Fs * W_actual,
    V9,
    pi_total: pi_cL * currentPiCH,
    eta_p
  };
};
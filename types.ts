export interface EngineInputs {
  textbookMode: boolean;
  refFsWet: number;
  refSfcWet: number;
  refFsDry: number;
  refSfcDry: number;
  altitude: number; // km
  mach: number;
  massFlowDesign: number; // kg/s
  bypassRatio: number;
  fanPressureRatio: number;
  hpcPressureRatio: number;
  tt4: number; // K
  afterburnerOn: boolean;
  ttAb: number; // K
  
  // Advanced / Textbook Parameters
  eta_cL: number; // Fan Polytropic
  eta_cH: number; // HPC Polytropic
  eta_tH: number; // HPT Polytropic
  eta_tL: number; // LPT Polytropic
  eta_m: number;  // Mechanical
  eta_b: number;  // Burner

  sigma_i: number; // Inlet (Design/Textbook)
  sigma_b: number; // Burner
  sigma_bypass: number; // Bypass Duct
  sigma_m: number; // Mixer
  sigma_e: number; // Nozzle
  sigma_ab_dry: number; // AB Off
  sigma_ab_wet: number; // AB On

  beta: number;    // Bleed
  delta_1: number; // HPT Cooling
  delta_2: number; // LPT Cooling
}

export interface StationResult {
  id: string;
  Pt: number; // Pa
  Tt: number; // K
  P?: number;
  T?: number;
  V?: number;
  f?: number;
  m_rel?: number;
  Cp?: number;
  k?: number;
}

export interface EngineResult {
  stations: Record<string, StationResult>;
  Fs: number; // N/kg/s
  SFC: number; // kg/N/h
  fTotalMass: number;
  W_actual: number; // kg/s
  F_total: number; // N
  V9: number; // m/s
  pi_total: number;
  eta_p: number; // Propulsion Efficiency
}

export enum TabOption {
  PARAM = 'param',
  OPT = 'opt',
  ENV = 'env'
}
export interface EnergyBreakdown {
  electric: number            // BEV 100% électrique
  hybrid_rechargeable: number // PHEV hybride rechargeable
  hybrid: number              // HEV hybride non rechargeable
  diesel: number
  gasoline: number            // essence
  gas: number                 // GNV / GNL
  total: number
}

export type VehicleType = 'all' | 'vp' | 'vul' | 'pl'
export type VehicleTypeStrict = 'vp' | 'vul' | 'pl'

export interface MonthlyRegistration {
  month: string // "2024-01"
  vp: EnergyBreakdown
  vul: EnergyBreakdown
  pl: EnergyBreakdown
}

export interface AnnualRegistration {
  year: number
  vp: EnergyBreakdown & { ev_share: number }
  vul: EnergyBreakdown & { ev_share: number }
  pl: EnergyBreakdown & { ev_share: number }
}

export interface ChargingPointHistory {
  month: string // "2024-01"
  public: number
  private: number
  total: number
}

export interface ChargingByPower {
  range: string
  count: number
  percent: number
}

export interface ChargingByOperator {
  operator: string
  count: number
  percent: number
}

export interface GeoRegistrations {
  region: string
  code: string
  count: number
  per_1000_inhabitants: number
}

export interface GeoCharging {
  region: string
  code: string
  count: number
  per_1000_inhabitants: number
}

export interface Metadata {
  last_update: string
  sources: string[]
  period_registrations: { start: string; end: string }
  period_charging: { start: string; end: string }
}

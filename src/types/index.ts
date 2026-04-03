export interface MonthlyRegistration {
  month: string // "2024-01"
  vp: number
  vul: number
  pl: number
  total: number
}

export interface AnnualMarketShare {
  year: number
  electric: number
  hybrid: number
  thermal: number
  total: number
  ev_share: number // percent
}

export interface ChargingPointHistory {
  month: string // "2024-01"
  public: number
  private: number
  total: number
}

export interface ChargingByPower {
  range: string // "≤22 kW"
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

export interface DashboardData {
  registrations_monthly: MonthlyRegistration[]
  registrations_annual: AnnualMarketShare[]
  charging_history: ChargingPointHistory[]
  charging_by_power: ChargingByPower[]
  charging_by_operator: ChargingByOperator[]
  geo_registrations: GeoRegistrations[]
  geo_charging: GeoCharging[]
  metadata: Metadata
}

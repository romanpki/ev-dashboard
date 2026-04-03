import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../hooks/useData'
import type { MonthlyRegistration, AnnualRegistration, VehicleType, VehicleTypeStrict } from '../types'
import FilterBar from '../components/FilterBar'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import RegistrationsLineChart from '../charts/RegistrationsLineChart'
import MarketShareBarChart from '../charts/MarketShareBarChart'
import EnergyBreakdownPieChart from '../charts/EnergyBreakdownPieChart'

type Period = 'all' | '5y' | '3y' | '1y'

const VP_LABELS: Record<VehicleType, string> = {
  all: 'Tous véhicules',
  vp: 'Véhicules particuliers',
  vul: 'Utilitaires légers',
  pl: 'Poids lourds',
}

// For charts that don't support 'all', default to 'vp'
function strictType(vt: VehicleType): VehicleTypeStrict {
  return vt === 'all' ? 'vp' : vt
}

export default function Registrations() {
  const { t } = useTranslation()
  const [vehicleType, setVehicleType] = useState<VehicleType>('vp')
  const [period, setPeriod] = useState<Period>('all')

  const { data: monthly, loading: l1 } = useData<MonthlyRegistration[]>('registrations_monthly.json')
  const { data: annual, loading: l2 } = useData<AnnualRegistration[]>('registrations_annual.json')

  if (l1 || l2) return <LoadingSpinner />

  const filteredMonthly = (() => {
    if (!monthly) return []
    if (period === '1y') return monthly.slice(-12)
    if (period === '3y') return monthly.slice(-36)
    if (period === '5y') return monthly.slice(-60)
    return monthly
  })()

  // Dynamic header stat for selected vehicle type
  const vt = strictType(vehicleType)
  const lastYear = annual?.[annual.length - 1]
  const prevYear = annual?.[annual.length - 2]
  const growth = lastYear && prevYear
    ? ((lastYear[vt].electric - prevYear[vt].electric) / prevYear[vt].electric * 100).toFixed(1)
    : null
  const evShare = lastYear ? lastYear[vt].ev_share : null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--ws-charcoal)' }}>
          {t('registrations.title')}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ws-gray-600)' }}>
          {t('registrations.subtitle')}
        </p>
        {growth && evShare !== null && (
          <p className="mt-2 text-sm font-medium" style={{ color: 'var(--ws-success)' }}>
            ↑ {growth}% de ventes VE en {lastYear?.year} vs {prevYear?.year}
            {' · '}Part de marché VE {VP_LABELS[vehicleType].toLowerCase()} : {evShare}%
          </p>
        )}
      </div>

      <FilterBar
        filters={[
          {
            label: t('registrations.filters.vehicleType'),
            value: vehicleType,
            onChange: (v) => setVehicleType(v as VehicleType),
            options: [
              { value: 'vp',  label: 'VP' },
              { value: 'vul', label: 'VUL' },
              { value: 'pl',  label: 'PL' },
              { value: 'all', label: t('registrations.filters.all') },
            ],
          },
          {
            label: t('registrations.filters.period'),
            value: period,
            onChange: (v) => setPeriod(v as Period),
            options: [
              { value: 'all', label: '2015–2024' },
              { value: '5y',  label: '5 ans' },
              { value: '3y',  label: '3 ans' },
              { value: '1y',  label: '12 mois' },
            ],
          },
        ]}
      />

      <div className="flex flex-col gap-6">
        {/* Line chart — all energies, filtered by vehicle type + period */}
        <ChartCard
          title={`Immatriculations mensuelles par énergie — ${VP_LABELS[vehicleType]}`}
          description="Cliquez sur une énergie dans la légende pour l'afficher / masquer"
          source="SDES"
        >
          {filteredMonthly.length > 0 && (
            <RegistrationsLineChart data={filteredMonthly} vehicleType={vehicleType} height={440} />
          )}
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market share stacked bar — filtered by vehicle type */}
          <ChartCard
            title={`Parts de marché annuelles — ${VP_LABELS[vt]}`}
            description={t('registrations.charts.marketShare_desc')}
            source="SDES"
          >
            {annual && <MarketShareBarChart data={annual} vehicleType={vt} height={360} />}
          </ChartCard>

          {/* Energy breakdown pie — filtered by vehicle type */}
          <ChartCard
            title={`Répartition par énergie — ${VP_LABELS[vt]}`}
            description="Cumul 2015–2024"
            source="SDES"
          >
            {monthly && <EnergyBreakdownPieChart data={monthly} vehicleType={vt} height={360} />}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

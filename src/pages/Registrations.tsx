import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../hooks/useData'
import type { MonthlyRegistration, AnnualMarketShare } from '../types'
import FilterBar from '../components/FilterBar'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import RegistrationsLineChart from '../charts/RegistrationsLineChart'
import MarketShareBarChart from '../charts/MarketShareBarChart'
import VehicleTypePieChart from '../charts/VehicleTypePieChart'

type VehicleType = 'all' | 'vp' | 'vul' | 'pl'
type Period = 'all' | '3y' | '2y' | '1y'

export default function Registrations() {
  const { t } = useTranslation()
  const [vehicleType, setVehicleType] = useState<VehicleType>('all')
  const [period, setPeriod] = useState<Period>('all')

  const { data: monthly, loading: l1 } = useData<MonthlyRegistration[]>('registrations_monthly.json')
  const { data: annual, loading: l2 } = useData<AnnualMarketShare[]>('registrations_annual.json')

  if (l1 || l2) return <LoadingSpinner />

  const filteredMonthly = (() => {
    if (!monthly) return []
    if (period === '1y') return monthly.slice(-12)
    if (period === '2y') return monthly.slice(-24)
    if (period === '3y') return monthly.slice(-36)
    return monthly
  })()

  // Stats summary
  const lastYear = annual?.[annual.length - 1]
  const prevYear = annual?.[annual.length - 2]
  const growth = lastYear && prevYear
    ? ((lastYear.electric - prevYear.electric) / prevYear.electric * 100).toFixed(1)
    : null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ws-charcoal)' }}>
          {t('registrations.title')}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ws-gray-600)' }}>
          {t('registrations.subtitle')}
        </p>
        {growth && (
          <p className="mt-2 text-sm font-medium" style={{ color: 'var(--ws-success)' }}>
            ↑ {growth}% de ventes VE en {lastYear?.year} vs {prevYear?.year} (VP)
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
              { value: 'all', label: t('registrations.filters.all') },
              { value: 'vp', label: 'VP' },
              { value: 'vul', label: 'VUL' },
              { value: 'pl', label: 'PL' },
            ],
          },
          {
            label: t('registrations.filters.period'),
            value: period,
            onChange: (v) => setPeriod(v as Period),
            options: [
              { value: 'all', label: '2020–2024' },
              { value: '3y', label: '3 ans' },
              { value: '2y', label: '2 ans' },
              { value: '1y', label: '12 mois' },
            ],
          },
        ]}
      />

      <div className="flex flex-col gap-6">
        <ChartCard
          title={t('registrations.charts.monthly')}
          description={t('registrations.charts.monthly_desc')}
          source="SDES"
        >
          {filteredMonthly.length > 0 && (
            <RegistrationsLineChart data={filteredMonthly} vehicleType={vehicleType} />
          )}
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title={t('registrations.charts.marketShare')}
            description={t('registrations.charts.marketShare_desc')}
            source="SDES"
          >
            {annual && <MarketShareBarChart data={annual} />}
          </ChartCard>

          <ChartCard
            title={t('registrations.charts.byType')}
            description="Cumul 2020–2024"
            source="SDES"
          >
            {monthly && <VehicleTypePieChart data={monthly} />}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

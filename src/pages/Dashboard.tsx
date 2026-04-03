import { useTranslation } from 'react-i18next'
import { useData } from '../hooks/useData'
import type { MonthlyRegistration, ChargingPointHistory, ChargingByPower } from '../types'
import KPICard from '../components/KPICard'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import RegistrationsLineChart from '../charts/RegistrationsLineChart'
import ChargingByPowerChart from '../charts/ChargingByPowerChart'

export default function Dashboard() {
  const { t } = useTranslation()
  const { data: regData, loading: regLoading } = useData<MonthlyRegistration[]>('registrations_monthly.json')
  const { data: chargingData, loading: chargingLoading } = useData<ChargingPointHistory[]>('charging_points_history.json')
  const { data: powerData, loading: powerLoading } = useData<ChargingByPower[]>('charging_by_power.json')

  if (regLoading || chargingLoading || powerLoading) return <LoadingSpinner />

  // KPI calculations
  const totalVE = regData ? regData.reduce((s, d) => s + d.vp + d.vul + d.pl, 0) : 0
  const lastMonth = regData ? regData[regData.length - 1] : null
  const prevYearMonth = regData ? regData[regData.length - 13] : null
  const yoyGrowth = lastMonth && prevYearMonth
    ? ((lastMonth.total - prevYearMonth.total) / prevYearMonth.total) * 100
    : 0

  const latestCharging = chargingData ? chargingData[chargingData.length - 1] : null
  const prevYearCharging = chargingData ? chargingData[chargingData.length - 13] : null
  const chargingGrowth = latestCharging && prevYearCharging
    ? ((latestCharging.public - prevYearCharging.public) / prevYearCharging.public) * 100
    : 0

  // Market share — approximate 2024 from annual: ~20.9%
  const marketShare = 20.9

  const last12 = regData ? regData.slice(-12) : []

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--ws-charcoal)' }}>
          {t('dashboard.title')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ws-gray-600)' }}>
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title={t('dashboard.kpi.totalVE')}
          value={totalVE.toLocaleString('fr-FR')}
          description={t('dashboard.kpi.totalVE_desc')}
          icon="🚗"
          highlighted
        />
        <KPICard
          title={t('dashboard.kpi.marketShare')}
          value={`${marketShare}%`}
          description={t('dashboard.kpi.marketShare_desc')}
          trend={3.1}
          icon="📊"
        />
        <KPICard
          title={t('dashboard.kpi.chargingPoints')}
          value={latestCharging ? latestCharging.public.toLocaleString('fr-FR') : '—'}
          description={t('dashboard.kpi.chargingPoints_desc')}
          trend={chargingGrowth}
          icon="⚡"
        />
        <KPICard
          title={t('dashboard.kpi.yoyGrowth')}
          value={`+${yoyGrowth.toFixed(1)}%`}
          description={t('dashboard.kpi.yoyGrowth_desc')}
          trend={yoyGrowth}
          icon="📈"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title={t('dashboard.recentTrend')}
            source="SDES"
          >
            {last12.length > 0 && (
              <RegistrationsLineChart data={last12} vehicleType="all" />
            )}
          </ChartCard>
        </div>
        <div>
          <ChartCard
            title={t('dashboard.chargingByPower')}
            source="IRVE — data.gouv.fr"
          >
            {powerData && <ChargingByPowerChart data={powerData} mini />}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

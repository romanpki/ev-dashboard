import { useTranslation } from 'react-i18next'
import { useData } from '../hooks/useData'
import type { MonthlyRegistration, ChargingPointHistory, ChargingByPower } from '../types'
import KPICard from '../components/KPICard'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { IconCar, IconChart, IconBolt, IconTrend } from '../components/Icons'
import RegistrationsLineChart from '../charts/RegistrationsLineChart'
import ChargingByPowerChart from '../charts/ChargingByPowerChart'

export default function Dashboard() {
  const { t } = useTranslation()
  const { data: regData, loading: l1 } = useData<MonthlyRegistration[]>('registrations_monthly.json')
  const { data: chargingData, loading: l2 } = useData<ChargingPointHistory[]>('charging_points_history.json')
  const { data: powerData, loading: l3 } = useData<ChargingByPower[]>('charging_by_power.json')

  if (l1 || l2 || l3) return <LoadingSpinner />

  const totalVE = regData ? regData.reduce((s, d) => s + d.vp + d.vul + d.pl, 0) : 0
  const lastMonth = regData?.[regData.length - 1]
  const prevYearMonth = regData?.[regData.length - 13]
  const yoyGrowth = lastMonth && prevYearMonth
    ? ((lastMonth.total - prevYearMonth.total) / prevYearMonth.total) * 100 : 0

  const latestCharging = chargingData?.[chargingData.length - 1]
  const prevYearCharging = chargingData?.[chargingData.length - 13]
  const chargingGrowth = latestCharging && prevYearCharging
    ? ((latestCharging.public - prevYearCharging.public) / prevYearCharging.public) * 100 : 0

  const last12 = regData ? regData.slice(-12) : []

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ws-charcoal)' }}>
          {t('dashboard.title')}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ws-gray-600)' }}>
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title={t('dashboard.kpi.totalVE')}
          value={totalVE.toLocaleString('fr-FR')}
          description={t('dashboard.kpi.totalVE_desc')}
          icon={<IconCar size={20} />}
          highlighted
        />
        <KPICard
          title={t('dashboard.kpi.marketShare')}
          value="20,9 %"
          description={t('dashboard.kpi.marketShare_desc')}
          trend={3.1}
          icon={<IconChart size={20} />}
        />
        <KPICard
          title={t('dashboard.kpi.chargingPoints')}
          value={latestCharging ? latestCharging.public.toLocaleString('fr-FR') : '—'}
          description={t('dashboard.kpi.chargingPoints_desc')}
          trend={chargingGrowth}
          icon={<IconBolt size={20} />}
        />
        <KPICard
          title={t('dashboard.kpi.yoyGrowth')}
          value={`+${yoyGrowth.toFixed(1)} %`}
          description={t('dashboard.kpi.yoyGrowth_desc')}
          trend={yoyGrowth}
          icon={<IconTrend size={20} />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title={t('dashboard.recentTrend')} source="SDES">
            {last12.length > 0 && (
              <RegistrationsLineChart data={last12} vehicleType="all" />
            )}
          </ChartCard>
        </div>
        <div>
          <ChartCard title={t('dashboard.chargingByPower')} source="IRVE — data.gouv.fr">
            {powerData && <ChargingByPowerChart data={powerData} mini />}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

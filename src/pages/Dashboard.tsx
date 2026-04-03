import { useTranslation } from 'react-i18next'
import { useData } from '../hooks/useData'
import type { MonthlyRegistration, ChargingPointHistory, ChargingByPower, AnnualRegistration } from '../types'
import KPICard from '../components/KPICard'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { IconCar, IconChart, IconBolt, IconTrend } from '../components/Icons'
import RegistrationsLineChart from '../charts/RegistrationsLineChart'
import ChargingByPowerChart from '../charts/ChargingByPowerChart'
import MarketShareBarChart from '../charts/MarketShareBarChart'

export default function Dashboard() {
  const { t } = useTranslation()
  const { data: monthly, loading: l1 } = useData<MonthlyRegistration[]>('registrations_monthly.json')
  const { data: annual, loading: l2 } = useData<AnnualRegistration[]>('registrations_annual.json')
  const { data: chargingData, loading: l3 } = useData<ChargingPointHistory[]>('charging_points_history.json')
  const { data: powerData, loading: l4 } = useData<ChargingByPower[]>('charging_by_power.json')

  if (l1 || l2 || l3 || l4) return <LoadingSpinner />

  // Total VE immatriculés (VP+VUL+PL électriques, cumul 2015–2024)
  const totalVE = monthly
    ? monthly.reduce((s, d) => s + d.vp.electric + d.vul.electric + d.pl.electric, 0)
    : 0

  // YoY growth VP électrique
  const lastYear = annual?.[annual.length - 1]
  const prevYear = annual?.[annual.length - 2]
  const yoyGrowth = lastYear && prevYear
    ? ((lastYear.vp.electric - prevYear.vp.electric) / prevYear.vp.electric) * 100
    : 0

  const latestCharging = chargingData?.[chargingData.length - 1]
  const prevYearCharging = chargingData?.[chargingData.length - 13]
  const chargingGrowth = latestCharging && prevYearCharging
    ? ((latestCharging.public - prevYearCharging.public) / prevYearCharging.public) * 100
    : 0

  const evShare = lastYear?.vp.ev_share ?? 0
  const last12 = monthly ? monthly.slice(-12) : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--ws-charcoal)' }}>
          {t('dashboard.title')}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ws-gray-600)' }}>
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-10">
        <KPICard
          title={t('dashboard.kpi.totalVE')}
          value={totalVE.toLocaleString('fr-FR')}
          description={t('dashboard.kpi.totalVE_desc')}
          icon={<IconCar size={22} />}
          highlighted
        />
        <KPICard
          title={t('dashboard.kpi.marketShare')}
          value={`${evShare} %`}
          description={t('dashboard.kpi.marketShare_desc')}
          trend={evShare - (prevYear?.vp.ev_share ?? 0)}
          icon={<IconChart size={22} />}
        />
        <KPICard
          title={t('dashboard.kpi.chargingPoints')}
          value={latestCharging ? latestCharging.public.toLocaleString('fr-FR') : '—'}
          description={t('dashboard.kpi.chargingPoints_desc')}
          trend={chargingGrowth}
          icon={<IconBolt size={22} />}
        />
        <KPICard
          title={t('dashboard.kpi.yoyGrowth')}
          value={`+${yoyGrowth.toFixed(1)} %`}
          description={t('dashboard.kpi.yoyGrowth_desc')}
          trend={yoyGrowth}
          icon={<IconTrend size={22} />}
        />
      </div>

      <ChartCard title={t('dashboard.recentTrend')} source="SDES" className="w-full mb-6">
        {last12.length > 0 && (
          <RegistrationsLineChart data={last12} vehicleType="vp" height={420} />
        )}
      </ChartCard>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title={t('dashboard.chargingByPower')} source="IRVE — data.gouv.fr">
          {powerData && <ChargingByPowerChart data={powerData} height={360} />}
        </ChartCard>
        <ChartCard title="Parts de marché VP — 2015–2024" source="SDES">
          {annual && <MarketShareBarChart data={annual} vehicleType="vp" height={360} />}
        </ChartCard>
      </div>
    </div>
  )
}

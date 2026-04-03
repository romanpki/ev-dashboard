import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../hooks/useData'
import type { ChargingPointHistory, ChargingByPower, ChargingByOperator } from '../types'
import FilterBar from '../components/FilterBar'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ChargingPointsLineChart from '../charts/ChargingPointsLineChart'
import ChargingByPowerChart from '../charts/ChargingByPowerChart'
import ChargingByOperatorChart from '../charts/ChargingByOperatorChart'

type Access = 'all' | 'public' | 'private'

export default function Charging() {
  const { t } = useTranslation()
  const [access, setAccess] = useState<Access>('all')

  const { data: history, loading: l1 } = useData<ChargingPointHistory[]>('charging_points_history.json')
  const { data: byPower, loading: l2 } = useData<ChargingByPower[]>('charging_by_power.json')
  const { data: byOperator, loading: l3 } = useData<ChargingByOperator[]>('charging_by_operator.json')

  if (l1 || l2 || l3) return <LoadingSpinner />

  const latest = history?.[history.length - 1]
  const oldest = history?.[0]
  const growthTotal = latest && oldest
    ? ((latest.public - oldest.public) / oldest.public * 100).toFixed(0)
    : null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--ws-charcoal)' }}>
          {t('charging.title')}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ws-gray-600)' }}>
          {t('charging.subtitle')}
        </p>
        {growthTotal && latest && (
          <p className="mt-2 text-sm font-medium" style={{ color: 'var(--ws-success)' }}>
            ↑ {growthTotal}% de PDC publics depuis {oldest?.month.slice(0, 4)} —{' '}
            {latest.public.toLocaleString('fr-FR')} points fin {latest.month.slice(0, 4)}
          </p>
        )}
      </div>

      <FilterBar
        filters={[
          {
            label: t('charging.filters.access'),
            value: access,
            onChange: (v) => setAccess(v as Access),
            options: [
              { value: 'all', label: t('charging.filters.all') },
              { value: 'public', label: t('charging.filters.public') },
              { value: 'private', label: t('charging.filters.private') },
            ],
          },
        ]}
      />

      <div className="flex flex-col gap-6">
        <ChartCard
          title={t('charging.charts.history')}
          description={t('charging.charts.history_desc')}
          source="AVERE-France / IRVE data.gouv.fr"
        >
          {history && <ChargingPointsLineChart data={history} access={access} height={440} />}
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title={t('charging.charts.byPower')}
            description={t('charging.charts.byPower_desc')}
            source="IRVE — data.gouv.fr"
          >
            {byPower && <ChargingByPowerChart data={byPower} height={360} />}
          </ChartCard>

          <ChartCard
            title={t('charging.charts.topOperators')}
            description={t('charging.charts.topOperators_desc')}
            source="IRVE — data.gouv.fr"
          >
            {byOperator && <ChargingByOperatorChart data={byOperator} height={360} />}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

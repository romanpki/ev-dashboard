import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../hooks/useData'
import type { GeoRegistrations, GeoCharging } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

type Metric = 'registrations' | 'charging'

function getColor(value: number, min: number, max: number): string {
  const ratio = max === min ? 0.5 : (value - min) / (max - min)
  const stops = [
    [235, 230, 255],
    [194, 165, 255],
    [107, 76, 230],
    [69, 29, 199],
    [37, 16, 107],
  ]
  const idx = Math.min(Math.floor(ratio * (stops.length - 1)), stops.length - 2)
  const t = ratio * (stops.length - 1) - idx
  const c1 = stops[idx], c2 = stops[idx + 1]
  return `rgb(${Math.round(c1[0] + (c2[0] - c1[0]) * t)},${Math.round(c1[1] + (c2[1] - c1[1]) * t)},${Math.round(c1[2] + (c2[2] - c1[2]) * t)})`
}

export default function Map() {
  const { t } = useTranslation()
  const [metric, setMetric] = useState<Metric>('registrations')

  const { data: regData, loading: l1 } = useData<GeoRegistrations[]>('geo_registrations.json')
  const { data: chargingData, loading: l2 } = useData<GeoCharging[]>('geo_charging.json')

  if (l1 || l2) return <LoadingSpinner />

  const data = metric === 'registrations' ? regData : chargingData
  const values = data?.map((d) => d.count) ?? []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const total = values.reduce((a, b) => a + b, 0)

  const sorted = data ? [...data].sort((a, b) => b.count - a.count) : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ws-charcoal)' }}>
          {t('map.title')}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ws-gray-600)' }}>
          {t('map.subtitle')}
        </p>
      </div>

      {/* Toggle */}
      <div
        className="rounded-xl bg-white flex items-center gap-1 px-2 py-2 w-fit mb-6"
        style={{ border: '1px solid var(--ws-gray-200)' }}
      >
        {(['registrations', 'charging'] as Metric[]).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
            style={{
              background: metric === m ? 'var(--ws-primary)' : 'transparent',
              color: metric === m ? '#fff' : 'var(--ws-gray-600)',
              border: 'none',
            }}
          >
            {t(`map.toggle.${m}`)}
          </button>
        ))}
      </div>

      <div
        className="rounded-xl bg-white p-6"
        style={{ border: '1px solid var(--ws-gray-200)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium" style={{ color: 'var(--ws-charcoal)' }}>
            {metric === 'registrations'
              ? 'Immatriculations VE cumulées 2020–2024 par région'
              : 'Points de recharge publics par région (fin 2024)'}
          </p>
          <p className="text-xs" style={{ color: 'var(--ws-gray-400)' }}>
            Total : <span className="font-semibold" style={{ color: 'var(--ws-charcoal)' }}>{total.toLocaleString('fr-FR')}</span>
          </p>
        </div>

        {/* Gradient legend */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs" style={{ color: 'var(--ws-gray-400)' }}>Moins</span>
          <div
            className="h-2 rounded-full flex-1 max-w-64"
            style={{ background: 'linear-gradient(to right, #EBE6FF, #C2A5FF, #6B4CE6, #451DC7, #25106B)' }}
          />
          <span className="text-xs" style={{ color: 'var(--ws-gray-400)' }}>Plus</span>
        </div>

        {/* Region bars */}
        <div className="space-y-2.5">
          {sorted.map((region) => {
            const pct = ((region.count / total) * 100).toFixed(1)
            const barPct = Math.max(2, (region.count / max) * 100)
            const color = getColor(region.count, min, max)
            return (
              <div key={region.code} className="flex items-center gap-4 group">
                <div className="text-sm text-right shrink-0" style={{ width: 200, color: 'var(--ws-charcoal)' }}>
                  {region.region}
                </div>
                <div
                  className="flex-1 h-8 rounded-lg overflow-hidden relative"
                  style={{ background: 'var(--ws-gray-100)' }}
                >
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-700"
                    style={{ width: `${barPct}%`, background: color, minWidth: 8 }}
                  >
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      {region.count.toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-right shrink-0" style={{ width: 110, color: 'var(--ws-gray-400)' }}>
                  {pct}% · {region.per_1000_inhabitants}/1k hab.
                </div>
              </div>
            )
          })}
        </div>

        <div
          className="mt-6 pt-4 text-xs"
          style={{ borderTop: '1px solid var(--ws-gray-200)', color: 'var(--ws-gray-400)' }}
        >
          Source : {metric === 'registrations' ? 'SDES' : 'IRVE — data.gouv.fr'}
          {' · '}
          Carte choroplèthe interactive à venir (Phase 2)
        </div>
      </div>
    </div>
  )
}

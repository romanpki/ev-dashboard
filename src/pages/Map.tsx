import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../hooks/useData'
import type { GeoRegistrations, GeoCharging } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

type Metric = 'registrations' | 'charging'

// Color scale from light to dark purple
function getColor(value: number, min: number, max: number): string {
  const ratio = max === min ? 0.5 : (value - min) / (max - min)
  const colors = [
    [242, 240, 255], // very light purple
    [194, 165, 255], // ws-light
    [107, 76, 230],  // mid purple
    [69, 29, 199],   // ws-primary
    [37, 16, 107],   // ws-dark
  ]
  const idx = Math.min(Math.floor(ratio * (colors.length - 1)), colors.length - 2)
  const t = ratio * (colors.length - 1) - idx
  const c1 = colors[idx]
  const c2 = colors[idx + 1]
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t)
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t)
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t)
  return `rgb(${r},${g},${b})`
}

export default function Map() {
  const { t } = useTranslation()
  const [metric, setMetric] = useState<Metric>('registrations')

  const { data: regData, loading: l1 } = useData<GeoRegistrations[]>('geo_registrations.json')
  const { data: chargingData, loading: l2 } = useData<GeoCharging[]>('geo_charging.json')

  if (l1 || l2) return <LoadingSpinner />

  const data = metric === 'registrations' ? regData : chargingData
  const values = data ? data.map((d) => d.count) : []
  const min = Math.min(...values)
  const max = Math.max(...values)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--ws-charcoal)' }}>
          {t('map.title')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ws-gray-600)' }}>
          {t('map.subtitle')}
        </p>
      </div>

      {/* Toggle */}
      <div className="ws-card px-4 py-3 flex items-center gap-3 mb-6 w-fit">
        <button
          onClick={() => setMetric('registrations')}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: metric === 'registrations' ? 'var(--ws-primary)' : 'var(--ws-gray-100)',
            color: metric === 'registrations' ? 'white' : 'var(--ws-charcoal)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {t('map.toggle.registrations')}
        </button>
        <button
          onClick={() => setMetric('charging')}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: metric === 'charging' ? 'var(--ws-primary)' : 'var(--ws-gray-100)',
            color: metric === 'charging' ? 'white' : 'var(--ws-charcoal)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {t('map.toggle.charging')}
        </button>
      </div>

      {/* Data table with color bands (map placeholder) */}
      <div className="ws-card p-6">
        <div className="mb-4 text-sm font-medium" style={{ color: 'var(--ws-gray-600)' }}>
          {metric === 'registrations'
            ? 'Immatriculations VE cumulées 2020–2024 par région'
            : 'Points de recharge publics par région (fin 2024)'}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs" style={{ color: 'var(--ws-gray-400)' }}>Moins</span>
          <div
            className="h-3 rounded flex-1 max-w-48"
            style={{
              background: 'linear-gradient(to right, #F2F0FF, #C2A5FF, #6B4CE6, #451DC7, #25106B)',
            }}
          />
          <span className="text-xs" style={{ color: 'var(--ws-gray-400)' }}>Plus</span>
        </div>

        {/* Region bars */}
        <div className="space-y-2">
          {data &&
            [...data]
              .sort((a, b) => b.count - a.count)
              .map((region) => {
                const barWidth = `${Math.max(4, (region.count / max) * 100)}%`
                const color = getColor(region.count, min, max)
                return (
                  <div key={region.code} className="flex items-center gap-3">
                    <div
                      className="text-sm font-medium text-right"
                      style={{ minWidth: 200, color: 'var(--ws-charcoal)' }}
                    >
                      {region.region}
                    </div>
                    <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: 'var(--ws-gray-100)' }}>
                      <div
                        className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
                        style={{ width: barWidth, background: color, minWidth: 4 }}
                      >
                        <span className="text-xs font-semibold text-white whitespace-nowrap">
                          {region.count.toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div
                      className="text-xs text-right"
                      style={{ minWidth: 90, color: 'var(--ws-gray-400)' }}
                    >
                      {region.per_1000_inhabitants}/1 000 hab.
                    </div>
                  </div>
                )
              })}
        </div>

        <div className="mt-6 pt-4 text-xs" style={{ borderTop: '1px solid var(--ws-gray-200)', color: 'var(--ws-gray-400)' }}>
          Source : {metric === 'registrations' ? 'SDES' : 'IRVE — data.gouv.fr'}
          {' · '}
          Note : carte choroplèthe interactive disponible dans une prochaine version
        </div>
      </div>
    </div>
  )
}

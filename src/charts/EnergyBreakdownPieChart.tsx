import ReactECharts from 'echarts-for-react'
import type { MonthlyRegistration, VehicleTypeStrict } from '../types'

interface Props {
  data: MonthlyRegistration[]
  vehicleType: VehicleTypeStrict
}

const ENERGIES = [
  { key: 'electric',            label: 'Électrique (BEV)',        color: '#451DC7' },
  { key: 'hybrid_rechargeable', label: 'Hybride rechargeable',    color: '#7C5CFC' },
  { key: 'hybrid',              label: 'Hybride non rechargeable', color: '#C2A5FF' },
  { key: 'gasoline',            label: 'Essence',                 color: '#9CA3AF' },
  { key: 'diesel',              label: 'Diesel',                  color: '#374151' },
  { key: 'gas',                 label: 'GNV / GNL',               color: '#D1D5DB' },
] as const

type EnergyKey = typeof ENERGIES[number]['key']

export default function EnergyBreakdownPieChart({ data, vehicleType }: Props) {
  const totals = data.reduce(
    (acc, d) => {
      const vt = d[vehicleType]
      ENERGIES.forEach(e => { acc[e.key] += vt[e.key as EnergyKey] })
      acc.total += vt.total
      return acc
    },
    { electric: 0, hybrid_rechargeable: 0, hybrid: 0, gasoline: 0, diesel: 0, gas: 0, total: 0 }
  )

  const items = ENERGIES.map(e => ({
    name: e.label,
    value: totals[e.key as EnergyKey],
    itemStyle: { color: e.color },
  })).filter(i => i.value > 0)

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 12 },
      formatter: (p: { name: string; value: number; percent: number }) =>
        `<b>${p.name}</b><br/>${p.value.toLocaleString('fr-FR')} (${p.percent.toFixed(1)}%)`,
    },
    legend: {
      orient: 'vertical' as const,
      right: 0,
      top: 'middle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#6B7280', fontSize: 11 },
      formatter: (name: string) => {
        const item = items.find(i => i.name === name)
        if (!item) return name
        const pct = ((item.value / totals.total) * 100).toFixed(1)
        return `${name}  ${pct}%`
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '66%'],
        center: ['36%', '50%'],
        data: items,
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(69,29,199,0.2)' },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 280 }} />
}

import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import type { MonthlyRegistration } from '../types'

interface Props {
  data: MonthlyRegistration[]
}

const COLORS = ['#451DC7', '#C2A5FF', '#25106B']

export default function VehicleTypePieChart({ data }: Props) {
  const { t } = useTranslation()

  const totals = data.reduce(
    (acc, d) => ({ vp: acc.vp + d.vp, vul: acc.vul + d.vul, pl: acc.pl + d.pl }),
    { vp: 0, vul: 0, pl: 0 }
  )
  const grand = totals.vp + totals.vul + totals.pl

  const items = [
    { name: t('registrations.filters.vp'), value: totals.vp },
    { name: t('registrations.filters.vul'), value: totals.vul },
    { name: t('registrations.filters.pl'), value: totals.pl },
  ]

  const option = {
    color: COLORS,
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 13 },
      formatter: (p: { name: string; value: number }) => {
        const pct = ((p.value / grand) * 100).toFixed(1)
        return `<b>${p.name}</b><br/>${p.value.toLocaleString('fr-FR')} (${pct}%)`
      },
    },
    legend: {
      orient: 'vertical' as const,
      right: 0,
      top: 'middle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#6B7280', fontSize: 12 },
      formatter: (name: string) => {
        const item = items.find((i) => i.name === name)
        if (!item) return name
        const pct = ((item.value / grand) * 100).toFixed(1)
        return `${name}  ${pct}%`
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['38%', '50%'],
        data: items.map((item, i) => ({
          ...item,
          itemStyle: { color: COLORS[i] },
        })),
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(69,29,199,0.25)' },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 280 }} />
}

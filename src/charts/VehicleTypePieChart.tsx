import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import type { MonthlyRegistration } from '../types'

interface Props {
  data: MonthlyRegistration[]
}

export default function VehicleTypePieChart({ data }: Props) {
  const { t } = useTranslation()

  const totals = data.reduce(
    (acc, d) => ({ vp: acc.vp + d.vp, vul: acc.vul + d.vul, pl: acc.pl + d.pl }),
    { vp: 0, vul: 0, pl: 0 }
  )

  const option = {
    color: ['#451DC7', '#C2A5FF', '#25106B'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: { color: '#6B7280', fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: [
          { name: t('registrations.filters.vp'), value: totals.vp },
          { name: t('registrations.filters.vul'), value: totals.vul },
          { name: t('registrations.filters.pl'), value: totals.pl },
        ],
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(69,29,199,0.3)' },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 260 }} />
}

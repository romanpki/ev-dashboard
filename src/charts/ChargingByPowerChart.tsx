import ReactECharts from 'echarts-for-react'
import type { ChargingByPower } from '../types'

interface Props {
  data: ChargingByPower[]
  mini?: boolean
}

export default function ChargingByPowerChart({ data, mini = false }: Props) {
  const option = {
    color: ['#25106B', '#451DC7', '#6B4CE6', '#C2A5FF', '#E8E5F0'],
    tooltip: {
      trigger: 'item',
      formatter: (p: { name: string; value: number; percent: number }) =>
        `${p.name}<br/><b>${p.value.toLocaleString('fr-FR')}</b> PDC (${p.percent}%)`,
    },
    legend: mini ? { show: false } : {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#6B7280', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: mini ? ['35%', '65%'] : ['40%', '68%'],
        center: mini ? ['50%', '50%'] : ['38%', '50%'],
        data: data.map((d) => ({ name: d.range, value: d.count })),
        label: { show: !mini, formatter: '{b}\n{d}%', fontSize: 11, color: '#6B7280' },
        emphasis: {
          itemStyle: { shadowBlur: 8, shadowColor: 'rgba(69,29,199,0.25)' },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: mini ? 200 : 260 }} />
}

import ReactECharts from 'echarts-for-react'
import type { ChargingByPower } from '../types'

interface Props {
  data: ChargingByPower[]
  mini?: boolean
  height?: number
}

const COLORS = ['#25106B', '#451DC7', '#6B4CE6', '#C2A5FF', '#E0D8FF']

export default function ChargingByPowerChart({ data, mini = false, height }: Props) {
  const option = {
    color: COLORS,
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 13 },
      formatter: (p: { name: string; value: number; percent: number }) =>
        `<b>${p.name}</b><br/>${p.value.toLocaleString('fr-FR')} PDC (${p.percent.toFixed(1)}%)`,
    },
    legend: mini
      ? { show: false }
      : {
          orient: 'vertical' as const,
          right: 0,
          top: 'center',
          itemWidth: 10,
          itemHeight: 10,
          borderRadius: 2,
          textStyle: { color: '#6B7280', fontSize: 12 },
        },
    series: [
      {
        type: 'pie',
        radius: mini ? ['45%', '72%'] : ['38%', '66%'],
        center: mini ? ['50%', '50%'] : ['36%', '50%'],
        data: data.map((d, i) => ({
          name: d.range,
          value: d.count,
          itemStyle: { color: COLORS[i] },
        })),
        label: {
          show: mini,
          position: 'center' as const,
          formatter: mini
            ? () => ''
            : '{b}\n{d}%',
          fontSize: 11,
          color: '#6B7280',
        },
        emphasis: {
          label: mini
            ? { show: true, fontSize: 14, fontWeight: 'bold' as const, color: '#451DC7',
                formatter: (p: { percent: number }) => `${p.percent.toFixed(0)}%` }
            : undefined,
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(69,29,199,0.25)' },
        },
        labelLine: { show: false },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: height ?? (mini ? 220 : 280) }} />
}

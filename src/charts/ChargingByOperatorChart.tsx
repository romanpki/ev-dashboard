import ReactECharts from 'echarts-for-react'
import type { ChargingByOperator } from '../types'

interface Props {
  data: ChargingByOperator[]
}

export default function ChargingByOperatorChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => a.count - b.count)

  const option = {
    color: ['#451DC7'],
    grid: { left: 140, right: 60, top: 10, bottom: 20 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown[]) => {
        const p = params[0] as { name: string; value: number }
        return `${p.name}<br/><b>${p.value.toLocaleString('fr-FR')}</b> PDC`
      },
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F5F3FF' } },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
      },
    },
    yAxis: {
      type: 'category',
      data: sorted.map((d) => d.operator),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#6B7280', fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: sorted.map((d) => d.count),
        barMaxWidth: 28,
        itemStyle: { borderRadius: [0, 4, 4, 0], color: '#451DC7' },
        label: {
          show: true,
          position: 'right',
          fontSize: 11,
          color: '#6B7280',
          formatter: (p: { value: number }) => p.value.toLocaleString('fr-FR'),
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 320 }} />
}

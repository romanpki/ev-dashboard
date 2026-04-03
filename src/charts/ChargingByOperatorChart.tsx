import ReactECharts from 'echarts-for-react'
import type { ChargingByOperator } from '../types'

interface Props {
  data: ChargingByOperator[]
}

export default function ChargingByOperatorChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => a.count - b.count)
  const max = sorted[sorted.length - 1]?.count ?? 1

  const option = {
    grid: { left: 160, right: 80, top: 8, bottom: 8 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 13 },
      formatter: (params: unknown[]) => {
        const p = params[0] as { name: string; value: number }
        const pct = ((p.value / sorted.reduce((s, d) => s + d.count, 0)) * 100).toFixed(1)
        return `<b>${p.name}</b><br/>${p.value.toLocaleString('fr-FR')} PDC (${pct}%)`
      },
    },
    xAxis: {
      type: 'value',
      max,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F5F3FF', type: 'dashed' } },
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
        data: sorted.map((d, i) => ({
          value: d.count,
          itemStyle: {
            color: i === sorted.length - 1
              ? '#451DC7'
              : `rgba(69,29,199,${0.25 + (i / sorted.length) * 0.6})`,
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barMaxWidth: 22,
        label: {
          show: true,
          position: 'right' as const,
          fontSize: 11,
          color: '#9CA3AF',
          formatter: (p: { value: number }) =>
            p.value.toLocaleString('fr-FR'),
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 340 }} />
}

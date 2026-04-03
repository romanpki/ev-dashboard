import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import type { ChargingPointHistory } from '../types'

interface Props {
  data: ChargingPointHistory[]
  access: 'all' | 'public' | 'private'
}

export default function ChargingPointsLineChart({ data, access }: Props) {
  const { t } = useTranslation()

  const labels = data.map((d) => d.month)
  const getValue = (d: ChargingPointHistory) => {
    if (access === 'public') return d.public
    if (access === 'private') return d.private
    return d.total
  }
  const values = data.map(getValue)

  const option = {
    color: ['#451DC7'],
    grid: { left: 50, right: 20, top: 20, bottom: 40, containLabel: false },
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown[]) => {
        const p = params[0] as { name: string; value: number }
        return `${p.name}<br/><b>${p.value.toLocaleString('fr-FR')}</b> ${t('common.units.points')}`
      },
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#E8E5F0' } },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        interval: 5,
        formatter: (val: string) => val.slice(0, 7),
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F5F3FF' } },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
      },
    },
    series: [
      {
        type: 'line',
        data: values,
        smooth: true,
        lineStyle: { width: 2.5, color: '#451DC7' },
        itemStyle: { color: '#451DC7' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(69,29,199,0.18)' },
              { offset: 1, color: 'rgba(69,29,199,0.01)' },
            ],
          },
        },
        showSymbol: false,
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 280 }} />
}

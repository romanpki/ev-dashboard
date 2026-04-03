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

  const seriesData =
    access === 'all'
      ? [
          { name: 'Public', values: data.map((d) => d.public), color: '#451DC7' },
          { name: 'Privé', values: data.map((d) => d.private), color: '#C2A5FF' },
        ]
      : access === 'public'
      ? [{ name: 'Public', values: data.map((d) => d.public), color: '#451DC7' }]
      : [{ name: 'Privé', values: data.map((d) => d.private), color: '#C2A5FF' }]

  const option = {
    grid: { left: 56, right: 24, top: access === 'all' ? 40 : 16, bottom: 36 },
    legend:
      access === 'all'
        ? {
            top: 0,
            left: 0,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { color: '#6B7280', fontSize: 12 },
          }
        : { show: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 13 },
      formatter: (params: unknown[]) => {
        const ps = params as Array<{ seriesName: string; value: number; name: string }>
        let html = `<span style="color:#9CA3AF;font-size:12px">${ps[0].name}</span><br/>`
        ps.forEach((p) => {
          html += `${p.seriesName} : <b>${p.value.toLocaleString('fr-FR')}</b> ${t('common.units.points')}<br/>`
        })
        return html
      },
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#E8E5F0' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        interval: Math.floor(labels.length / 6),
        formatter: (val: string) => {
          const [y, m] = val.split('-')
          return `${m}/${y.slice(2)}`
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F5F3FF', type: 'dashed' } },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
      },
    },
    series: seriesData.map((s) => ({
      name: s.name,
      type: 'line',
      data: s.values,
      smooth: 0.4,
      lineStyle: { width: 2.5, color: s.color },
      itemStyle: { color: s.color },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `${s.color}22` },
            { offset: 1, color: `${s.color}00` },
          ],
        },
      },
      showSymbol: false,
    })),
  }

  return <ReactECharts option={option} style={{ height: 300 }} />
}

import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import type { MonthlyRegistration } from '../types'

interface Props {
  data: MonthlyRegistration[]
  vehicleType: 'all' | 'vp' | 'vul' | 'pl'
}

const LABEL: Record<string, string> = {
  all: 'Total VE',
  vp: 'Véhicules particuliers',
  vul: 'Utilitaires légers',
  pl: 'Poids lourds',
}

export default function RegistrationsLineChart({ data, vehicleType }: Props) {
  const { t } = useTranslation()

  const labels = data.map((d) => d.month)
  const getValue = (d: MonthlyRegistration) => {
    if (vehicleType === 'vp') return d.vp
    if (vehicleType === 'vul') return d.vul
    if (vehicleType === 'pl') return d.pl
    return d.total
  }
  const values = data.map(getValue)

  const option = {
    color: ['#451DC7'],
    grid: { left: 56, right: 24, top: 16, bottom: 36 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 13 },
      formatter: (params: unknown[]) => {
        const p = params[0] as { name: string; value: number }
        return `<span style="color:#9CA3AF;font-size:12px">${p.name}</span><br/><b style="font-size:16px">${p.value.toLocaleString('fr-FR')}</b> ${t('common.units.vehicles')}`
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
        formatter: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`,
      },
    },
    series: [
      {
        name: LABEL[vehicleType],
        type: 'line',
        data: values,
        smooth: 0.4,
        lineStyle: { width: 2.5, color: '#451DC7' },
        itemStyle: { color: '#451DC7' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(69,29,199,0.15)' },
              { offset: 1, color: 'rgba(69,29,199,0)' },
            ],
          },
        },
        showSymbol: false,
        emphasis: { focus: 'series' },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 300 }} />
}

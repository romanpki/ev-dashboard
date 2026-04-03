import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import type { AnnualMarketShare } from '../types'

interface Props {
  data: AnnualMarketShare[]
}

export default function MarketShareBarChart({ data }: Props) {
  const { t } = useTranslation()
  const years = data.map((d) => String(d.year))

  const option = {
    color: ['#451DC7', '#C2A5FF', '#E8E5F0'],
    legend: {
      data: ['Électrique', 'Hybride', 'Thermique'],
      bottom: 0,
      textStyle: { color: '#6B7280', fontSize: 12 },
    },
    grid: { left: 50, right: 20, top: 20, bottom: 50, containLabel: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown[]) => {
        const ps = params as Array<{ seriesName: string; value: number; name: string }>
        const total = ps.reduce((s, p) => s + p.value, 0)
        let html = `<b>${ps[0].name}</b><br/>`
        ps.forEach((p) => {
          const pct = ((p.value / total) * 100).toFixed(1)
          html += `${p.seriesName}: ${p.value.toLocaleString('fr-FR')} (${pct}%)<br/>`
        })
        return html
      },
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLine: { lineStyle: { color: '#E8E5F0' } },
      axisLabel: { color: '#9CA3AF', fontSize: 12 },
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
        name: 'Électrique',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.electric),
        barMaxWidth: 48,
        itemStyle: { borderRadius: [0, 0, 0, 0] },
        label: {
          show: true,
          position: 'inside',
          fontSize: 10,
          color: 'white',
          formatter: (p: { value: number }) => p.value > 15000 ? `${(p.value / 1000).toFixed(0)}k` : '',
        },
      },
      {
        name: 'Hybride',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.hybrid),
        barMaxWidth: 48,
      },
      {
        name: 'Thermique',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.thermal),
        barMaxWidth: 48,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }

  return (
    <div>
      <ReactECharts option={option} style={{ height: 300 }} />
      <p className="text-xs text-center mt-1" style={{ color: 'var(--ws-gray-400)' }}>
        {t('registrations.filters.vp')} — {t('common.source')} : SDES
      </p>
    </div>
  )
}

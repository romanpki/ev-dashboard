import ReactECharts from 'echarts-for-react'
import type { AnnualMarketShare } from '../types'

interface Props {
  data: AnnualMarketShare[]
}

export default function MarketShareBarChart({ data }: Props) {
  const years = data.map((d) => String(d.year))

  const option = {
    color: ['#451DC7', '#C2A5FF', '#E8E5F0'],
    legend: {
      data: ['Électrique', 'Hybride', 'Thermique'],
      top: 0,
      left: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#6B7280', fontSize: 12 },
    },
    grid: { left: 56, right: 16, top: 40, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 13 },
      formatter: (params: unknown[]) => {
        const ps = params as Array<{ seriesName: string; value: number; name: string }>
        const total = ps.reduce((s, p) => s + p.value, 0)
        let html = `<b>${ps[0].name}</b><br/>`
        ps.forEach((p) => {
          const pct = ((p.value / total) * 100).toFixed(1)
          html += `${p.seriesName} : <b>${p.value.toLocaleString('fr-FR')}</b> (${pct}%)<br/>`
        })
        return html
      },
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLine: { lineStyle: { color: '#E8E5F0' } },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 12 },
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
    series: [
      {
        name: 'Électrique',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.electric),
        barMaxWidth: 44,
        itemStyle: { color: '#451DC7' },
        label: {
          show: true,
          position: 'inside',
          fontSize: 10,
          color: 'white',
          fontWeight: 600,
          formatter: (p: { value: number }) =>
            p.value > 20000 ? `${(p.value / 1000).toFixed(0)}k` : '',
        },
      },
      {
        name: 'Hybride',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.hybrid),
        barMaxWidth: 44,
        itemStyle: { color: '#C2A5FF' },
      },
      {
        name: 'Thermique',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.thermal),
        barMaxWidth: 44,
        itemStyle: { color: '#E8E5F0', borderRadius: [4, 4, 0, 0] },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 300 }} />
}

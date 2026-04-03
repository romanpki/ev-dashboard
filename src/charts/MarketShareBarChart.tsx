import ReactECharts from 'echarts-for-react'
import type { AnnualRegistration, VehicleTypeStrict } from '../types'

interface Props {
  data: AnnualRegistration[]
  vehicleType: VehicleTypeStrict
  height?: number
}

const ENERGIES = [
  { key: 'electric',            label: 'Électrique (BEV)',        color: '#451DC7' },
  { key: 'hybrid_rechargeable', label: 'Hybride rechargeable',    color: '#7C5CFC' },
  { key: 'hybrid',              label: 'Hybride non rechargeable', color: '#C2A5FF' },
  { key: 'gasoline',            label: 'Essence',                 color: '#9CA3AF' },
  { key: 'diesel',              label: 'Diesel',                  color: '#374151' },
  { key: 'gas',                 label: 'GNV / GNL',               color: '#D1D5DB' },
] as const

type EnergyKey = typeof ENERGIES[number]['key']

export default function MarketShareBarChart({ data, vehicleType, height = 320 }: Props) {
  const years = data.map((d) => String(d.year))

  const option = {
    color: ENERGIES.map(e => e.color),
    legend: {
      top: 0,
      left: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#6B7280', fontSize: 11 },
      data: ENERGIES.map(e => e.label),
    },
    grid: { left: 56, right: 16, top: 48, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 12 },
      formatter: (params: unknown[]) => {
        const ps = params as Array<{ seriesName: string; value: number; name: string; color: string }>
        const total = ps.reduce((s, p) => s + p.value, 0)
        let html = `<b>${ps[0].name}</b><br/>`
        ps.forEach((p) => {
          if (p.value > 0) {
            const pct = ((p.value / total) * 100).toFixed(1)
            html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
              <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${p.color}"></span>
              <span style="flex:1">${p.seriesName}</span>
              <b>${p.value.toLocaleString('fr-FR')}</b>
              <span style="color:#9CA3AF">${pct}%</span>
            </div>`
          }
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
    series: ENERGIES.map((e, idx) => ({
      name: e.label,
      type: 'bar',
      stack: 'total',
      data: data.map((d) => d[vehicleType][e.key as EnergyKey]),
      barMaxWidth: 44,
      itemStyle: {
        color: e.color,
        borderRadius: idx === ENERGIES.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0],
      },
      label:
        e.key === 'electric'
          ? {
              show: true,
              position: 'inside' as const,
              fontSize: 10,
              color: 'white',
              fontWeight: 600,
              formatter: (p: { value: number; dataIndex: number }) => {
                const total = data[p.dataIndex][vehicleType].total
                const pct = ((p.value / total) * 100).toFixed(0)
                return p.value > 30000 ? `${pct}%` : ''
              },
            }
          : { show: false },
    })),
  }

  return <ReactECharts option={option} style={{ height }} />
}

import ReactECharts from 'echarts-for-react'
import type { MonthlyRegistration, VehicleType } from '../types'

interface Props {
  data: MonthlyRegistration[]
  vehicleType: VehicleType
}

const SERIES_CONFIG = [
  { key: 'electric',            label: 'Électrique (BEV)',        color: '#451DC7', width: 2.5 },
  { key: 'hybrid_rechargeable', label: 'Hybride rechargeable',    color: '#7C5CFC', width: 2 },
  { key: 'hybrid',              label: 'Hybride non rechargeable', color: '#C2A5FF', width: 2 },
  { key: 'diesel',              label: 'Diesel',                  color: '#374151', width: 2 },
  { key: 'gasoline',            label: 'Essence',                 color: '#6B7280', width: 2 },
  { key: 'gas',                 label: 'GNV / GNL',               color: '#9CA3AF', width: 1.5 },
] as const

type EnergyKey = typeof SERIES_CONFIG[number]['key']

function getVehicleData(row: MonthlyRegistration, vehicleType: VehicleType) {
  if (vehicleType === 'vul') return row.vul
  if (vehicleType === 'pl') return row.pl
  if (vehicleType === 'vp') return row.vp
  // 'all' = sum across VP + VUL + PL
  const keys: EnergyKey[] = ['electric','hybrid_rechargeable','hybrid','diesel','gasoline','gas']
  const result = { ...row.vp }
  keys.forEach(k => { result[k] = row.vp[k] + row.vul[k] + row.pl[k] })
  result.total = row.vp.total + row.vul.total + row.pl.total
  return result
}

export default function RegistrationsLineChart({ data, vehicleType }: Props) {
  const labels = data.map((d) => d.month)

  const option = {
    grid: { left: 56, right: 16, top: 48, bottom: 36 },
    legend: {
      top: 0,
      left: 0,
      itemWidth: 12,
      itemHeight: 3,
      textStyle: { color: '#6B7280', fontSize: 11 },
      data: SERIES_CONFIG.map(s => s.label),
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#E8E5F0',
      borderWidth: 1,
      textStyle: { color: '#191A1C', fontSize: 12 },
      formatter: (params: unknown[]) => {
        const ps = params as Array<{ seriesName: string; value: number; name: string; color: string }>
        let html = `<div style="color:#9CA3AF;font-size:11px;margin-bottom:4px">${ps[0].name}</div>`
        ps.forEach((p) => {
          if (p.value > 0) {
            html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
              <span style="flex:1">${p.seriesName}</span>
              <b>${p.value.toLocaleString('fr-FR')}</b>
            </div>`
          }
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
        interval: Math.floor(labels.length / 8),
        formatter: (val: string) => {
          const [y, m] = val.split('-')
          return m === '01' ? y : `${m}/${y.slice(2)}`
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
        formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
      },
    },
    series: SERIES_CONFIG.map((s) => ({
      name: s.label,
      type: 'line',
      data: data.map((d) => getVehicleData(d, vehicleType)[s.key]),
      smooth: 0.3,
      lineStyle: { width: s.width, color: s.color },
      itemStyle: { color: s.color },
      showSymbol: false,
      emphasis: { focus: 'series' },
      // Only add area for electric series
      ...(s.key === 'electric' ? {
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(69,29,199,0.12)' },
              { offset: 1, color: 'rgba(69,29,199,0)' },
            ],
          },
        },
      } : {}),
    })),
  }

  return <ReactECharts option={option} style={{ height: 340 }} />
}

/**
 * Crowd density visualization using Recharts bar chart.
 * Color-coded by density level (green/yellow/red).
 */
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import type { ZoneStatus } from '@/types'

interface Props {
  zones: ZoneStatus[]
}

function getBarColor(density: number): string {
  if (density >= 85) return '#ef4444'
  if (density >= 65) return '#eab308'
  return '#22c55e'
}

export default function CrowdHeatmap({ zones }: Props) {
  const data = zones.map((z) => ({
    name: z.zone_name.split('–')[0].trim().slice(0, 20),
    density: Math.round(z.density_pct),
    queue: z.queue_length,
    fill: getBarColor(z.density_pct),
  }))

  return (
    <div role="img" aria-label="Crowd density bar chart by zone">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
            }}
            formatter={(value: number) => [`${value}%`, 'Density']}
          />
          <Bar dataKey="density" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

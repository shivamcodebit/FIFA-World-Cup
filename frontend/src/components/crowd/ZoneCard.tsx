import clsx from 'clsx'
import { Users, Clock } from 'lucide-react'
import DensityBadge from '@/components/ui/DensityBadge'
import type { ZoneStatus } from '@/types'

interface Props {
  zone: ZoneStatus
}

export default function ZoneCard({ zone }: Props) {
  const bgClass =
    zone.density_pct >= 85
      ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
      : zone.density_pct >= 65
      ? 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40'
      : 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'

  return (
    <article
      className={clsx(
        'rounded-xl border p-4 transition-colors',
        bgClass
      )}
      aria-label={`${zone.zone_name}: ${zone.density_pct.toFixed(0)}% density`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-200 leading-tight">{zone.zone_name}</h3>
        <DensityBadge density={zone.density_pct} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" aria-hidden="true" />
          {zone.density_pct.toFixed(0)}% full
        </span>
        {zone.queue_length > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            Queue: {zone.queue_length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden" aria-hidden="true">
        <div
          className={clsx(
            'h-full rounded-full transition-all',
            zone.density_pct >= 85 ? 'bg-red-500' : zone.density_pct >= 65 ? 'bg-yellow-500' : 'bg-green-500'
          )}
          style={{ width: `${Math.min(zone.density_pct, 100)}%` }}
        />
      </div>
    </article>
  )
}

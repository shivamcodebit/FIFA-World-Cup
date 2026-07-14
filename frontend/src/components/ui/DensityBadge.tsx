import clsx from 'clsx'
import { getDensityColor } from '@/utils/helpers'

interface Props {
  density: number
  showLabel?: boolean
  className?: string
}

export default function DensityBadge({ density, showLabel = true, className }: Props) {
  const colorClass = getDensityColor(density)
  const label = density >= 85 ? 'Critical' : density >= 65 ? 'Busy' : 'Normal'

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border',
        density >= 85
          ? 'bg-red-500/20 border-red-500/30 text-red-300'
          : density >= 65
          ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
          : 'bg-green-500/20 border-green-500/30 text-green-300',
        className
      )}
      aria-label={`Density: ${density.toFixed(0)}% - ${label}`}
    >
      <span
        className={clsx('w-1.5 h-1.5 rounded-full', colorClass.replace('text-', 'bg-'))}
        aria-hidden="true"
      />
      {density.toFixed(0)}%
      {showLabel && <span className="hidden sm:inline">{label}</span>}
    </span>
  )
}

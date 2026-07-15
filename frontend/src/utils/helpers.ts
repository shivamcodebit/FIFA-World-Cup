/**
 * General utility helpers for StadiumPilot AI.
 */

/** Return a Tailwind color class based on density percentage */
export function getDensityColor(density: number): string {
  if (density >= 85) return 'text-red-400'
  if (density >= 65) return 'text-yellow-400'
  return 'text-green-400'
}

/** Return a background color class based on density percentage */
export function getDensityBg(density: number): string {
  if (density >= 85) return 'bg-red-500/20 border-red-500/30'
  if (density >= 65) return 'bg-yellow-500/20 border-yellow-500/30'
  return 'bg-green-500/20 border-green-500/30'
}

/** Return alert level label */
export function getAlertLabel(level: string): string {
  const labels: Record<string, string> = {
    green: 'Normal',
    yellow: 'Busy',
    red: 'Critical',
  }
  return labels[level] ?? level
}

/** Format datetime string to human-readable */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Format large numbers with commas */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

/** Convert incident type to display label */
export function incidentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    medical: '🏥 Medical',
    fire: '🔥 Fire',
    lost_child: '👶 Lost Child',
    security: '🛡️ Security',
    suspicious: '⚠️ Suspicious',
    other: '📋 Other',
  }
  return labels[type] ?? type
}

/** Convert incident status to badge style */
export function incidentStatusClass(status: string): string {
  const classes: Record<string, string> = {
    open: 'bg-red-500/20 text-red-300 border-red-500/30',
    in_progress: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    resolved: 'bg-green-500/20 text-green-300 border-green-500/30',
  }
  return classes[status] ?? 'bg-gray-500/20 text-gray-300'
}

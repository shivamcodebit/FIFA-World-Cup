import clsx from 'clsx'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

type Variant = 'info' | 'warning' | 'error' | 'success'

interface Props {
  variant?: Variant
  title?: string
  children: React.ReactNode
  className?: string
}

const variants: Record<Variant, { bg: string; border: string; icon: React.ReactNode; text: string }> = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    icon: <Info className="w-4 h-4 text-blue-400" aria-hidden="true" />,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-300',
    icon: <AlertTriangle className="w-4 h-4 text-yellow-400" aria-hidden="true" />,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-300',
    icon: <AlertTriangle className="w-4 h-4 text-red-400" aria-hidden="true" />,
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-300',
    icon: <CheckCircle className="w-4 h-4 text-green-400" aria-hidden="true" />,
  },
}

export default function AlertCard({ variant = 'info', title, children, className }: Props) {
  const v = variants[variant]
  const roleMap: Record<Variant, string> = {
    error: 'alert',
    warning: 'alert',
    info: 'status',
    success: 'status',
  }

  return (
    <div
      className={clsx('rounded-xl border p-4', v.bg, v.border, className)}
      role={roleMap[variant]}
    >
      <div className={clsx('flex items-start gap-2', v.text)}>
        {v.icon}
        <div>
          {title && <p className="font-semibold text-sm mb-1">{title}</p>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    </div>
  )
}

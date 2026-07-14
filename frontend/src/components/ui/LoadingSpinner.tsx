import clsx from 'clsx'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export default function LoadingSpinner({ size = 'md', label = 'Loading...' }: Props) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

  return (
    <div className="flex flex-col items-center justify-center gap-2" role="status" aria-label={label}>
      <div
        className={clsx(
          sizes[size],
          'border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin'
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

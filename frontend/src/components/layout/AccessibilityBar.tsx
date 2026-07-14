/**
 * Accessibility toolbar with high contrast, large text, and screen reader toggles.
 * Always visible for WCAG compliance.
 */
import { Eye, Type, Volume2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

export default function AccessibilityBar() {
  const { highContrast, largeText, screenReaderMode, toggleHighContrast, toggleLargeText, toggleScreenReaderMode } =
    useAppStore()

  return (
    <div
      className="bg-gray-900/50 border-b border-gray-800/50 px-4 py-1 flex items-center gap-2"
      role="toolbar"
      aria-label="Accessibility options"
    >
      <span className="text-xs text-gray-500 mr-1">Accessibility:</span>

      <button
        onClick={toggleHighContrast}
        className={clsx(
          'flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors',
          highContrast
            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
        )}
        aria-pressed={highContrast}
        aria-label="Toggle high contrast mode"
      >
        <Eye className="w-3 h-3" aria-hidden="true" />
        <span className="hidden sm:inline">High Contrast</span>
      </button>

      <button
        onClick={toggleLargeText}
        className={clsx(
          'flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors',
          largeText
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
        )}
        aria-pressed={largeText}
        aria-label="Toggle large text mode"
      >
        <Type className="w-3 h-3" aria-hidden="true" />
        <span className="hidden sm:inline">Large Text</span>
      </button>

      <button
        onClick={toggleScreenReaderMode}
        className={clsx(
          'flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors',
          screenReaderMode
            ? 'bg-green-500/20 text-green-300 border border-green-500/40'
            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
        )}
        aria-pressed={screenReaderMode}
        aria-label="Toggle screen reader optimized mode"
      >
        <Volume2 className="w-3 h-3" aria-hidden="true" />
        <span className="hidden sm:inline">Screen Reader</span>
      </button>
    </div>
  )
}

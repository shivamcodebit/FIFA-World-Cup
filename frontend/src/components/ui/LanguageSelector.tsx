import { useAppStore } from '@/store/appStore'
import { LANGUAGE_OPTIONS } from '@/utils/i18n'
import type { Language } from '@/types'

export default function LanguageSelector() {
  const { language, setLanguage } = useAppStore()

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Select language"
    >
      {LANGUAGE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.flag} {opt.label}
        </option>
      ))}
    </select>
  )
}

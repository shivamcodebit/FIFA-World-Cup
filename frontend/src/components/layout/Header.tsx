import { Link, useLocation } from 'react-router-dom'
import { Shield, Zap } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import LanguageSelector from '@/components/ui/LanguageSelector'

export default function Header() {
  const location = useLocation()
  const { userRole } = useAppStore()

  const roleColors: Record<string, string> = {
    fan: 'text-blue-400',
    volunteer: 'text-green-400',
    staff: 'text-yellow-400',
    organizer: 'text-purple-400',
  }

  return (
    <header
      className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between"
      role="banner"
    >
      {/* Skip to main content – accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-3 py-1 rounded z-50"
      >
        Skip to main content
      </a>

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-xl"
        aria-label="StadiumPilot AI Home"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <span className="text-white">StadiumPilot</span>
        <span className="text-blue-400">AI</span>
      </Link>

      {/* Center – FIFA badge */}
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
        <Shield className="w-4 h-4" aria-hidden="true" />
        <span>FIFA World Cup 2026™</span>
      </div>

      {/* Right – Language + Role indicator */}
      <div className="flex items-center gap-3">
        <LanguageSelector />
        <span
          className={`hidden sm:inline text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-800 ${roleColors[userRole]}`}
          aria-label={`Current role: ${userRole}`}
        >
          {userRole}
        </span>
        {location.pathname !== '/' && (
          <Link
            to="/emergency"
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            aria-label="Emergency assistance"
          >
            🚨 SOS
          </Link>
        )}
      </div>
    </header>
  )
}

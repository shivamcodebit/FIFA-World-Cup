import { NavLink } from 'react-router-dom'
import {
  Users, HeartHandshake, LayoutDashboard,
  Building2, AlertTriangle, Map, Home
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

const navItems = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/fan', icon: Users, label: 'Fan Assistant' },
  { to: '/volunteer', icon: HeartHandshake, label: 'Volunteer' },
  { to: '/staff', icon: LayoutDashboard, label: 'Staff' },
  { to: '/organizer', icon: Building2, label: 'Organizer' },
  { to: '/map', icon: Map, label: 'Stadium Map' },
  { to: '/emergency', icon: AlertTriangle, label: 'Emergency', danger: true },
]

export default function Sidebar() {
  const { userRole } = useAppStore()

  return (
    <aside
      className="hidden md:flex flex-col w-16 lg:w-56 bg-gray-900 border-r border-gray-800 py-4"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map(({ to, icon: Icon, label, exact, danger }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : danger
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            )
          }
          aria-label={label}
        >
          <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span className="hidden lg:inline truncate">{label}</span>
        </NavLink>
      ))}

      {/* Role indicator at bottom */}
      <div className="mt-auto px-3 mx-2 mb-2">
        <div className="hidden lg:block text-xs text-gray-500 uppercase tracking-wider mb-1">
          Current Role
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span className="hidden lg:inline text-xs text-gray-400 capitalize">{userRole}</span>
        </div>
      </div>
    </aside>
  )
}

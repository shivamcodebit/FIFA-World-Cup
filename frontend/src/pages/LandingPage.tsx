import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, HeartHandshake, LayoutDashboard, Building2,
  Zap, Globe, Shield, Leaf, ArrowRight, Activity, MapPin
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import type { UserRole } from '@/types'

const roles: {
  id: UserRole
  title: string
  subtitle: string
  icon: React.ReactNode
  path: string
  color: string
  gradient: string
  hoverGlow: string
  features: string[]
}[] = [
  {
    id: 'fan',
    title: 'Fan Assistant',
    subtitle: 'Navigation, food, seats & more',
    icon: <Users className="w-8 h-8" />,
    path: '/fan',
    color: 'text-blue-400',
    gradient: 'from-blue-600/20 to-blue-900/20 border-blue-500/30 hover:border-blue-400/60',
    hoverGlow: 'hover:shadow-blue-500/20',
    features: ['Seat navigation', 'Queue-aware food recs', 'Multilingual support'],
  },
  {
    id: 'volunteer',
    title: 'Volunteer Assistant',
    subtitle: 'Incident workflows & crowd ops',
    icon: <HeartHandshake className="w-8 h-8" />,
    path: '/volunteer',
    color: 'text-green-400',
    gradient: 'from-green-600/20 to-green-900/20 border-green-500/30 hover:border-green-400/60',
    hoverGlow: 'hover:shadow-green-500/20',
    features: ['Emergency protocols', 'AI incident reports', 'Escalation paths'],
  },
  {
    id: 'staff',
    title: 'Staff Dashboard',
    subtitle: 'Real-time crowd & operations',
    icon: <LayoutDashboard className="w-8 h-8" />,
    path: '/staff',
    color: 'text-yellow-400',
    gradient: 'from-yellow-600/20 to-yellow-900/20 border-yellow-500/30 hover:border-yellow-400/60',
    hoverGlow: 'hover:shadow-yellow-500/20',
    features: ['Live crowd density', 'Cleaning priorities', 'Security alerts'],
  },
  {
    id: 'organizer',
    title: 'Organizer Dashboard',
    subtitle: 'Strategic AI decision support',
    icon: <Building2 className="w-8 h-8" />,
    path: '/organizer',
    color: 'text-purple-400',
    gradient: 'from-purple-600/20 to-purple-900/20 border-purple-500/30 hover:border-purple-400/60',
    hoverGlow: 'hover:shadow-purple-500/20',
    features: ['Gate optimization', 'Staff allocation', 'Transport dispatch'],
  },
]

const features = [
  { icon: <Zap className="w-5 h-5" />, text: 'Google Gemini 2.0 Flash AI', color: 'text-blue-400' },
  { icon: <Globe className="w-5 h-5" />, text: '6 Languages Supported', color: 'text-green-400' },
  { icon: <Shield className="w-5 h-5" />, text: 'Emergency Response System', color: 'text-red-400' },
  { icon: <Leaf className="w-5 h-5" />, text: 'Sustainability Guidance', color: 'text-emerald-400' },
  { icon: <Activity className="w-5 h-5" />, text: 'Real-time Crowd Intelligence', color: 'text-yellow-400' },
  { icon: <MapPin className="w-5 h-5" />, text: 'Interactive Stadium Map', color: 'text-purple-400' },
]

const stats = [
  { value: '80,000+', label: 'Fans Supported per Match' },
  { value: '16', label: 'Host Cities' },
  { value: '6', label: 'Languages' },
  { value: '4', label: 'User Roles' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { setUserRole } = useAppStore()

  const handleRoleSelect = (role: UserRole, path: string) => {
    setUserRole(role)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Animated background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header
        className="relative z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex items-center justify-between"
        role="banner"
      >
        {/* Skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-3 py-1 rounded z-50 focus:z-50"
        >
          Skip to main content
        </a>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Zap className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">StadiumPilot AI</h1>
            <p className="text-xs text-gray-500">FIFA World Cup 2026™ Official Copilot</p>
          </div>
        </div>

        <a
          href="/emergency"
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/25"
          aria-label="Emergency SOS – Open emergency response"
        >
          🚨 SOS
        </a>
      </header>

      <main className="flex-1 relative z-10 px-4 py-12 max-w-5xl mx-auto w-full" id="main-content">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" aria-hidden="true" />
            <span>FIFA World Cup 2026 · USA · Canada · Mexico</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              Stadium Copilot
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Intelligent, multilingual AI assistance for fans, volunteers, staff and organizers.
            Powered by{' '}
            <span className="text-blue-400 font-semibold">Google Gemini 2.0 Flash</span>{' '}
            for context-aware, real-time support.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          aria-label="Key statistics"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 text-center"
            >
              <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Role Selection Cards */}
        <section aria-label="Select your role to get started">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-center mb-6">
            Select your role to get started
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {roles.map((role, i) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                onClick={() => handleRoleSelect(role.id, role.path)}
                className={`
                  group bg-gradient-to-br ${role.gradient} border rounded-2xl p-6 text-left
                  transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${role.hoverGlow}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950
                `}
                aria-label={`Enter as ${role.title}: ${role.subtitle}`}
                id={`role-${role.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${role.color} transition-transform group-hover:scale-110`} aria-hidden="true">
                    {role.icon}
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 ${role.color} opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{role.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{role.subtitle}</p>
                <ul className="space-y-1" aria-label={`${role.title} features`}>
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className={`w-1 h-1 rounded-full ${role.color.replace('text-', 'bg-')}`} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Features Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
          aria-label="Key features"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-xl px-3 py-2.5 transition-colors"
            >
              <span className={`${f.color} flex-shrink-0`} aria-hidden="true">{f.icon}</span>
              <span className="text-xs text-gray-400">{f.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="relative z-10 text-center py-5 text-xs text-gray-600 border-t border-gray-800 bg-gray-900/30">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span>StadiumPilot AI</span>
          <span aria-hidden="true">·</span>
          <span>FIFA World Cup 2026 GenAI Challenge</span>
          <span aria-hidden="true">·</span>
          <span>Powered by Google Gemini</span>
          <span aria-hidden="true">·</span>
          <a
            href="/emergency"
            className="text-red-500 hover:text-red-400 font-medium"
            aria-label="Emergency response page"
          >
            🚨 Emergency
          </a>
        </div>
      </footer>
    </div>
  )
}

/**
 * Emergency Response Page
 * Quick incident reporting and AI emergency guidance.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Heart, Baby, Flame, Shield, Eye, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { incidentsApi } from '@/api/incidents'
import AlertCard from '@/components/ui/AlertCard'
import toast from 'react-hot-toast'
import type { IncidentType } from '@/types'
import { useAppStore } from '@/store/appStore'

const EMERGENCY_TYPES: {
  type: IncidentType
  label: string
  icon: React.ReactNode
  color: string
  instructions: string[]
}[] = [
  {
    type: 'medical',
    label: 'Medical Emergency',
    icon: <Heart className="w-6 h-6" />,
    color: 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-300',
    instructions: [
      'Call emergency: 911 or dial 0 from stadium phone',
      'Do not move the person unless in immediate danger',
      'Clear the area – give them space to breathe',
      'Stay with them until help arrives',
    ],
  },
  {
    type: 'fire',
    label: 'Fire / Smoke',
    icon: <Flame className="w-6 h-6" />,
    color: 'border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300',
    instructions: [
      'Activate fire alarm if not already triggered',
      'Evacuate immediately – DO NOT use elevators',
      'Follow green EXIT signs',
      'Call 911 from outside the building',
    ],
  },
  {
    type: 'lost_child',
    label: 'Lost Child',
    icon: <Baby className="w-6 h-6" />,
    color: 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300',
    instructions: [
      'Stay calm and reassure the child',
      'Escort to nearest Security Point',
      'Do not leave the child alone',
      'Contact venue security immediately',
    ],
  },
  {
    type: 'security',
    label: 'Security Issue',
    icon: <Shield className="w-6 h-6" />,
    color: 'border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300',
    instructions: [
      'Do not engage with the individual(s)',
      'Keep a safe distance',
      'Alert security staff or call 911',
      'Note description and location',
    ],
  },
  {
    type: 'suspicious',
    label: 'Suspicious Activity',
    icon: <Eye className="w-6 h-6" />,
    color: 'border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300',
    instructions: [
      'Do not approach the suspicious item/person',
      'Note exact location and description',
      'Alert nearest security officer',
      'Call emergency: 911',
    ],
  },
]

export default function EmergencyPage() {
  const { userRole } = useAppStore()
  const [selected, setSelected] = useState<typeof EMERGENCY_TYPES[0] | null>(null)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !location.trim() || !description.trim()) {
      toast.error('Please complete all fields')
      return
    }
    setSubmitting(true)
    try {
      const incident = await incidentsApi.create({
        type: selected.type,
        location,
        description,
        reporter_role: userRole,
      })
      setAiSummary(incident.ai_summary || 'Incident reported. Emergency services notified.')
      toast.success('Emergency reported successfully!')
    } catch {
      toast.error('Failed to submit. Please call 911 directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-full p-4 max-w-2xl mx-auto" id="main-content">
      {/* Back navigation */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-4 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back
      </Link>

      {/* Emergency Header */}
      <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-5 mb-6 text-center">
        <h1 className="text-2xl font-extrabold text-red-400 mb-2">🚨 Emergency Response</h1>
        <p className="text-gray-300 text-sm mb-3">
          For life-threatening emergencies, call <strong className="text-white">911</strong> immediately.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            href="tel:911"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
            aria-label="Call 911"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Call 911
          </a>
          <a
            href="tel:0"
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
            aria-label="Stadium emergency line"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Stadium Emergency: 0
          </a>
        </div>
      </div>

      {/* AI Summary after submission */}
      <AnimatePresence>
        {aiSummary && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <AlertCard variant="warning" title="AI Incident Report">
              <pre className="whitespace-pre-wrap text-xs font-mono">{aiSummary}</pre>
            </AlertCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency type selector */}
      <section aria-label="Select emergency type">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Report an Incident
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {EMERGENCY_TYPES.map((em) => (
            <button
              key={em.type}
              onClick={() => setSelected(em)}
              className={`flex flex-col items-center gap-2 border rounded-xl p-4 text-sm font-semibold transition-all ${em.color} ${
                selected?.type === em.type ? 'ring-2 ring-white/30 scale-[1.02]' : ''
              }`}
              aria-pressed={selected?.type === em.type}
              aria-label={em.label}
            >
              <span aria-hidden="true">{em.icon}</span>
              {em.label}
            </button>
          ))}
        </div>
      </section>

      {/* Instructions + Form */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Immediate instructions */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-3">
                Immediate Actions – {selected.label}
              </h3>
              <ol className="space-y-2">
                {selected.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span
                      className="flex-shrink-0 w-5 h-5 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center text-xs font-bold text-red-400"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Incident details form */}
            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-200">Submit Incident Report</h3>

              <div>
                <label htmlFor="emergency-location" className="block text-xs font-medium text-gray-400 mb-1">
                  Location *
                </label>
                <input
                  id="emergency-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Section 101, Gate B, North Concourse"
                  className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="emergency-description" className="block text-xs font-medium text-gray-400 mb-1">
                  What happened? *
                </label>
                <textarea
                  id="emergency-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you see and the current situation..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !location.trim() || !description.trim()}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl py-3 text-sm transition-colors"
              >
                {submitting ? 'Submitting & Generating AI Report...' : '🚨 Submit Emergency Report'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

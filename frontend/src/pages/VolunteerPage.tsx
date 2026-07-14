/**
 * Volunteer Assistant Page
 * Chat + incident reporting with AI-generated summaries.
 */
import { useState } from 'react'
import { AlertTriangle, FileText, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatInterface from '@/components/chat/ChatInterface'
import AlertCard from '@/components/ui/AlertCard'
import { incidentsApi } from '@/api/incidents'
import { useAppStore } from '@/store/appStore'
import toast from 'react-hot-toast'
import type { IncidentType } from '@/types'

const QUICK_PROMPTS = [
  'Lost child near Gate C, 6-year-old girl',
  'Fan needs medical attention at Section 101',
  'Suspicious package near Gate A',
  'Crowd overcrowding at North Concourse',
  'Fire alarm triggered in Block B',
  'Generate my incident report',
]

const INCIDENT_TYPES: { value: IncidentType; label: string; emoji: string }[] = [
  { value: 'medical', label: 'Medical', emoji: '🏥' },
  { value: 'fire', label: 'Fire', emoji: '🔥' },
  { value: 'lost_child', label: 'Lost Child', emoji: '👶' },
  { value: 'security', label: 'Security', emoji: '🛡️' },
  { value: 'suspicious', label: 'Suspicious', emoji: '⚠️' },
  { value: 'other', label: 'Other', emoji: '📋' },
]

export default function VolunteerPage() {
  const { language } = useAppStore()
  const [showIncidentForm, setShowIncidentForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [lastReport, setLastReport] = useState<string | null>(null)
  const [form, setForm] = useState({
    type: 'medical' as IncidentType,
    location: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.location.trim() || !form.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setSubmitting(true)
    try {
      const incident = await incidentsApi.create({
        ...form,
        reporter_role: 'volunteer',
      })
      setLastReport(incident.ai_summary || 'Report submitted successfully.')
      toast.success('Incident reported. AI summary generated.')
      setShowIncidentForm(false)
      setForm({ type: 'medical', location: '', description: '' })
    } catch {
      toast.error('Failed to submit incident report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-5.5rem)]">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Volunteer Assistant</h1>
            <p className="text-xs text-gray-500">Operational support for field volunteers</p>
          </div>
          <button
            onClick={() => setShowIncidentForm(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            aria-label="Report new incident"
          >
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            Report Incident
          </button>
        </div>
      </div>

      {/* AI Report display */}
      <AnimatePresence>
        {lastReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-3"
          >
            <AlertCard variant="info" title="AI Incident Report Generated">
              <pre className="whitespace-pre-wrap text-xs font-mono">{lastReport}</pre>
              <button
                onClick={() => setLastReport(null)}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                Dismiss
              </button>
            </AlertCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          placeholder="Describe an incident or ask for workflow guidance..."
          quickPrompts={QUICK_PROMPTS}
        />
      </div>

      {/* Incident Report Modal */}
      <AnimatePresence>
        {showIncidentForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="incident-form-title"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="incident-form-title" className="flex items-center gap-2 text-lg font-bold text-white">
                  <FileText className="w-5 h-5 text-red-400" aria-hidden="true" />
                  Report Incident
                </h2>
                <button
                  onClick={() => setShowIncidentForm(false)}
                  className="text-gray-500 hover:text-gray-300"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Incident Type</label>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Incident type">
                    {INCIDENT_TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        role="radio"
                        aria-checked={form.type === t.value}
                        onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                        className={`py-2 px-3 rounded-lg text-xs font-medium text-center transition-colors ${
                          form.type === t.value
                            ? 'bg-red-600/20 border border-red-500/50 text-red-300'
                            : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-lg mb-0.5" aria-hidden="true">{t.emoji}</div>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="incident-location" className="block text-sm font-medium text-gray-300 mb-1">
                    Location *
                  </label>
                  <input
                    id="incident-location"
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Section 101, Gate B, North Concourse"
                    className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="incident-description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="incident-description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe what you observed..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIncidentForm(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg py-2.5 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        Submit & Generate AI Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

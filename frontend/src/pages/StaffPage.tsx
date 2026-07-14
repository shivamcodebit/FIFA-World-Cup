/**
 * Staff Operations Dashboard
 * Real-time crowd data + AI operational insights.
 */
import { RefreshCw, Droplets, Shield, Sparkles, Trash2 } from 'lucide-react'
import { useStaffDashboard } from '@/hooks/useDashboard'
import CrowdHeatmap from '@/components/crowd/CrowdHeatmap'
import ZoneCard from '@/components/crowd/ZoneCard'
import AlertCard from '@/components/ui/AlertCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ChatInterface from '@/components/chat/ChatInterface'
import { useAppStore } from '@/store/appStore'
import { useTranslation } from '@/utils/i18n'

const STAFF_PROMPTS = [
  'Which zones need cleaning urgently?',
  'Where are the busiest food queues?',
  'Generate a crowd status summary',
  'Are there any water refill alerts?',
  'What security situations need attention?',
]

export default function StaffPage() {
  const { data, loading, error, refetch } = useStaffDashboard()
  const { language } = useAppStore()
  const t = useTranslation(language)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-7rem)] md:h-[calc(100vh-5.5rem)]">
      {/* Left panel – Dashboard */}
      <div className="w-full lg:w-[55%] overflow-y-auto p-4 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{t('staff_title')}</h1>
            <p className="text-xs text-gray-500">{t('staff_subtitle')}</p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" label="Loading staff dashboard..." />
          </div>
        )}

        {error && (
          <AlertCard variant="error" title="Error loading dashboard">
            {error}
            <button onClick={refetch} className="block mt-2 text-xs underline">{t('retry')}</button>
          </AlertCard>
        )}

        {data && (
          <>
            {/* AI Crowd Summary */}
            <section aria-label="AI crowd summary">
              <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" aria-hidden="true" />
                AI Crowd Summary
              </h2>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-200">{data.crowd_summary}</p>
              </div>
            </section>

            {/* Chart */}
            <section aria-label="Crowd density chart">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">Zone Density Overview</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <CrowdHeatmap zones={data.zones} />
              </div>
            </section>

            {/* Zones grid */}
            <section aria-label="Zone status cards">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">All Zones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.zones.map((zone) => (
                  <ZoneCard key={zone.zone_id} zone={zone} />
                ))}
              </div>
            </section>

            {/* Alerts sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cleaning */}
              <section aria-label="Cleaning priorities">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                  Cleaning Priorities
                </h2>
                <div className="space-y-2">
                  {data.cleaning_priorities.length === 0 ? (
                    <p className="text-xs text-gray-500">No urgent cleaning needs</p>
                  ) : (
                    data.cleaning_priorities.map((p, i) => (
                      <div key={i} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 text-xs text-yellow-300">
                        {p}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Water Refill */}
              <section aria-label="Water refill alerts">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" aria-hidden="true" />
                  Water Refill Alerts
                </h2>
                <div className="space-y-2">
                  {data.water_refill_alerts.length === 0 ? (
                    <p className="text-xs text-gray-500">All stations OK</p>
                  ) : (
                    data.water_refill_alerts.map((a, i) => (
                      <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 text-xs text-blue-300">
                        {a}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Security */}
              <section aria-label="Security alerts">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" aria-hidden="true" />
                  Security Alerts
                </h2>
                <div className="space-y-2">
                  {data.security_alerts.length === 0 ? (
                    <p className="text-xs text-gray-500">No security alerts</p>
                  ) : (
                    data.security_alerts.map((a, i) => (
                      <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 text-xs text-red-300">
                        {a}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* AI Insights */}
            <section aria-label="AI operational insights">
              <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" aria-hidden="true" />
                AI Operational Insights
              </h2>
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{data.ai_insights}</p>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Right panel – Chat */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50">
          <h2 className="text-sm font-semibold text-gray-300">Ask AI Operations Assistant</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            placeholder="Ask about crowd conditions, priorities, alerts..."
            quickPrompts={STAFF_PROMPTS}
          />
        </div>
      </div>
    </div>
  )
}

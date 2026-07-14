/**
 * Organizer Strategic Dashboard
 * AI decision support for senior event management.
 */
import { RefreshCw, GitBranch, Users2, Bus, Sparkles, Activity } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts'
import { useOrganizerDashboard } from '@/hooks/useDashboard'
import AlertCard from '@/components/ui/AlertCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import DensityBadge from '@/components/ui/DensityBadge'
import ChatInterface from '@/components/chat/ChatInterface'
import { useAppStore } from '@/store/appStore'
import { useTranslation } from '@/utils/i18n'

const ORGANIZER_PROMPTS = [
  'What are the top 3 decisions I should make right now?',
  'Which gates should be opened or closed?',
  'Where do we need more staff deployed?',
  'Generate a stadium health summary',
  'What transport should we dispatch?',
  'Analyze crowd distribution risk',
]

export default function OrganizerPage() {
  const { data, loading, error, refetch } = useOrganizerDashboard()
  const { language } = useAppStore()
  const t = useTranslation(language)

  const radarData = data?.zones.slice(0, 8).map((z) => ({
    zone: z.zone_name.split('–')[0].trim().slice(0, 18),
    density: Math.round(z.density_pct),
  })) ?? []

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-7rem)] md:h-[calc(100vh-5.5rem)]">
      {/* Left panel */}
      <div className="w-full lg:w-[58%] overflow-y-auto p-4 space-y-5 border-b lg:border-b-0 lg:border-r border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{t('organizer_title')}</h1>
            <p className="text-xs text-gray-500">{t('organizer_subtitle')}</p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
        </div>

        {loading && <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>}

        {error && (
          <AlertCard variant="error">{error}</AlertCard>
        )}

        {data && (
          <>
            {/* Decision Support – TOP PRIORITY */}
            <section aria-label="AI decision support">
              <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                AI Decision Support
              </h2>
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{data.decision_support}</p>
              </div>
            </section>

            {/* Crowd Distribution Analysis */}
            <section aria-label="Crowd distribution analysis">
              <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" aria-hidden="true" />
                Crowd Distribution Analysis
              </h2>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-200">{data.crowd_distribution_analysis}</p>
              </div>
            </section>

            {/* Radar Chart */}
            {radarData.length > 0 && (
              <section aria-label="Zone density radar chart">
                <h2 className="text-sm font-semibold text-gray-400 mb-2">Zone Density Radar</h2>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="zone" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 9 }} />
                      <Radar
                        name="Density"
                        dataKey="density"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb' }}
                        formatter={(v: number) => [`${v}%`, 'Density']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {/* Zone Status Table */}
            <section aria-label="Zone status overview">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">Zone Status Overview</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs" role="table" aria-label="Zone density table">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500">
                      <th scope="col" className="text-left p-3 font-medium">Zone</th>
                      <th scope="col" className="text-right p-3 font-medium">Density</th>
                      <th scope="col" className="text-right p-3 font-medium">Queue</th>
                      <th scope="col" className="text-right p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.zones.map((zone) => (
                      <tr key={zone.zone_id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                        <td className="p-3 text-gray-300">{zone.zone_name}</td>
                        <td className="p-3 text-right text-gray-400">{zone.density_pct.toFixed(0)}%</td>
                        <td className="p-3 text-right text-gray-400">{zone.queue_length}</td>
                        <td className="p-3 text-right">
                          <DensityBadge density={zone.density_pct} showLabel={false} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Action panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gate Optimization */}
              <section aria-label="Gate optimization">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-green-400" aria-hidden="true" />
                  Gate Optimization
                </h2>
                <ul className="space-y-2">
                  {data.gate_optimization.map((g, i) => (
                    <li key={i} className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 text-xs text-green-300">
                      {g}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Staff Allocation */}
              <section aria-label="Staff allocation recommendations">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-blue-400" aria-hidden="true" />
                  Staff Allocation
                </h2>
                <ul className="space-y-2">
                  {data.staff_allocation.map((s, i) => (
                    <li key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 text-xs text-blue-300">
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Transport */}
              <section aria-label="Transport recommendations">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <Bus className="w-4 h-4 text-purple-400" aria-hidden="true" />
                  Transport
                </h2>
                <ul className="space-y-2">
                  {data.transport_recommendations.map((t, i) => (
                    <li key={i} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2.5 text-xs text-purple-300">
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Stadium Health */}
            <section aria-label="Stadium health summary">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">Stadium Health Summary</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-200">{data.stadium_health_summary}</p>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Right panel – Chat */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50">
          <h2 className="text-sm font-semibold text-gray-300">AI Strategic Advisor</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            placeholder="Ask about strategy, crowd distribution, decisions..."
            quickPrompts={ORGANIZER_PROMPTS}
          />
        </div>
      </div>
    </div>
  )
}

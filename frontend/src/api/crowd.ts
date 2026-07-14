import apiClient from './client'
import type { CrowdZone, CrowdSummary } from '@/types'

export const crowdApi = {
  getCurrent: (): Promise<CrowdZone[]> =>
    apiClient.get<CrowdZone[]>('/crowd/current').then((r) => r.data),

  getSummary: (): Promise<CrowdSummary> =>
    apiClient.get<CrowdSummary>('/crowd/summary').then((r) => r.data),

  seed: (): Promise<{ message: string }> =>
    apiClient.post('/crowd/seed').then((r) => r.data),
}

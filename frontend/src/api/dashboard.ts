import apiClient from './client'
import type { StaffDashboard, OrganizerDashboard } from '@/types'

export const dashboardApi = {
  getStaff: (): Promise<StaffDashboard> =>
    apiClient.get<StaffDashboard>('/dashboard/staff').then((r) => r.data),

  getOrganizer: (): Promise<OrganizerDashboard> =>
    apiClient.get<OrganizerDashboard>('/dashboard/organizer').then((r) => r.data),
}

import apiClient from './client'
import type { Incident, IncidentCreate } from '@/types'

export const incidentsApi = {
  create: (data: IncidentCreate): Promise<Incident> =>
    apiClient.post<Incident>('/incidents/', data).then((r) => r.data),

  list: (status?: string): Promise<Incident[]> =>
    apiClient.get<Incident[]>('/incidents/', { params: status ? { status } : {} }).then((r) => r.data),

  getById: (id: number): Promise<Incident> =>
    apiClient.get<Incident>(`/incidents/${id}`).then((r) => r.data),

  update: (id: number, data: { status?: string; description?: string }): Promise<Incident> =>
    apiClient.patch<Incident>(`/incidents/${id}`, data).then((r) => r.data),
}

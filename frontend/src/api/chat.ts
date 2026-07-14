import apiClient from './client'
import type { ChatRequest, ChatResponse } from '@/types'

export const chatApi = {
  sendMessage: (data: ChatRequest): Promise<ChatResponse> =>
    apiClient.post<ChatResponse>('/chat/', data).then((r) => r.data),

  getHistory: (sessionId: string) =>
    apiClient.get<Array<{ role: string; content: string; created_at: string }>>(
      `/chat/history/${sessionId}`
    ).then((r) => r.data),
}

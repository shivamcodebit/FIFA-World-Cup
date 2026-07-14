/**
 * Chat state management for conversation history across roles.
 */
import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestedActions?: string[]
  isLoading?: boolean
}

interface ChatState {
  messages: Record<string, Message[]>  // keyed by sessionId
  isLoading: boolean

  addMessage: (sessionId: string, message: Message) => void
  updateLastMessage: (sessionId: string, content: string, suggestedActions?: string[]) => void
  clearMessages: (sessionId: string) => void
  setLoading: (loading: boolean) => void
  getMessages: (sessionId: string) => Message[]
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  isLoading: false,

  addMessage: (sessionId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: [...(state.messages[sessionId] || []), message],
      },
    })),

  updateLastMessage: (sessionId, content, suggestedActions) =>
    set((state) => {
      const msgs = [...(state.messages[sessionId] || [])]
      if (msgs.length > 0) {
        const last = msgs[msgs.length - 1]
        msgs[msgs.length - 1] = { ...last, content, suggestedActions, isLoading: false }
      }
      return { messages: { ...state.messages, [sessionId]: msgs } }
    }),

  clearMessages: (sessionId) =>
    set((state) => ({
      messages: { ...state.messages, [sessionId]: [] },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  getMessages: (sessionId) => get().messages[sessionId] || [],
}))

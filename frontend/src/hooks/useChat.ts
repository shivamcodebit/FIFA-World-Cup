/**
 * Custom hook for managing AI chat interactions.
 * Handles sending messages, loading states, and conversation history.
 */
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { chatApi } from '@/api/chat'
import { useChatStore } from '@/store/chatStore'
import { useAppStore } from '@/store/appStore'
import type { Message } from '@/store/chatStore'

export function useChat() {
  const { addMessage, updateLastMessage, setLoading, isLoading, getMessages } = useChatStore()
  const { sessionId, userRole, language } = useAppStore()

  const messages = getMessages(sessionId)

  const sendMessage = useCallback(
    async (text: string, location?: string, context?: Record<string, unknown>) => {
      if (!text.trim() || isLoading) return

      // Add user message immediately
      const userMsg: Message = {
        id: uuidv4(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      }
      addMessage(sessionId, userMsg)

      // Add placeholder assistant message
      const assistantMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      }
      addMessage(sessionId, assistantMsg)
      setLoading(true)

      try {
        // Build history from current messages (last 10 turns)
        const history = messages
          .slice(-20)
          .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

        const response = await chatApi.sendMessage({
          session_id: sessionId,
          message: text,
          user_role: userRole,
          language,
          location,
          context,
          history,
        })

        updateLastMessage(sessionId, response.reply, response.suggested_actions)
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Failed to get response'
        updateLastMessage(
          sessionId,
          `Sorry, I couldn't process your request. ${errMsg}`,
          []
        )
        toast.error('Connection issue. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [sessionId, userRole, language, isLoading, messages, addMessage, updateLastMessage, setLoading]
  )

  return { messages, sendMessage, isLoading }
}

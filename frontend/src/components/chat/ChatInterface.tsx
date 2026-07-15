/**
 * Main chat interface component.
 * Handles message rendering, input, and suggested actions.
 * Fully keyboard-navigable and screen-reader friendly.
 */
import { useEffect, useRef, useState } from 'react'
import { Send, Mic, Trash2, Bot, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useChat } from '@/hooks/useChat'
import { useChatStore } from '@/store/chatStore'
import { useAppStore } from '@/store/appStore'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Props {
  placeholder?: string
  quickPrompts?: string[]
}

export default function ChatInterface({ placeholder, quickPrompts = [] }: Props) {
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading } = useChat()
  const { clearMessages } = useChatStore()
  const { sessionId, language } = useAppStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const isRtl = language === 'ar'

  return (
    <div
      className="flex flex-col h-full bg-gray-950"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label="AI Chat Interface"
    >
      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
              <Bot className="w-8 h-8 text-blue-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200 mb-2">StadiumPilot AI</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Powered by Gemini AI. Ask me anything about the stadium, your seat, food, or any assistance you need.
            </p>

            {quickPrompts.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-md">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                    aria-label={`Quick prompt: ${prompt}`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  aria-hidden="true"
                >
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}

              <div className={clsx('max-w-[80%] flex flex-col gap-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
                <div
                  className={clsx(
                    'px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-sm'
                  )}
                  aria-label={`${msg.role === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`}
                >
                  {msg.isLoading ? (
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                      <span className="sr-only">AI is thinking...</span>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Suggested action chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1" role="group" aria-label="Suggested actions">
                    {msg.suggestedActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleQuickPrompt(action)}
                        className="text-xs bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-full transition-colors"
                        aria-label={`Suggested: ${action}`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                <time className="text-xs text-gray-600" dateTime={msg.timestamp.toISOString()}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>

              {msg.role === 'user' && (
                <div
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  aria-hidden="true"
                >
                  <User className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 p-4 bg-gray-900/50">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => clearMessages(sessionId)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-3 h-3" aria-hidden="true" />
              Clear
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Voice input placeholder */}
          <button
            className="flex-shrink-0 w-10 h-10 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Voice input"
            aria-disabled="true"
            aria-describedby="mic-desc"
            title="Voice input (coming soon)"
            onClick={(e) => e.preventDefault()}
          >
            <span id="mic-desc" className="sr-only">This feature is coming soon.</span>
            <Mic className="w-4 h-4 text-gray-500" aria-hidden="true" />
          </button>

          <div className="flex-1 relative">
            <label htmlFor="chat-input" className="sr-only">
              Chat message
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || 'Ask me anything about the stadium...'}
              rows={1}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={isLoading}
              aria-disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={clsx(
              'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              input.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Send className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-600 mt-2 text-center">
          Press Enter to send · Shift+Enter for new line · Powered by Google Gemini
        </p>
      </div>
    </div>
  )
}

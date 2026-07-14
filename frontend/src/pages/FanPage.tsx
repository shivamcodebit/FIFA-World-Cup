/**
 * Fan Assistant Page
 * AI chat interface with fan-specific quick prompts, category shortcuts,
 * and location context for richer AI responses.
 */
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Utensils, Baby, ParkingCircle, Info,
  Leaf, Accessibility, Wifi, WifiOff
} from 'lucide-react'
import ChatInterface from '@/components/chat/ChatInterface'
import { useAppStore } from '@/store/appStore'
import { useTranslation } from '@/utils/i18n'
import { useChat } from '@/hooks/useChat'

const QUICK_PROMPTS = [
  'Where is my seat? Section 102, Row 8',
  'Find nearest restroom',
  'Best vegetarian food options',
  'Parking and shuttle info',
  'I lost my child',
  'Where is the fan zone?',
  'Wheelchair accessible route to my seat',
  'Water refill station near Gate B',
  'What time does the match start?',
  'How do I get to the nearest first-aid station?',
]

const CATEGORIES: {
  icon: React.ElementType
  label: string
  prompt: string
  color: string
  bg: string
}[] = [
  {
    icon: MapPin,
    label: 'Navigate',
    prompt: 'How do I get to Section 205?',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20',
  },
  {
    icon: Utensils,
    label: 'Food & Drink',
    prompt: 'What food options are available near me? I prefer vegetarian.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20',
  },
  {
    icon: Baby,
    label: 'Lost & Found',
    prompt: 'I lost a child near the north concourse. She is about 7 years old.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20',
  },
  {
    icon: ParkingCircle,
    label: 'Parking',
    prompt: 'Where can I park and what are the shuttle bus options?',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20',
  },
  {
    icon: Info,
    label: 'Match Info',
    prompt: 'What time does the match start and where is the fan zone?',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20',
  },
  {
    icon: Leaf,
    label: 'Eco-Friendly',
    prompt: 'Where are the water refill stations and recycling bins?',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20',
  },
  {
    icon: Accessibility,
    label: 'Accessibility',
    prompt: 'I need wheelchair accessible routes and priority seating information.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20',
  },
]

export default function FanPage() {
  const { language } = useAppStore()
  const t = useTranslation(language)
  const [location, setLocation] = useState('')
  const [locationSaved, setLocationSaved] = useState(false)
  const { sendMessage } = useChat()

  const handleCategoryClick = useCallback(
    (prompt: string) => {
      sendMessage(prompt, location || undefined)
    },
    [sendMessage, location]
  )

  const handleLocationSave = () => {
    setLocationSaved(true)
    setTimeout(() => setLocationSaved(false), 2000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-5.5rem)]">
      {/* Page header */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-bold text-white">{t('fan_title')}</h1>
            <p className="text-xs text-gray-500">{t('fan_subtitle')}</p>
          </div>

          {/* Location input */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <label htmlFor="location-input" className="sr-only">
                Your current location in the stadium
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500"
                  aria-hidden="true"
                />
                <input
                  id="location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={handleLocationSave}
                  placeholder="Your location (e.g. Section 102)"
                  className="text-xs bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-600 rounded-lg pl-7 pr-3 py-1.5 w-52 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  aria-label="Enter your current location for better AI assistance"
                  aria-describedby="location-hint"
                />
              </div>
              {locationSaved && location && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-xs text-green-400"
                  role="status"
                  aria-live="polite"
                >
                  <Wifi className="w-3 h-3" aria-hidden="true" />
                  <span>Location set</span>
                </motion.span>
              )}
            </div>
          </div>
        </div>

        <p id="location-hint" className="sr-only">
          Setting your location helps the AI give you more accurate directions and recommendations
        </p>

        {/* Category quick access */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          role="toolbar"
          aria-label="Quick help categories"
        >
          {CATEGORIES.map(({ icon: Icon, label, prompt, color, bg }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCategoryClick(prompt)}
              className={`flex-shrink-0 flex items-center gap-1.5 ${bg} border text-xs px-3 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={`Ask about ${label}: ${prompt}`}
            >
              <Icon className={`w-3 h-3 ${color}`} aria-hidden="true" />
              <span className={color}>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden" aria-label="AI Fan Assistant chat">
        <ChatInterface
          placeholder={t('chat_placeholder')}
          quickPrompts={QUICK_PROMPTS}
        />
      </div>
    </div>
  )
}

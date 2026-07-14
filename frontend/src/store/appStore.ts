/**
 * Global application state using Zustand.
 * Manages accessibility settings, language, and user role.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'fan' | 'volunteer' | 'staff' | 'organizer'
export type Language = 'en' | 'es' | 'fr' | 'pt' | 'ar' | 'hi'

interface AppState {
  // User identity
  userRole: UserRole
  language: Language
  sessionId: string

  // Accessibility
  highContrast: boolean
  largeText: boolean
  screenReaderMode: boolean

  // Actions
  setUserRole: (role: UserRole) => void
  setLanguage: (lang: Language) => void
  toggleHighContrast: () => void
  toggleLargeText: () => void
  toggleScreenReaderMode: () => void
  setSessionId: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userRole: 'fan',
      language: 'en',
      sessionId: crypto.randomUUID(),
      highContrast: false,
      largeText: false,
      screenReaderMode: false,

      setUserRole: (role) => set({ userRole: role }),
      setLanguage: (lang) => set({ language: lang }),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
      toggleLargeText: () => set((s) => ({ largeText: !s.largeText })),
      toggleScreenReaderMode: () => set((s) => ({ screenReaderMode: !s.screenReaderMode })),
      setSessionId: (id) => set({ sessionId: id }),
    }),
    {
      name: 'stadiumPilot-prefs',
      partialize: (state) => ({
        language: state.language,
        highContrast: state.highContrast,
        largeText: state.largeText,
      }),
    }
  )
)

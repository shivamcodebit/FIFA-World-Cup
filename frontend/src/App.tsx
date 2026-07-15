import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'

const FanPage = lazy(() => import('@/pages/FanPage'))
const VolunteerPage = lazy(() => import('@/pages/VolunteerPage'))
const StaffPage = lazy(() => import('@/pages/StaffPage'))
const OrganizerPage = lazy(() => import('@/pages/OrganizerPage'))
const EmergencyPage = lazy(() => import('@/pages/EmergencyPage'))
const MapPage = lazy(() => import('@/pages/MapPage'))

function App() {
  const { highContrast, largeText, language } = useAppStore()

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  return (
    <div className={`${highContrast ? 'high-contrast' : ''} ${largeText ? 'large-text' : ''}`}>

      <Suspense fallback={<div className="p-6 text-center text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/fan" element={<FanPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/organizer" element={<OrganizerPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/map" element={<MapPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App

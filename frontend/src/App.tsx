import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'
import FanPage from '@/pages/FanPage'
import VolunteerPage from '@/pages/VolunteerPage'
import StaffPage from '@/pages/StaffPage'
import OrganizerPage from '@/pages/OrganizerPage'
import EmergencyPage from '@/pages/EmergencyPage'
import MapPage from '@/pages/MapPage'

function App() {
  const { highContrast, largeText } = useAppStore()

  return (
    <div className={`${highContrast ? 'high-contrast' : ''} ${largeText ? 'large-text' : ''}`}>
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
    </div>
  )
}

export default App

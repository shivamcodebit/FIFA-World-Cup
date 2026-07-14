import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import AccessibilityBar from './AccessibilityBar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <AccessibilityBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          role="main"
          aria-label="Main content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

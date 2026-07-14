import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock leaflet for tests (not available in jsdom)
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => children,
  TileLayer: () => null,
  Marker: ({ children }: { children: React.ReactNode }) => children,
  Popup: ({ children }: { children: React.ReactNode }) => children,
  useMap: () => ({ setView: vi.fn() }),
}))

vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn(),
    divIcon: vi.fn(),
    Marker: { prototype: { options: {} } },
  },
  icon: vi.fn(),
  divIcon: vi.fn(),
  Marker: { prototype: { options: {} } },
}))

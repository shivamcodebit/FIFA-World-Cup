/**
 * Stadium Map Page
 * Interactive Leaflet map with facility markers.
 */
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Search } from 'lucide-react'

// Fix Leaflet default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const FACILITY_ICONS: Record<string, string> = {
  restroom: '🚻',
  food: '🍔',
  medical: '🏥',
  atm: '💳',
  refill: '💧',
  shop: '🛍️',
  main: '🏟️',
  standard: '🚪',
  accessible: '♿',
}

const FACILITIES = [
  { id: 'gate_a', name: 'Gate A – Main Entrance', lat: 40.8135, lng: -74.0745, type: 'main', info: 'Main entrance. Open 3h before kickoff.' },
  { id: 'gate_b', name: 'Gate B – South Entrance', lat: 40.8128, lng: -74.0738, type: 'standard', info: 'South side. Currently low queue.' },
  { id: 'gate_c', name: 'Gate C – North Entrance', lat: 40.8142, lng: -74.0752, type: 'standard', info: 'North side. Busy – 15 min queue.' },
  { id: 'gate_d', name: 'Gate D – Accessible', lat: 40.8120, lng: -74.0760, type: 'accessible', info: 'Wheelchair accessible. Priority entry.' },
  { id: 'restroom_w1', name: 'Restrooms West L1', lat: 40.8133, lng: -74.0748, type: 'restroom', info: 'West side, Level 1. Queue: 45 people.' },
  { id: 'restroom_e1', name: 'Restrooms East L1', lat: 40.8130, lng: -74.0740, type: 'restroom', info: 'East side, Level 1. Short queue.' },
  { id: 'food_north', name: 'Food Court North', lat: 40.8140, lng: -74.0745, type: 'food', info: 'Full menu. 20 min wait. Vegetarian options available.' },
  { id: 'food_south', name: 'Food Court South', lat: 40.8125, lng: -74.0745, type: 'food', info: 'Quick service. 5 min wait. Halal certified.' },
  { id: 'firstaid_1', name: 'First Aid Station 1', lat: 40.8135, lng: -74.0750, type: 'medical', info: '24/7 medical staff on site.' },
  { id: 'atm_1', name: 'ATM – Gate A Lobby', lat: 40.8136, lng: -74.0746, type: 'atm', info: 'Multi-currency ATM available.' },
  { id: 'refill_1', name: 'Water Refill Station', lat: 40.8138, lng: -74.0744, type: 'refill', info: 'Free water refill. Bring your bottle. 🌱' },
  { id: 'shop_1', name: 'Official Merchandise', lat: 40.8132, lng: -74.0743, type: 'shop', info: 'Official FIFA World Cup 2026 merchandise.' },
]

type FilterType = 'all' | 'restroom' | 'food' | 'medical' | 'atm' | 'refill' | 'shop' | 'gate'

const FILTER_OPTIONS: { value: FilterType; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🗺️' },
  { value: 'gate', label: 'Gates', emoji: '🚪' },
  { value: 'restroom', label: 'Restrooms', emoji: '🚻' },
  { value: 'food', label: 'Food', emoji: '🍔' },
  { value: 'medical', label: 'Medical', emoji: '🏥' },
  { value: 'atm', label: 'ATM', emoji: '💳' },
  { value: 'refill', label: 'Refill', emoji: '💧' },
  { value: 'shop', label: 'Shop', emoji: '🛍️' },
]

function createEmojiMarker(emoji: string) {
  return L.divIcon({
    html: `<div style="font-size:22px;line-height:1;">${emoji}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

export default function MapPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')

  const filtered = FACILITIES.filter((f) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'gate' && ['main', 'standard', 'accessible'].includes(f.type)) ||
      f.type === filter
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-5.5rem)]" id="main-content">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3">
        <h1 className="text-lg font-bold text-white mb-2">Stadium Map – MetLife Stadium</h1>

        {/* Search */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <label htmlFor="map-search" className="sr-only">Search facilities</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <input
              id="map-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search facilities..."
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter facilities by type">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex-shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filter === opt.value
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
              aria-pressed={filter === opt.value}
              aria-label={`Filter: ${opt.label}`}
            >
              <span aria-hidden="true">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1" role="region" aria-label="Interactive stadium map">
        <MapContainer
          center={[40.8133, -74.0746]}
          zoom={17}
          style={{ height: '100%', width: '100%' }}
          aria-label="Stadium facility map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          {filtered.map((facility) => (
            <Marker
              key={facility.id}
              position={[facility.lat, facility.lng]}
              icon={createEmojiMarker(FACILITY_ICONS[facility.type] || '📍')}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{facility.name}</strong>
                  <p className="text-gray-600 mt-1">{facility.info}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

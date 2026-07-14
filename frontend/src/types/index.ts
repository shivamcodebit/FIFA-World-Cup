/**
 * Shared TypeScript types for StadiumPilot AI frontend.
 */

export type UserRole = 'fan' | 'volunteer' | 'staff' | 'organizer'
export type Language = 'en' | 'es' | 'fr' | 'pt' | 'ar' | 'hi'
export type IncidentType = 'medical' | 'fire' | 'lost_child' | 'security' | 'suspicious' | 'other'
export type IncidentStatus = 'open' | 'in_progress' | 'resolved'
export type AlertLevel = 'green' | 'yellow' | 'red'

// ──────────────────────────────────────────────
// Chat Types
// ──────────────────────────────────────────────
export interface ChatHistoryItem {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  session_id: string
  message: string
  user_role: UserRole
  language: Language
  location?: string
  context?: Record<string, unknown>
  history: ChatHistoryItem[]
}

export interface ChatResponse {
  session_id: string
  reply: string
  language: Language
  suggested_actions: string[]
  created_at: string
}

// ──────────────────────────────────────────────
// Incident Types
// ──────────────────────────────────────────────
export interface IncidentCreate {
  type: IncidentType
  location: string
  description: string
  reporter_role: UserRole
}

export interface Incident {
  id: number
  type: IncidentType
  status: IncidentStatus
  location: string
  description: string
  reporter_role: UserRole
  ai_summary: string | null
  created_at: string
  updated_at: string
}

// ──────────────────────────────────────────────
// Crowd Types
// ──────────────────────────────────────────────
export interface CrowdZone {
  id: number
  zone_id: string
  zone_name: string
  capacity: number
  current_count: number
  density_pct: number
  queue_length: number
  timestamp: string
}

export interface CrowdSummary {
  snapshots: CrowdZone[]
  ai_summary: string
  hotspots: string[]
  recommendations: string[]
  overall_density: number
  generated_at: string
}

// ──────────────────────────────────────────────
// Dashboard Types
// ──────────────────────────────────────────────
export interface ZoneStatus {
  zone_id: string
  zone_name: string
  density_pct: number
  queue_length: number
  alert_level: AlertLevel
}

export interface StaffDashboard {
  zones: ZoneStatus[]
  crowd_summary: string
  cleaning_priorities: string[]
  water_refill_alerts: string[]
  security_alerts: string[]
  ai_insights: string
}

export interface OrganizerDashboard {
  zones: ZoneStatus[]
  crowd_distribution_analysis: string
  gate_optimization: string[]
  staff_allocation: string[]
  transport_recommendations: string[]
  stadium_health_summary: string
  decision_support: string
}

// ──────────────────────────────────────────────
// Map Types
// ──────────────────────────────────────────────
export interface MapFacility {
  id: string
  name: string
  lat: number
  lng: number
  type: 'restroom' | 'food' | 'medical' | 'atm' | 'refill' | 'shop' | 'exit'
}

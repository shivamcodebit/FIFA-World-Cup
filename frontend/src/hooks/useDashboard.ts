/**
 * Hook for fetching dashboard data with auto-refresh.
 */
import { useState, useEffect, useCallback } from 'react'
import { dashboardApi } from '@/api/dashboard'
import { crowdApi } from '@/api/crowd'
import type { StaffDashboard, OrganizerDashboard, CrowdSummary } from '@/types'

export function useStaffDashboard(refreshInterval = 30000) {
  const [data, setData] = useState<StaffDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const result = await dashboardApi.getStaff()
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, refreshInterval)
    return () => clearInterval(interval)
  }, [fetch, refreshInterval])

  return { data, loading, error, refetch: fetch }
}

export function useOrganizerDashboard(refreshInterval = 30000) {
  const [data, setData] = useState<OrganizerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const result = await dashboardApi.getOrganizer()
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, refreshInterval)
    return () => clearInterval(interval)
  }, [fetch, refreshInterval])

  return { data, loading, error, refetch: fetch }
}

export function useCrowdSummary() {
  const [data, setData] = useState<CrowdSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const result = await crowdApi.getSummary()
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load crowd data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

import { describe, it, expect, vi } from 'vitest'
import {
  getDensityColor,
  getDensityBg,
  getAlertLabel,
  formatNumber,
  truncate,
  incidentTypeLabel,
  incidentStatusClass,
  formatTime,
} from '@/utils/helpers'

describe('getDensityColor', () => {
  it('returns red for density >= 85', () => {
    expect(getDensityColor(85)).toBe('text-red-400')
    expect(getDensityColor(100)).toBe('text-red-400')
  })
  it('returns yellow for density >= 65 and < 85', () => {
    expect(getDensityColor(65)).toBe('text-yellow-400')
    expect(getDensityColor(84)).toBe('text-yellow-400')
  })
  it('returns green for density < 65', () => {
    expect(getDensityColor(0)).toBe('text-green-400')
    expect(getDensityColor(64)).toBe('text-green-400')
  })
  it('handles edge cases at threshold boundaries', () => {
    expect(getDensityColor(84.9)).toBe('text-yellow-400')
    expect(getDensityColor(85.0)).toBe('text-red-400')
    expect(getDensityColor(64.9)).toBe('text-green-400')
    expect(getDensityColor(65.0)).toBe('text-yellow-400')
  })
})

describe('getDensityBg', () => {
  it('returns red background for high density', () => {
    expect(getDensityBg(90)).toContain('red')
  })
  it('returns yellow background for medium density', () => {
    expect(getDensityBg(70)).toContain('yellow')
  })
  it('returns green background for low density', () => {
    expect(getDensityBg(40)).toContain('green')
  })
})

describe('getAlertLabel', () => {
  it('returns correct labels', () => {
    expect(getAlertLabel('green')).toBe('Normal')
    expect(getAlertLabel('yellow')).toBe('Busy')
    expect(getAlertLabel('red')).toBe('Critical')
  })
  it('returns level itself for unknown levels', () => {
    expect(getAlertLabel('unknown')).toBe('unknown')
  })
})

describe('formatNumber', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(82500)).toBe('82,500')
  })
  it('handles small numbers', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(999)).toBe('999')
  })
  it('handles large numbers', () => {
    expect(formatNumber(1000000)).toBe('1,000,000')
  })
})

describe('truncate', () => {
  it('returns original if within limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })
  it('truncates and adds ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello…')
  })
  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
  it('uses default max length of 100', () => {
    const longStr = 'a'.repeat(101)
    const result = truncate(longStr)
    expect(result.length).toBe(101) // 100 chars + ellipsis
    expect(result.endsWith('…')).toBe(true)
  })
})

describe('incidentTypeLabel', () => {
  it('returns correct labels', () => {
    expect(incidentTypeLabel('medical')).toContain('Medical')
    expect(incidentTypeLabel('fire')).toContain('Fire')
    expect(incidentTypeLabel('lost_child')).toContain('Lost Child')
    expect(incidentTypeLabel('security')).toContain('Security')
    expect(incidentTypeLabel('suspicious')).toContain('Suspicious')
    expect(incidentTypeLabel('other')).toContain('Other')
  })
  it('returns type itself for unknown types', () => {
    expect(incidentTypeLabel('unknown_type')).toBe('unknown_type')
  })
})

describe('incidentStatusClass', () => {
  it('returns red class for open', () => {
    expect(incidentStatusClass('open')).toContain('red')
  })
  it('returns yellow class for in_progress', () => {
    expect(incidentStatusClass('in_progress')).toContain('yellow')
  })
  it('returns green class for resolved', () => {
    expect(incidentStatusClass('resolved')).toContain('green')
  })
  it('returns gray class for unknown status', () => {
    expect(incidentStatusClass('unknown')).toContain('gray')
  })
})

describe('formatTime', () => {
  it('formats ISO datetime to HH:MM', () => {
    // Test that function returns a string with time format
    const result = formatTime('2026-07-14T15:30:00Z')
    expect(typeof result).toBe('string')
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })
})

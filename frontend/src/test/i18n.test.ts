import { describe, it, expect } from 'vitest'
import { useTranslation, LANGUAGE_OPTIONS } from '@/utils/i18n'

describe('useTranslation', () => {
  it('returns English translations by default', () => {
    const t = useTranslation('en')
    expect(t('fan_title')).toBe('Fan Assistant')
    expect(t('send')).toBe('Send')
  })

  it('returns Spanish translations', () => {
    const t = useTranslation('es')
    expect(t('fan_title')).toBe('Asistente de Fan')
    expect(t('send')).toBe('Enviar')
  })

  it('returns French translations', () => {
    const t = useTranslation('fr')
    expect(t('send')).toBe('Envoyer')
  })

  it('falls back to key if not found', () => {
    const t = useTranslation('en')
    expect(t('nonexistent_key')).toBe('nonexistent_key')
  })
})

describe('LANGUAGE_OPTIONS', () => {
  it('includes all 6 required languages', () => {
    const codes = LANGUAGE_OPTIONS.map((l) => l.value)
    expect(codes).toContain('en')
    expect(codes).toContain('es')
    expect(codes).toContain('fr')
    expect(codes).toContain('pt')
    expect(codes).toContain('ar')
    expect(codes).toContain('hi')
    expect(codes).toHaveLength(6)
  })
})

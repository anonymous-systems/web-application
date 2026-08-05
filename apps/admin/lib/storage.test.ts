// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  extensionOf,
  isStorageEmulator,
  safeObjectName,
  storageDownloadUrl,
  storageEmulatorHost,
} from './storage'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('safeObjectName', () => {
  it('keeps an ordinary file name', () => {
    expect(safeObjectName('report.pdf')).toBe('report.pdf')
  })

  it('reduces a path to its basename so an upload cannot escape its folder', () => {
    expect(safeObjectName('../../secrets.env')).toBe('secrets.env')
    expect(safeObjectName('nested/dir/report.pdf')).toBe('report.pdf')
    expect(safeObjectName('C:\\Users\\aaron\\report.pdf')).toBe('report.pdf')
  })

  it('strips characters that would break out of a Content-Disposition header', () => {
    expect(safeObjectName('in"jected.txt')).toBe('injected.txt')
    expect(safeObjectName('two\r\nlines.txt')).toBe('twolines.txt')
    expect(safeObjectName('x"\r\nX-Evil: 1.txt')).toBe('xX-Evil: 1.txt')
  })

  it('rejects names left unusable, so callers surface an error', () => {
    expect(safeObjectName('')).toBe('')
    expect(safeObjectName('   ')).toBe('')
    expect(safeObjectName('..')).toBe('')
    expect(safeObjectName('foo/..')).toBe('')
    expect(safeObjectName('"')).toBe('')
  })
})

describe('extensionOf', () => {
  it('lowercases a recognisable extension', () => {
    expect(extensionOf('Cover.PNG')).toBe('.png')
    expect(extensionOf('archive.tar.gz')).toBe('.gz')
  })

  it('returns empty when there is nothing safe to carry over', () => {
    expect(extensionOf('no-extension')).toBe('')
    expect(extensionOf('cover.p"g')).toBe('')
    expect(extensionOf('cover./etc/passwd')).toBe('')
  })
})

describe('storageEmulatorHost', () => {
  it('is null when no emulator is configured', () => {
    vi.stubEnv('FIREBASE_STORAGE_EMULATOR_HOST', undefined)
    vi.stubEnv('STORAGE_EMULATOR_HOST', undefined)

    expect(storageEmulatorHost()).toBeNull()
    expect(isStorageEmulator()).toBe(false)
  })

  it('accepts the bare host set by hand in .env.local', () => {
    vi.stubEnv('FIREBASE_STORAGE_EMULATOR_HOST', '127.0.0.1:9199')
    vi.stubEnv('STORAGE_EMULATOR_HOST', undefined)

    expect(storageEmulatorHost()).toBe('127.0.0.1:9199')
    expect(isStorageEmulator()).toBe(true)
  })

  it('accepts the scheme-prefixed host exported by emulators:exec', () => {
    vi.stubEnv('FIREBASE_STORAGE_EMULATOR_HOST', undefined)
    vi.stubEnv('STORAGE_EMULATOR_HOST', 'http://127.0.0.1:9199')

    expect(storageEmulatorHost()).toBe('127.0.0.1:9199')
    expect(isStorageEmulator()).toBe(true)
  })
})

describe('storageDownloadUrl', () => {
  it('points at the emulator whichever variable names it', () => {
    for (const variable of [
      'FIREBASE_STORAGE_EMULATOR_HOST',
      'STORAGE_EMULATOR_HOST',
    ]) {
      vi.stubEnv('FIREBASE_STORAGE_EMULATOR_HOST', undefined)
      vi.stubEnv('STORAGE_EMULATOR_HOST', undefined)
      vi.stubEnv(variable, '127.0.0.1:9199')

      const url = storageDownloadUrl('fm-e2e/hello.txt', 'tok')

      expect(url).toContain('http://127.0.0.1:9199/')
      expect(url).not.toContain('firebasestorage.googleapis.com')
    }
  })

  it('points at Firebase and encodes the path when no emulator is set', () => {
    vi.stubEnv('FIREBASE_STORAGE_EMULATOR_HOST', undefined)
    vi.stubEnv('STORAGE_EMULATOR_HOST', undefined)

    const url = storageDownloadUrl('story-covers/a b.png', 'tok')

    expect(url).toContain('https://firebasestorage.googleapis.com/')
    expect(url).toContain('/o/story-covers%2Fa%20b.png?alt=media&token=tok')
  })
})

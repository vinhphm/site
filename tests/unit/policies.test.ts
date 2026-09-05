import { describe, expect, test } from 'bun:test'
import { httpUrl, parseEmbed, embedHeight } from '../../src/utils/embed'
import { readEnvironment } from '../../src/utils/environment'

describe('embed boundary', () => {
  test('resize messages are typed, finite, and bounded', () => {
    for (const height of [NaN, Infinity, -1, 0, '400']) {
      expect(embedHeight({ type: 'vinh:embed-size', height })).toBeNull()
    }
    expect(embedHeight({ type: 'other', height: 400 })).toBeNull()
    expect(embedHeight({ type: 'vinh:embed-size', height: 1 })).toBe(120)
    expect(embedHeight({ type: 'vinh:embed-size', height: 9000 })).toBe(2000)
  })
  test('rejects executable and relative URLs', () => {
    for (const value of [
      'javascript:alert(1)',
      'data:text/html,test',
      '/relative',
      null,
    ]) {
      expect(httpUrl(value)).toBeNull()
    }
  })
  test('validates response types and required fields', () => {
    expect(parseEmbed({ type: 'photo', url: 'javascript:alert(1)' })).toBeNull()
    expect(parseEmbed({ type: 'rich', html: 4 })).toBeNull()
    expect(
      parseEmbed({
        type: 'link',
        url: 'https://example.com',
        title: '<script>',
      })
    ).toEqual({ type: 'link', url: 'https://example.com/', title: '<script>' })
  })
})

test('configuration fails early with actionable errors', () => {
  expect(() => readEnvironment({})).toThrow('PUBLIC_EMAIL')
  const env = {
    PUBLIC_EMAIL: 'test@example.com',
    PUBLIC_WORKER_HOST: 'https://example.com/',
  }
  expect(readEnvironment(env)).toEqual({
    email: 'test@example.com',
    workerHost: 'https://example.com',
    cipherShift: 13,
  })
  expect(() =>
    readEnvironment({ ...env, PUBLIC_CIPHER_SHIFT: 'oops' })
  ).toThrow('PUBLIC_CIPHER_SHIFT')
  expect(() =>
    readEnvironment({ ...env, PUBLIC_WORKER_HOST: 'javascript:alert(1)' })
  ).toThrow('PUBLIC_WORKER_HOST')
})

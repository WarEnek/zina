import { expect, test } from 'bun:test'
import { buildOddsPresentation } from './oddsPresentation'

test('treats all-zero odds as uninitialized', () => {
  const result = buildOddsPresentation({
    weights: [0, 0, 0, 0, 0, 0, 0, 0],
    oddsHash: null,
    oddsUpdatedAt: null,
  })

  expect(result.status).toBe('uninitialized')
  expect(result.summary).toBe('Odds feed is not initialized on this network')
  expect(result.rows[0]).toMatchObject({
    name: 'Vanilla Cookie',
    weight: 0,
    percentText: '0.00%',
  })
  expect(result.hashText).toBe('n/a')
  expect(result.updatedAtText).toBe('Unknown')
})

test('formats live odds metadata for a configured feed', () => {
  const result = buildOddsPresentation({
    weights: [1, 1, 2, 0, 0, 0, 0, 0],
    oddsHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    oddsUpdatedAt: BigInt(Math.floor(Date.parse('2024-06-01T12:34:00Z') / 1000)),
  })

  expect(result.status).toBe('ready')
  expect(result.summary).toBe('Odds feed is live on this network')
  expect(result.rows[2]).toMatchObject({
    name: 'Chocolate Cookie',
    weight: 2,
    percentText: '50.00%',
  })
  expect(result.hashText).toBe('0x12345678…cdef')
  expect(result.updatedAtText).toBe('Jun 1, 2024, 12:34 PM UTC')
})

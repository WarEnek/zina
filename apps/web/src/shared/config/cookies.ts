export type CookieRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'

export type CookieMeta = {
  tokenId: number
  name: string
  rarity: CookieRarity
}

export const COOKIE_CATALOG: CookieMeta[] = [
  { tokenId: 1, name: 'Vanilla Cookie', rarity: 'Common' },
  { tokenId: 2, name: 'Oat Cookie', rarity: 'Common' },
  { tokenId: 3, name: 'Chocolate Cookie', rarity: 'Rare' },
  { tokenId: 4, name: 'Strawberry Cookie', rarity: 'Rare' },
  { tokenId: 5, name: 'Lava Cookie', rarity: 'Epic' },
  { tokenId: 6, name: 'Macaron Cookie', rarity: 'Epic' },
  { tokenId: 7, name: 'Golden Cookie', rarity: 'Legendary' },
  { tokenId: 8, name: 'Cosmic Cookie', rarity: 'Mythic' },
]

export const RARITY_ORDER: CookieRarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic']

export const RARITY_BY_INDEX: CookieRarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic']

export function getRarityByIndex(index: number): CookieRarity | 'Unknown' {
  return RARITY_BY_INDEX[index] ?? 'Unknown'
}

export function getCookieMetaByTokenId(tokenId: number): CookieMeta | undefined {
  return COOKIE_CATALOG.find((cookie) => cookie.tokenId === tokenId)
}

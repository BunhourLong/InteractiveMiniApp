import type { Product, PublicProduct } from '../types/product'

/**
 * Strips internal fields at runtime, not just in the types, so they never
 * reach a card's props (or show up in React DevTools).
 */
export function toPublicProduct({ cost: _cost, ...publicProduct }: Product): PublicProduct {
  return publicProduct
}

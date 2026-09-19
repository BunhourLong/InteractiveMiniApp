import type { Product } from '../types/product'

export const PRODUCTS_URL = '/api/products.json'

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { signal })
  if (!response.ok) {
    throw new Error(`GET ${PRODUCTS_URL} failed with status ${response.status}`)
  }
  return response.json()
}

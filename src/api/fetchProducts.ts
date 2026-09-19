import type { Product } from '../types/product'

export const PRODUCTS_URL = '/api/prodcuts.json'

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { signal })
  if (!response.ok) {
    throw new Error(`GET ${PRODUCTS_URL} failed with status ${response.status}`)
  }
  // response.json() is typed `any`, which would switch type checking off for
  // everything downstream. Treat it as unknown until the shape is proven.
  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error(`GET ${PRODUCTS_URL} did not return a list of products`)
  }
  return data
}

function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'price' in value &&
    typeof value.price === 'number' &&
    'cost' in value &&
    typeof value.cost === 'number' &&
    'inStock' in value &&
    typeof value.inStock === 'boolean' &&
    'onSale' in value &&
    typeof value.onSale === 'boolean'
  )
}

export interface Product {
  id: string
  name: string
  price: number
  /** Internal: what the store pays the supplier. Never shown to shoppers. */
  cost: number
  inStock: boolean
  onSale: boolean
}

/** What shopper-facing components receive: a Product without its internal fields. */
export type PublicProduct = Omit<Product, 'cost'>

/** The fields a person enters in the "Add product" form. The catalog sets the rest. */
export type NewProduct = Pick<Product, 'name' | 'price' | 'cost'>

export type ProductField = keyof NewProduct

/**
 * The form while it is being filled in. A field the user hasn't touched yet is
 * missing, and every value stays a string until validation accepts it.
 */
export type ProductDraft = Partial<Record<ProductField, string>>

/** One optional message per form field. An empty object means the draft is valid. */
export type ProductFormErrors = Partial<Record<ProductField, string>>

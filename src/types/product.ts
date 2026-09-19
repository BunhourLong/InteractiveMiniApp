export interface Product {
  id: string
  name: string
  price: number
  inStock: boolean
  onSale: boolean
}

/** What the form hands to the catalog once validation passes. */
export interface NewProduct {
  name: string
  price: number
}

/** Raw input values; price stays a string until it has been validated. */
export interface ProductFormData {
  name: string
  price: string
}

/** One optional message per form field; an empty object means valid. */
export interface ProductFormErrors {
  name?: string
  price?: string
}

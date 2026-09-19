import type { ProductFormData, ProductFormErrors } from '../types/product'

/**
 * Validates the "Add product" form values.
 *
 * Pure function: it reads the form data and returns a brand-new errors object.
 * It never mutates its input, never touches React state, and never calls
 * alert() — the caller passes the result to setErrors so the messages render
 * inline next to each field. An empty object means the form is valid.
 */
export function validateProduct(form: ProductFormData): ProductFormErrors {
  const errors: ProductFormErrors = {}
  const name = form.name.trim()
  const price = form.price.trim()

  if (name === '') {
    errors.name = 'Name is required.'
  }

  if (price === '') {
    errors.price = 'Price is required.'
  } else if (!Number.isFinite(Number(price))) {
    errors.price = 'Price must be a number.'
  } else if (Number(price) < 0) {
    errors.price = 'Price cannot be negative.'
  }

  return errors
}

import type { ProductDraft, ProductFormErrors } from '../types/product'

/**
 * Validates the "Add product" form values.
 *
 * Pure function: it reads the draft and returns a brand-new errors object.
 * It never mutates its input, never touches React state, and never calls
 * alert() — the caller passes the result to setErrors so the messages render
 * inline next to each field. An empty object means the form is valid.
 */
export function validateProduct(draft: ProductDraft): ProductFormErrors {
  const errors: ProductFormErrors = {}
  const name = draft.name?.trim() ?? ''

  if (name === '') {
    errors.name = 'Name is required.'
  }

  const priceError = validateAmount('Price', draft.price)
  if (priceError !== undefined) {
    errors.price = priceError
  }

  const costError = validateAmount('Cost', draft.cost)
  if (costError !== undefined) {
    errors.cost = costError
  }

  return errors
}

/** Checks a money field that is still raw text; returns an error message or undefined. */
function validateAmount(label: string, raw: string | undefined): string | undefined {
  const value = raw?.trim() ?? ''

  if (value === '') {
    return `${label} is required.`
  } else if (!Number.isFinite(Number(value))) {
    return `${label} must be a number.`
  } else if (Number(value) < 0) {
    return `${label} cannot be negative.`
  }
  return undefined
}

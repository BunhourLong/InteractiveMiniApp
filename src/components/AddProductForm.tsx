import { useState } from 'react'
import type * as React from 'react'
import type { NewProduct, ProductDraft, ProductField, ProductFormErrors } from '../types/product'
import { validateProduct } from '../utils/validateProduct'
import TextField from './TextField'

interface AddProductFormProps {
  onAdd: (product: NewProduct) => void
}

export default function AddProductForm({ onAdd }: AddProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>({})
  const [errors, setErrors] = useState<ProductFormErrors>({})

  // One handler per field, keyed by a real form field name, so a typo like
  // handleChange('prcie') is a compile error instead of a silent no-op.
  function handleChange(field: ProductField) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      setDraft((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const validationErrors = validateProduct(draft)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    onAdd({
      name: draft.name?.trim() ?? '',
      price: Number(draft.price ?? ''),
      cost: Number(draft.cost ?? ''),
    })
    setDraft({})
  }

  // A draft field is undefined until it is typed in. `?? ''` keeps every input
  // controlled; passing value={undefined} would make React treat it as uncontrolled.
  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <h2>Add product</h2>

      <TextField
        id="product-name"
        name="name"
        label="Name"
        placeholder="e.g. Desk Lamp"
        value={draft.name ?? ''}
        onChange={handleChange('name')}
        error={errors.name}
      />
      <TextField
        id="product-price"
        name="price"
        label="Price (USD)"
        inputMode="decimal"
        placeholder="e.g. 24.99"
        value={draft.price ?? ''}
        onChange={handleChange('price')}
        error={errors.price}
      />
      <TextField
        id="product-cost"
        name="cost"
        label="Cost (USD, internal)"
        inputMode="decimal"
        placeholder="e.g. 11.40"
        value={draft.cost ?? ''}
        onChange={handleChange('cost')}
        error={errors.cost}
      />

      <button type="submit" className="submit-button">
        Add product
      </button>
    </form>
  )
}

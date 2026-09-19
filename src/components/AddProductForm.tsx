import { useState } from 'react'
import type * as React from 'react'
import type { NewProduct, ProductFormData, ProductFormErrors } from '../types/product'
import { validateProduct } from '../utils/validateProduct'

interface AddProductFormProps {
  onAdd: (product: NewProduct) => void
}

const emptyForm: ProductFormData = { name: '', price: '' }

export default function AddProductForm({ onAdd }: AddProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm)
  const [errors, setErrors] = useState<ProductFormErrors>({})

  // One handler per field, keyed by a real form field name, so a typo like
  // handleChange('prcie') is a compile error instead of a silent no-op.
  function handleChange(field: keyof ProductFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      setForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const validationErrors = validateProduct(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    onAdd({ name: form.name.trim(), price: Number(form.price) })
    setForm(emptyForm)
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <h2>Add product</h2>

      <div className="field">
        <label htmlFor="product-name">Name</label>
        <input
          id="product-name"
          name="name"
          type="text"
          placeholder="e.g. Desk Lamp"
          value={form.name}
          onChange={handleChange('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'product-name-error' : undefined}
        />
        {errors.name && (
          <p id="product-name-error" className="field-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="product-price">Price (USD)</label>
        <input
          id="product-price"
          name="price"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 24.99"
          value={form.price}
          onChange={handleChange('price')}
          aria-invalid={Boolean(errors.price)}
          aria-describedby={errors.price ? 'product-price-error' : undefined}
        />
        {errors.price && (
          <p id="product-price-error" className="field-error">
            {errors.price}
          </p>
        )}
      </div>

      <button type="submit" className="submit-button">
        Add product
      </button>
    </form>
  )
}

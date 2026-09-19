import { useState } from 'react'
import { validateProduct } from '../utils/validateProduct'

const emptyForm = { name: '', price: '' }

export default function AddProductForm({ onAdd }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
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
          onChange={handleChange}
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
          onChange={handleChange}
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

import { useState } from 'react'
import AddProductForm from './components/AddProductForm'
import ProductGrid from './components/ProductGrid'
import { initialProducts } from './data/products'
import type { NewProduct, Product } from './types/product'
import './App.css'

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [inStockOnly, setInStockOnly] = useState(false)

  const visibleProducts = inStockOnly ? products.filter((product) => product.inStock) : products
  const saleCount = visibleProducts.filter((product) => product.onSale).length

  function handleAddProduct(newProduct: NewProduct) {
    setProducts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...newProduct, inStock: true, onSale: false },
    ])
  }

  function handleToggleSale(id: string) {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, onSale: !product.onSale } : product)),
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Catalog</h1>
        <p className="product-count">
          {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
        </p>
        {saleCount > 0 && <span className="sale-counter">{saleCount} on sale</span>}
      </header>

      <div className="layout">
        <main>
          <label className="filter">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In stock only
          </label>
          <ProductGrid products={visibleProducts} onToggleSale={handleToggleSale} />
        </main>

        <aside>
          <AddProductForm onAdd={handleAddProduct} />
        </aside>
      </div>
    </div>
  )
}

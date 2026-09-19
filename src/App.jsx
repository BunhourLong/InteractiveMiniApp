import { useState } from 'react'
import ProductGrid from './components/ProductGrid'
import { initialProducts } from './data/products'
import './App.css'

export default function App() {
  const [products, setProducts] = useState(initialProducts)
  const [inStockOnly, setInStockOnly] = useState(false)

  const visibleProducts = inStockOnly ? products.filter((product) => product.inStock) : products
  const saleCount = visibleProducts.filter((product) => product.onSale).length

  function handleToggleSale(id) {
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

      <label className="filter">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
        />
        In stock only
      </label>

      <main>
        <ProductGrid products={visibleProducts} onToggleSale={handleToggleSale} />
      </main>
    </div>
  )
}

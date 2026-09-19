import { useEffect, useState } from 'react'
import type * as React from 'react'
import { fetchProducts } from './api/fetchProducts'
import AddProductForm from './components/AddProductForm'
import ProductGrid from './components/ProductGrid'
import type { NewProduct, Product } from './types/product'
import { toPublicProduct } from './utils/toPublicProduct'
import './App.css'

type LoadStatus = 'loading' | 'ready' | 'error'

export default function App() {
  const [products, setProducts] = useState<Product[]>(null!)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchProducts(controller.signal)
      .then((loaded) => {
        setProducts(loaded)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error(error)
        setStatus('error')
      })
    return () => controller.abort()
  }, [])

  const publicProducts = products.map(toPublicProduct)
  const visibleProducts = inStockOnly
    ? publicProducts.filter((product) => product.inStock)
    : publicProducts
  const saleCount = visibleProducts.filter((product) => product.onSale).length

  function handleInStockChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInStockOnly(e.target.checked)
  }

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
        {status === 'ready' && (
          <p className="product-count">
            {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
          </p>
        )}
        {saleCount > 0 && <span className="sale-counter">{saleCount} on sale</span>}
      </header>

      <div className="layout">
        <main>
          {status === 'loading' && <p className="status">Loading products…</p>}
          {status === 'error' && (
            <p className="status status-error" role="alert">
              Couldn’t load products. Check your connection and reload the page.
            </p>
          )}
          {status === 'ready' && (
            <>
              <label className="filter">
                <input type="checkbox" checked={inStockOnly} onChange={handleInStockChange} />
                In stock only
              </label>
              <ProductGrid products={visibleProducts} onToggleSale={handleToggleSale} />
            </>
          )}
        </main>

        <aside>
          <AddProductForm onAdd={handleAddProduct} />
        </aside>
      </div>
    </div>
  )
}

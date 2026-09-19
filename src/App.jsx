import ProductGrid from './components/ProductGrid'
import { initialProducts } from './data/products'
import './App.css'

export default function App() {
  const products = initialProducts

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Catalog</h1>
        <p className="product-count">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </header>

      <main>
        <ProductGrid products={products} />
      </main>
    </div>
  )
}

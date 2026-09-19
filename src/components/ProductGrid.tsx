import type { Product } from '../types/product'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onToggleSale: (id: string) => void
}

export default function ProductGrid({ products, onToggleSale }: ProductGridProps) {
  return products.length === 0 ? (
    <p className="empty-state">No products match this filter.</p>
  ) : (
    <ul className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onToggleSale={onToggleSale} />
      ))}
    </ul>
  )
}

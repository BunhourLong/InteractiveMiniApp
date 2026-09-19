import ProductCard from './ProductCard'

export default function ProductGrid({ products, onToggleSale }) {
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

import { formatPrice } from '../utils/formatPrice'

export default function ProductCard({ product, onToggleSale }) {
  return (
    <li className="product-card">
      <div className="badges">
        <span className={product.inStock ? 'badge badge-in-stock' : 'badge badge-sold-out'}>
          {product.inStock ? 'In stock' : 'Sold out'}
        </span>
        {product.onSale && <span className="badge badge-sale">Sale</span>}
      </div>
      <h2 className="product-name">{product.name}</h2>
      <p className="product-price">{formatPrice(product.price)}</p>
      <button
        type="button"
        className="sale-toggle"
        aria-pressed={product.onSale}
        onClick={() => onToggleSale(product.id)}
      >
        {product.onSale ? 'Remove from sale' : 'Put on sale'}
      </button>
    </li>
  )
}

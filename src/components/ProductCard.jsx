import { formatPrice } from '../utils/formatPrice'

export default function ProductCard({ product }) {
  return (
    <li className="product-card">
      <span className={product.inStock ? 'badge badge-in-stock' : 'badge badge-sold-out'}>
        {product.inStock ? 'In stock' : 'Sold out'}
      </span>
      <h2 className="product-name">{product.name}</h2>
      <p className="product-price">{formatPrice(product.price)}</p>
    </li>
  )
}

import type { StorefrontSettings } from '../config/storefront'
import type { PublicProduct } from '../types/product'
import { formatPrice } from '../utils/formatPrice'

// The settings are optional on a card (no discount by default), but their
// names come from StorefrontSettings, so the two can't drift apart.
interface ProductCardProps extends Partial<StorefrontSettings> {
  product: PublicProduct
  onToggleSale: (id: string) => void
}

export default function ProductCard({ product, onToggleSale, saleDiscount }: ProductCardProps) {
  const discount = product.onSale ? (saleDiscount ?? 0) : 0
  const price = product.price * (1 - discount)

  return (
    <li className="product-card">
      <div className="badges">
        <span className={product.inStock ? 'badge badge-in-stock' : 'badge badge-sold-out'}>
          {product.inStock ? 'In stock' : 'Sold out'}
        </span>
        {product.onSale && <span className="badge badge-sale">Sale</span>}
      </div>
      <h2 className="product-name">{product.name}</h2>
      <p className="product-price">
        {formatPrice(price)}
        {discount > 0 && <s className="product-price-was">{formatPrice(product.price)}</s>}
      </p>
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

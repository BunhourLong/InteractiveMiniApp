/** Store-wide display settings, passed through to every product card. */
export interface StorefrontSettings {
  /** Fraction taken off the price of items on sale (0.2 = 20% off). */
  saleDiscount: number
}

// `satisfies` checks this literal's keys against StorefrontSettings. Without it,
// a misspelled key compiles, because props that arrive through a JSX spread
// are not checked for extra keys.
export const storefront = {
  saleDiscount: 0.2,
} satisfies StorefrontSettings

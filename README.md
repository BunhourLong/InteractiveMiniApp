# Interactive Mini App: Product Catalog

A small product catalog built with React and TypeScript. It loads its catalog from a JSON endpoint, updates on every click and keystroke, and the add-product form validates its own input. It is typed end to end, so most mistakes show up in the editor. The three bugs that TypeScript could not catch were found with a breakpoint, React DevTools and the Network tab.

## Features

| Step | What it does | Where |
| --- | --- | --- |
| Render from data | Fetches `/api/products.json` on mount and renders it with `.map()` and stable `id` keys. Shows an "X products" count. Each product gets a green **In stock** or gray **Sold out** badge, chosen with a ternary. | `App.tsx`, `api/fetchProducts.ts`, `components/ProductGrid.tsx`, `components/ProductCard.tsx` |
| Interactive | An "In stock only" filter driven by state. Each card has a *Put on sale* toggle. Sale items show the 20% store discount, with the original price struck through. A red **N on sale** counter appears with `&&` only when the count is greater than 0. | `App.tsx`, `components/ProductCard.tsx`, `config/storefront.ts` |
| Controlled form | "Add product" form with name, price and internal cost. The inputs share **one draft object**. Submit calls `e.preventDefault()`, and errors show inline. Empty names and non-number amounts are rejected. | `components/AddProductForm.tsx`, `components/TextField.tsx`, `utils/validateProduct.ts` |
| Typed end to end | Every component that takes props has a props interface. Every event handler is typed `React.ChangeEvent` or `React.SubmitEvent`. The list uses `useState<Product[]>`. There is **zero implicit `any`**: the fetched JSON is read as `unknown` and narrowed with a type guard, `catch` parameters are `unknown`, and there are no `as` casts. `noImplicitAny` is on, and lint fails on explicit `any` and on `!` non-null assertions. | `tsconfig.json`, `.oxlintrc.json`, `api/fetchProducts.ts` |
| Derived types | `PublicProduct = Omit<Product, 'cost'>` removes the internal cost field, and cards only ever receive that type. `NewProduct = Pick<…>`. The form draft is `Partial<Record<ProductField, string>>`. Every optional value is read with `?.` and `??`: `draft.name?.trim() ?? ''`, `value={draft.price ?? ''}`, `saleDiscount ?? 0`. | `types/product.ts`, `utils/toPublicProduct.ts` |
| Bug hunt | Three bugs were planted and then fixed: a crash, a silent wrong value and a network failure. Each was found with the right tool and written up as symptom → tool → what it showed → fix. | [DEBUGGING_JOURNAL.md](DEBUGGING_JOURNAL.md) |

The audit of the AI-generated validation function and the checklist is in [AUDIT.md](AUDIT.md).

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run typecheck  # npx tsc --noEmit
npm run lint       # oxlint (fails on alert(), index keys, any and ! assertions)
npm run build      # type-check, then build for production
```

## Project structure

```
public/api/products.json        # the catalog "endpoint" the app fetches
src/
├── App.tsx                     # products, load status and filter state; sale counter; layout
├── api/fetchProducts.ts        # fetch + content-type check + isProduct type guard
├── components/
│   ├── AddProductForm.tsx      # controlled form over a Partial draft, inline errors
│   ├── ProductCard.tsx         # takes a PublicProduct; badges, sale price, sale toggle
│   ├── ProductGrid.tsx         # .map() with id keys, empty state
│   └── TextField.tsx           # typed label + input + error message
├── config/storefront.ts        # store-wide settings (sale discount), `satisfies`-checked
├── types/product.ts            # Product, and the types derived from it
└── utils/
    ├── formatPrice.ts          # USD formatting
    ├── toPublicProduct.ts      # removes internal fields before rendering
    └── validateProduct.ts      # pure validator, returns an errors object
```

## Commit history

There is one commit per step. The commits for this mission, in order:

1. `Load the catalog from /api/products.json` and `Show discounted prices for items on sale`: the network request and the spread props that the bug hunt needs.
2. `Type the app end to end with zero implicit any`: **requirement 1**.
3. `Derive product types instead of repeating them`: **requirement 2**.
4. `Plant bug 1/2/3 …`, then `Fix bug 1/3/2 …`: **requirement 3**. Each fix commit adds its entry to the debugging journal (**requirement 4**).

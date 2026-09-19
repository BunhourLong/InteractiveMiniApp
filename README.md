# Interactive Mini App: Product Catalog

A small product catalog built with React and TypeScript. Every page is rendered from data, it updates on every click and keystroke, and the add-product form validates its own input.

## Features

| Step | What it does | Where |
| --- | --- | --- |
| Render from data | Uses `.map()` over a products array with stable `id` keys. Shows an "X products" count. Each product gets a green **In stock** or gray **Sold out** badge, chosen with a ternary. | `App.tsx`, `components/ProductGrid.tsx`, `components/ProductCard.tsx` |
| Interactive | An "In stock only" filter driven by state. Each card has a *Put on sale* toggle. A red **N on sale** counter appears with `&&` only when the count is greater than 0. | `App.tsx`, `components/ProductCard.tsx` |
| Controlled form | "Add product" form with name and price. Both inputs share **one state object**. Submit calls `e.preventDefault()`, and errors show inline. Empty names and non-number prices are rejected. | `components/AddProductForm.tsx`, `utils/validateProduct.ts` |
| TypeScript | Written in `.tsx`, with interfaces for the product and form data. `npx tsc --noEmit` passes. | `types/product.ts`, `tsconfig.json` |

The audit of the AI-generated validation function and the checklist is in [AUDIT.md](AUDIT.md). The checklist covers: `value` + `onChange` on every input, no index keys, no `if` inside JSX, and a clean `tsc` run.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run typecheck  # npx tsc --noEmit
npm run lint       # oxlint (fails on alert() and array-index keys)
npm run build      # type-check, then build for production
```

## Project structure

```
src/
├── App.tsx                     # products and filter state, sale counter, layout
├── components/
│   ├── AddProductForm.tsx      # controlled form, one state object, inline errors
│   ├── ProductCard.tsx         # stock badge (ternary), sale tag (&&), sale toggle
│   └── ProductGrid.tsx         # .map() with id keys, empty state
├── data/products.ts            # seed data
├── types/product.ts            # Product, NewProduct, ProductFormData, ProductFormErrors
└── utils/
    ├── formatPrice.ts          # USD formatting
    └── validateProduct.ts      # pure validator, returns an errors object
```

The Git history follows the mission step by step, with one commit per step.

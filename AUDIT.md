# Audit

This file audits the app against two things: the AI-generated validation function, and the project checklist. Line numbers refer to commit `3a6e54c`, before the typing and debugging work. Later commits moved some of this code. For example, the validator now takes a `ProductDraft` and also checks `cost`. See [DEBUGGING_JOURNAL.md](DEBUGGING_JOURNAL.md) for that work.

## 1. AI-generated validation function

The AI (Claude) generated [`src/utils/validateProduct.ts`](src/utils/validateProduct.ts). Each line was then reviewed.

The function is **pure**. It takes the form values and returns a new errors object. [`AddProductForm.tsx`](src/components/AddProductForm.tsx) is the component that puts that object into state.

| Check | Result | Evidence |
| --- | --- | --- |
| Sets error state | ✅ Pass | `handleSubmit` calls `setErrors(validationErrors)` (AddProductForm.tsx:25). Messages render inline under each field with `{errors.name && <p className="field-error">…}` (lines 48, 68). |
| No `alert()` | ✅ Pass | Running `grep -rn "alert(" src` finds only the doc comment that says the function never calls it. `.oxlintrc.json` sets `no-alert` to `error`, so a future `alert()` fails lint. |
| Never mutates state directly | ✅ Pass | The function only reads `form` (`form.name.trim()` and `form.price.trim()`, lines 13–14). It writes only to `errors`, a new local object created on line 12 and returned on line 28. React state is never passed to it by reference and then changed. |
| Rejects empty names | ✅ Pass | The name is trimmed first, so `""` and `"   "` both give "Name is required." |
| Rejects non-number prices | ✅ Pass | `Number.isFinite(Number(price))` rejects `abc`, `12abc` and `Infinity`. Empty prices and negative prices are also rejected. |

**Review note:** A quick grep for mutation flags the four `errors.x = '…'` assignments (lines 17–25). They write to the function's own local object, not to React state, so they are safe.

### Other state updates in the app

None of these mutate state. Each one goes through a setter and gets a copy:

| Where | Update |
| --- | --- |
| App.tsx:16 | `setProducts((prev) => [...prev, newProduct])`: a new array |
| App.tsx:23 | `setProducts((prev) => prev.map(… { ...product, onSale: !product.onSale } …))`: a new array and a new object |
| AddProductForm.tsx:18 | `setForm((prev) => ({ ...prev, [field]: value }))`: one state object for the whole form, copied |
| AddProductForm.tsx:19 | `setErrors((prev) => ({ ...prev, [field]: undefined }))`: clears a field's error while the user types |

Running `grep -rnE "\.(push|pop|splice|sort|reverse|shift|unshift)\(" src` finds nothing.

## 2. Checklist

### `value` + `onChange` on every input ✅

| Input | Controlled by | Change handler |
| --- | --- | --- |
| Name (AddProductForm.tsx:38) | `value={form.name}` | `onChange={handleChange}` |
| Price (AddProductForm.tsx:57) | `value={form.price}` | `onChange={handleChange}` |
| "In stock only" checkbox (App.tsx:41) | `checked={inStockOnly}` | `onChange={(e) => setInStockOnly(e.target.checked)}` |

For a checkbox, `checked` is the prop that makes it controlled; it plays the same role as `value` on a text input.

### Zero index keys ✅

- The only `key` in the app is `key={product.id}` (ProductGrid.tsx:15).
- Both `.map()` calls (ProductGrid.tsx:14 and App.tsx:24) take a single `product` parameter, so no index is in scope.
- Each new product gets `crypto.randomUUID()` as its id, so keys stay stable when products are added.
- `.oxlintrc.json` sets `react/no-array-index-key` and `react/jsx-key` to `error`.

### Zero `if` statements inside JSX ✅

Running `grep -rnw "if" src` returns six matches. None of them are inside JSX:

| Location | Context |
| --- | --- |
| main.tsx:7 | A guard for the `#root` element, which runs before `render()` |
| validateProduct.ts:16, 20, 22, 24 | A plain function that has no JSX |
| AddProductForm.tsx:26 | An early return in the submit handler |

All conditional rendering uses a ternary or `&&`:

- Ternary: the stock badge's class and text, the "product"/"products" plural, the empty state versus the grid, the sale button label, and `aria-describedby`.
- `&&`: the red sale counter, the "Sale" tag, and the field error messages.

The sale counter is written as `saleCount > 0 && …` rather than `saleCount && …`. The second form would render a stray `0` when nothing is on sale.

### `tsc` clean ✅

```
$ npx tsc --noEmit
$ echo $?
0
```

The check runs with `strict` and `noUncheckedIndexedAccess`. Right after the files were renamed to `.tsx`, and before any annotations were added, the same command reported **25 errors**: implicit `any` props, `{}` error state, and a possibly-null `#root`. `npm run build` now runs `tsc --noEmit` first, so a type error blocks the build.

## 3. Behaviour check

The real `App` was mounted in a headless DOM (jsdom) and driven through 29 assertions. All 29 passed:

- The grid starts with 6 cards, "6 products", 4 "In stock" badges, 2 "Sold out" badges and "2 on sale".
- The filter changes the count to "4 products" and "1 on sale". Taking the last sale item off sale removes the counter completely, with no stray `0`.
- An empty submit is `preventDefault`-ed and shows both inline errors. Nothing is added.
- `12abc`, `-5` and a whitespace-only name are each rejected with the correct message.
- A valid submit adds "Desk Lamp" at "$24.99" (the name is trimmed), marks it in stock, and resets the form.
- No React console errors were logged (key warnings or controlled/uncontrolled input warnings), and `alert` was never called.

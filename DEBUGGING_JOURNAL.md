# Debugging journal

Three bugs were planted on purpose, and each one still passed `tsc` and `oxlint`. Each bug was then found with the tool that fits it, not by guessing. Every entry follows the same pattern: **symptom → tool → what it showed → fix**.

Bugs are numbered in the order they were planted, and the entries are in the order they were found: **1 → 3 → 2**. The bugs were stacked, so each one hid the next: while the page crashed, the fetch never ran, and while the fetch failed, no product cards were rendered.

---

## Bug 1: blank page (`.map()` on null state)

**Symptom.** The page is completely white, and `#root` has no children. The console shows:

```
Uncaught TypeError: Cannot read properties of null (reading 'map')
    at App (App.tsx:27:34)
    at react_stack_bottom_frame …
    at renderWithHooks …
An error occurred in the <App> component. Consider adding an error boundary to your tree …
```

**Tool: a breakpoint (Sources panel).** Line 27 is a line in the transformed file that Vite serves. The source map puts it at `App.tsx:32` in the real source: `const publicProducts = products.map(toPublicProduct)`. A breakpoint was set on that line, and the page was reloaded.

**What it showed.** Execution paused inside `App()` on that line. **Scope → Local**:

| Variable | Value |
| --- | --- |
| `products` | `null` |
| `status` | `"loading"` |
| `inStockOnly` | `false` |

The call stack was `App ← react_stack_bottom_frame ← renderWithHooks ← updateFunctionComponent ← beginWork`. `status` was still `"loading"`, and the Network panel had no request for `products.json` yet. That means the crash happens during the **first render**, before `useEffect` has even started the fetch. The null could not be a bad API response or a later `setProducts(null)` call. It had to be the initial value passed to `useState`.

Line 13 read `useState<Product[]>(null!)`. The `!` tells TypeScript "trust me, this isn't null", so `tsc` stayed green. The code Vite actually serves to the browser doesn't have the `!` at all. It says `useState(null)`.

**Fix.** Start the state as an empty list: `useState<Product[]>([])`. Whether the list is still loading is already tracked by `status`, so `products` never needs to be null. To stop this from coming back, `typescript/no-non-null-assertion` is now an error in `.oxlintrc.json`. Run against the planted code, lint fails:

```
src/App.tsx:13:55: Forbidden non-null assertion. [Error/typescript(no-non-null-assertion)]
```

**Why the console alone wasn't enough.** The console said *what* failed (`.map` on null) and *where*. It didn't say *why* `products` was null. There were three suspects: a bad response, a `setProducts(null)` somewhere, or the initial state. Only the paused scope showed the value at the moment of the crash, on the first render, before any request had been sent.

---

## Bug 3: "Couldn't load products" (network failure)

**Symptom.** With bug 1 fixed, the page renders but shows the red "Couldn't load products" box instead of the grid. The console shows one line:

```
SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

That message suggests the JSON file is broken. It isn't: `public/api/products.json` parses fine.

**Tool: the Network tab (filter: Fetch/XHR).**

**What it showed.**

| Name | Status | Type | Size | Initiator |
| --- | --- | --- | --- | --- |
| `prodcuts.json` | (canceled) | fetch | 0 B | `fetchProducts` (fetchProducts.ts) |
| `prodcuts.json` | **200 OK** | fetch | 638 B | `fetchProducts` (fetchProducts.ts) |

- The request URL is `/api/prodcuts.json`, with `c` and `u` swapped. The file is `products.json`.
- The status is **200, not 404**. On an unknown path, Vite's dev server falls back to `index.html`. The response header says `Content-Type: text/html`, and the **Response** tab starts with `<!doctype html>`. The `<` in the console error is the first character of that HTML page.
- The first, canceled request is expected. In development, StrictMode runs the effect twice, and the cleanup aborts the first fetch.

**Fix.** Correct `PRODUCTS_URL` to `/api/products.json`. Also, `fetchProducts` now checks the `Content-Type` header before parsing, so the same kind of typo reports the real problem. With the typo put back temporarily, the console now says:

```
Error: GET /api/prodcuts.json returned text/html, not JSON. Check the URL.
```

After the fix, the Network tab shows `products.json`, `200`, `application/json`, 666 B.

**Why the console alone wasn't enough.** The console only saw the *last* step: `response.json()` choking on HTML. It never showed the URL that was requested, the status, or what came back, and the 200 status meant `response.ok` was true. The Network tab showed all of that in one row. The misspelled URL was readable at a glance.

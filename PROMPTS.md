# Bayan — Build Prompts for Claude Code

Paste these into Claude Code one at a time, in order. Between prompts: review the diff, run the dev server, commit to git.

---

## Prompt 1 — Scaffold the project

```
Scaffold a new Next.js 14 project at the repo root using the App Router, TypeScript (strict), Tailwind CSS, ESLint, and the src/ directory pattern. Use the App Router (not pages). Skip the example boilerplate.

Then:
1. Install: framer-motion, lucide-react, clsx, tailwind-merge.
2. Load Google Fonts via next/font: "Cormorant Garamond" (weights 400, 500, 600, 700, italic) as font-serif, "Jost" (weights 300, 400, 500, 600) as font-sans.
3. Define the Bayan color palette as CSS variables in app/globals.css and mirror them into tailwind.config.ts under theme.extend.colors.bayan.* — values come from CLAUDE.md.
4. Set up a tiny `cn()` utility in src/lib/utils.ts that combines clsx + tailwind-merge.
5. Delete the placeholder homepage and replace with a minimal page that just renders "Bayan" in serif as a smoke test.

When done, run `npm run dev` and confirm there are no errors. Do not move on until the smoke test renders.
```

---

## Prompt 2 — Layout shell

```
Build the shared site layout in src/app/layout.tsx and supporting components in src/components/layout/.

Components to create:
1. <AnnouncementBar /> — the marquee with the four messages from the prototype, looped seamlessly.
2. <Nav /> — sticky, blurred glass background. Three columns (links | brand mark | actions). Brand mark uses serif "BAYAN" wordmark with "ETHNIC WEAR" subtitle. Action icons (search, wishlist, account, cart) from lucide-react. Cart icon shows a badge with item count (use a stub count of 0 for now).
3. <Footer /> — five columns: brand block + Shop / Help / About / Connect. Bottom row with copyright and payment-method badges including "COD 50%".
4. <WhatsAppFloat /> — fixed bottom-right with a pulsing green ring. Reads phone number from NEXT_PUBLIC_WHATSAPP_NUMBER env var; falls back to a placeholder if not set.

Use the bayan-handoff/reference/prototype.html as the visual source of truth — match colors, spacing, typography, hover behavior exactly. Make every layout element fully responsive at 375px / 768px / 1280px.

Mobile nav: hide the inline link list and replace with a hamburger that opens a full-screen overlay menu.
```

---

## Prompt 3 — Mock Shopify client

```
Create src/lib/shopify/ as a typed abstraction over the Shopify Storefront API. For now, return mock data — we'll swap to the real API in a later prompt.

Files:
- src/lib/shopify/types.ts — TypeScript types for Product, ProductVariant, Collection, Cart, CartLine. Mirror the Shopify Storefront API GraphQL shape exactly so the swap later is mechanical.
- src/lib/shopify/mock.ts — 12 mock products with realistic Pakistani ethnic-wear names (e.g., "Mehrunnisa", "Saba", "Noor", "Anaya", "Inara", etc.), prices in PKR (4,000–18,000 range), 2-3 size variants each (S, M, L), one of three categories (pret, formals, festive), and 4 collections (eid-26, pret, formals, festive). Use unsplash.com URLs with `images.unsplash.com/photo-...?w=800` for product photos — pick neutral-toned fashion-adjacent photos.
- src/lib/shopify/index.ts — exports getProducts(), getProduct(handle), getCollections(), getCollection(handle), getRelatedProducts(productId). Each function is async and returns mock data for now.

Add JSDoc comments noting that this is a temporary mock layer.
```

---

## Prompt 4 — Homepage

```
Port the homepage from bayan-handoff/reference/prototype.html into src/app/page.tsx, using the mock Shopify client.

Sections (in order):
1. Hero — full viewport, hero-bg-arch SVG, floating gold petal animations (CSS keyframes), Bayan SVG mark, headline "Woven in tradition, designed for today." with italic emphasis, lead paragraph, two CTAs.
2. NewArrivals — pull first 4 products from getProducts(). Use a <ProductCard /> component (create it in src/components/product-card.tsx). Cards have aspect-ratio 3/4, hover quick-add button, "New"/"Sale"/"Limited" badges.
3. Categories — pull collections, show three cat-cards (Pret / Formals / Festive) with gradient backgrounds matching the prototype.
4. Story — split layout with arch-and-botanical SVG on left, italic-serif copy on right.
5. EditorialQuote — dark band with italic Cormorant Garamond quote about the meaning of "Bayan".
6. InstagramGrid — 6 placeholder tiles with hover overlay.
7. Newsletter — pill-shaped form with "Subscribe" button. Form submission is a no-op for now.

Each section is its own component in src/components/sections/. Use framer-motion's whileInView for scroll-reveal (replace AOS from the prototype). Keep the animations subtle — fade + slight Y translation, 600-800ms.

Match the prototype's typography, color, and spacing precisely. Run dev server and visually compare side-by-side before declaring done.
```

---

## Prompt 5 — Shop page with filters

```
Build src/app/shop/page.tsx — a server component that reads URL search params for filters and sort.

Filter params: ?size=M&priceMax=10000&category=pret
Sort param: ?sort=newest|price-asc|price-desc

Layout:
- Left sidebar (desktop): filter accordion with Size (chips), Price (range slider), Category (checkboxes). On mobile: filters open in a slide-up modal triggered by a "Filter" button.
- Top right: sort dropdown.
- Grid: 4 columns desktop, 2 columns mobile.

Filter UI is client-side. On filter change, update URL params via router.replace (so it's bookmarkable + shareable). The server component reads params, filters the mock product list, and renders.

Empty state: when no products match, show an elegant "Nothing matches your filters" message with a "Clear filters" link.

Make sure filter state is preserved when navigating to a product detail page and back.
```

---

## Prompt 6 — Product detail page

```
Build src/app/product/[handle]/page.tsx.

Layout (desktop):
- Two columns. Left: image gallery (main image + 4 thumbnail strip below). Click thumbnail to swap main. Hover main image triggers zoom (CSS transform, or react-image-magnify if cleaner).
- Right column: product name (serif, large), price (with strikethrough if on sale), short description, size selector (chips), Add to Cart button (primary), Add to Wishlist (ghost), then accordion tabs for Description / Fabric / Care.

Below: Related Products section using getRelatedProducts(). Title "You may also love". Show 4 cards.

Mobile:
- Stack image gallery on top, info below.
- Sticky Add to Cart at bottom of viewport (always visible).
- Tabs become accordion (default collapsed).

Add to Cart is a Server Action that calls a stub addToCart() in lib/shopify/cart.ts (just logs for now). We'll wire to real Shopify next.

Use generateMetadata() for SEO — product name as title, description, OG image.

Handle the case where the handle doesn't match any product → notFound().
```

---

## Prompt 7 — Cart drawer with 50/50 split display

```
Build a slide-in cart drawer that opens when the cart icon is clicked anywhere in the app.

Files:
- src/components/cart/cart-drawer.tsx — slide-in panel from right, 420px wide on desktop, full-width on mobile. Uses framer-motion for the slide animation.
- src/components/cart/cart-line.tsx — each cart item (image, name, size, qty stepper, remove button).
- src/components/cart/cart-summary.tsx — the critical 50/50 display.
- src/context/cart-context.tsx — React context for cart state, with addLine, removeLine, updateQuantity actions. Persist to localStorage for now (we'll swap to Shopify cart later).

Cart summary section MUST show:
   Subtotal:           PKR XX,XXX
   ─────────────────
   Advance (50%):      PKR X,XXX    ← payable now
   Balance (50%):      PKR X,XXX    ← payable on delivery
   ─────────────────
   [Proceed to Checkout — Pay 50% Now]

This is the most important thing on the page. Make the 50% advance line subtly emphasized (slightly bolder, accent-deep color). Add a small ⓘ icon next to "Balance (50%)" that opens a tooltip explaining the COD model.

Also build src/app/cart/page.tsx as a fallback non-drawer version with the same content.
```

---

## Prompt 8 — Real Shopify Storefront API

```
Swap the mock Shopify client for real Storefront API calls.

1. Read SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN from .env.local.
2. Replace src/lib/shopify/index.ts with real implementations using fetch + GraphQL. Keep the function signatures identical so no page code needs to change.
3. Add src/lib/shopify/queries.ts and src/lib/shopify/mutations.ts as the single source of GraphQL strings.
4. Wire the cart context to Shopify cart create + cart add lines + cart update + cart remove. Store the Shopify cart ID in localStorage.
5. "Proceed to Checkout" now redirects to Shopify's hosted checkout URL (from the Cart object's `checkoutUrl` field).
6. Add app/api/revalidate/route.ts that listens for Shopify webhooks (products/update, collections/update) and revalidates the relevant tags using next/cache.

If the env vars are missing, fall back to the mock client with a console warning. This lets the build keep running locally without secrets.

Test against the live Shopify store using the credentials in .env.local. Verify: products load, cart add/remove works, checkout redirect lands on the Shopify checkout page.
```

---

## Prompt 9 — Order confirmation + bank-transfer flow

```
After Shopify checkout completes, Shopify redirects to a return URL. Build src/app/order-confirmation/[orderId]/page.tsx.

This page shows:
1. "Thank you" heading + order ID
2. Order summary (line items, subtotal, advance amount, balance amount)
3. A prominent "Pay 50% advance to confirm your order" card showing:
   - Bank Name, Account Title, Account Number, IBAN (all from env vars)
   - Total advance to send (50% of order total in PKR)
   - A button: "Send screenshot to confirm — Open WhatsApp" that opens https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi%2C%20here%20is%20my%20deposit%20screenshot%20for%20order%20%23{orderId}
4. "What happens next" — 3-step explainer (we verify deposit → ship within 2 days → balance collected on delivery).

Email the customer a copy of this page via Shopify's order confirmation email — customize the email template in Shopify admin with the same instructions. Note this in CLAUDE.md as a manual setup step the brand owner needs to do.
```

---

## Prompt 10 — About, Contact, FAQ, Size Guide

```
Build the four remaining content pages, each in src/app/{route}/page.tsx. Use the same brand tokens and section components.

About (/about):
- Hero: serif headline "An atelier built on stillness." + lead paragraph
- Story section: 4 paragraphs of brand history (write compelling placeholder copy — quiet, intentional voice — to be edited by brand owner)
- Values section: 3 cards (Craft / Provenance / Patience)
- Founder note section: signature-style closing

Contact (/contact):
- Two columns. Left: contact form (name, email, message). Submits to a Server Action that emails NEXT_PUBLIC_CONTACT_EMAIL (use Resend or a simple mailto fallback). Right: contact info — WhatsApp button, email, Instagram handle, business address placeholder.

FAQ (/faq):
- Accordion with 12 questions covering: shipping times, sizing, fabric care, payment (the 50/50 model explained clearly), returns, custom orders, international shipping. Use framer-motion for the expand/collapse.

Size Guide (/size-guide):
- Clean reference table: XS / S / M / L / XL with bust / waist / hips measurements in inches AND cm. Include a "How to measure" diagram (simple SVG figure).
```

---

## Prompt 11 — Customer account pages

```
Build src/app/account/* using Shopify customer auth.

Routes:
- /account/login — email + password form
- /account/register — name + email + password form
- /account — order history (list of past orders with status, total, view-details link)
- /account/orders/[id] — single order details

Use Shopify's Storefront customer auth (customerAccessTokenCreate mutation). Store the access token in an httpOnly cookie via Server Action. Add a middleware that protects /account/* routes — redirect to /account/login if no token.

Add "Account" link in the nav to /account (or /account/login if signed out). Update the user icon in the nav to show a small dot when signed in.
```

---

## Prompt 12 — SEO, sitemap, final polish

```
Final pass before deploy:

1. app/sitemap.ts — dynamic sitemap pulling all product handles and collection handles from Shopify.
2. app/robots.ts — allow all, point to sitemap.
3. Open Graph images — generate per-product OG images using next/og (just brand name + product name on a sage background with the Bayan arch mark).
4. Add Schema.org JSON-LD for products on product detail pages.
5. Run Lighthouse — fix anything below 95 on performance, accessibility, best practices, SEO.
6. Run npm run build and fix any TypeScript or build errors.
7. Verify all images use next/image.
8. Verify all links use next/link.
9. Add a 404 page with the Bayan look (cream background, serif "Lost in the atelier" headline, link back home).
10. Add loading.tsx files for each route (skeleton placeholders matching the page layout).

When all green, commit with message "v1.0 — ready for launch" and push.
```

---

## After Prompt 12 — go live

In your terminal:

```bash
git remote add origin git@github.com:<her-handle>/bayan-storefront.git
git push -u origin main
```

Then on vercel.com:
1. New Project → Import the GitHub repo
2. Framework preset: Next.js (auto-detected)
3. Environment variables: paste from `.env.local`
4. Deploy

Once it builds, add the custom domain (bayan.pk or bayan.com) in Vercel → Settings → Domains. Vercel gives you DNS records — set them at your domain registrar. SSL is automatic.

In Shopify admin → Settings → Domains → connect the same domain so checkout runs on `checkout.bayan.pk`. The handoff between your Next.js site and Shopify checkout is now seamless.

Done. The brand is live.

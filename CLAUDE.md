# Bayan — Project Bible for Claude Code

> This file is the source of truth for the Bayan storefront project. Claude Code reads it at the start of every session — keep it accurate and up to date.

---

## Project Summary

**Bayan** is a premium Pakistani ethnic wear brand. We are building its **direct-to-consumer e-commerce website** as a **headless Shopify** storefront — Next.js on the front end (deployed on Vercel), Shopify Storefront API for products / cart / checkout in the background.

The brand inspiration is **Ethnic by Outfitters Pakistan**. The vibe is **soft, feminine, elegant, minimal, premium** — closer to an editorial fashion magazine than a typical Shopify template.

Reference prototype: `reference/prototype.html` — open in a browser. The look and feel of the homepage is already designed. Your job is to port that design into a production Next.js codebase and extend it across all required pages.

---

## Tech Stack (decided)

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + CSS variables for brand tokens |
| Data | Shopify Storefront API (GraphQL) |
| Cart | Shopify cart API (server-side, with optimistic client updates) |
| Animations | Framer Motion for page/component transitions; CSS keyframes for ambient (floating petals) |
| Fonts | Google Fonts — Cormorant Garamond (headings) + Jost (body) |
| Hosting | Vercel |
| Domain | TBD — likely `bayan.pk` or `bayan.com` |
| Image optimization | Next.js `<Image>` |
| Analytics | TBD — likely Plausible or Vercel Analytics |

Reference template — `vercel/commerce`. Borrow architecture; do not borrow the visual design.

---

## Brand Identity

### Colors (CSS variables to define in `globals.css`)

```css
:root {
  --bg: #faf6ec;            /* warm cream */
  --bg-alt: #f1ead8;        /* deeper cream */
  --bg-dark: #1f2419;       /* deep olive-black */
  --primary: #6f8161;       /* sage green */
  --primary-dark: #4d5b41;  /* olive green */
  --accent: #c1a572;        /* champagne gold */
  --accent-deep: #9d8453;   /* deeper gold */
  --text: #2a2e25;
  --muted: #7a786f;
  --line: #d8cfb8;
}
```

Mirror these into `tailwind.config.ts` as `theme.extend.colors.bayan.*` so utilities like `bg-bayan-sage` work.

### Typography

- **Headings:** Cormorant Garamond — weight 400 with `font-italic` for emphasis spans.
- **Body:** Jost — weight 400, 500 for slight emphasis.
- **Uppercase eyebrows:** Jost 500, `tracking-[0.28em]`, `text-[11px]`, color `--accent-deep`.

### Logo

A gold botanical arch on dark backgrounds (Mughal-style pointed arch with a leafy branch and small leaves and a top bud). Versions to maintain:
- **Light variant:** the SVG already used in the prototype hero — gold strokes, transparent background.
- **Dark variant:** for use on cream backgrounds — needs an olive-green stroke version. Generate by swapping stroke colors.

Until the brand owner supplies a true PNG/SVG file, use the inline SVG from the prototype.

### Tone of voice

Quiet, intentional, romantic — never sales-y. Think *atelier journal*, not *e-commerce conversion copy*. Sample lines from the prototype:
- "Woven in *tradition*, designed for today."
- "Quiet luxury, woven by hand."
- "Each thread, a sentence. Each silhouette, a chapter."

---

## Pages to build

Routes use the App Router.

| Route | Purpose |
|---|---|
| `/` | Homepage — port from prototype |
| `/shop` | All products grid with filters (size, price, category) and sort |
| `/collections/[handle]` | Per-collection page (Eid '26, Pret, Formals, Festive) — uses Shopify Collection handles |
| `/product/[handle]` | Product detail — image gallery with zoom, size selector, add to cart, description, fabric, care, related products |
| `/about` | Brand story (extended version of the homepage "Our Story" section) |
| `/contact` | Form + WhatsApp deeplink + stockists list + business email |
| `/faq` | Animated accordion |
| `/size-guide` | Reference table |
| `/cart` | Fallback cart page; primary cart UX is a slide-in drawer |
| `/account/*` | Customer login, signup, order history — Shopify customer auth |
| Checkout | Shopify-hosted (`checkout.bayan.pk` once domain is set) |

---

## Critical requirement — 50/50 split payments

Shopify's native checkout does not support partial payments. The chosen approach for launch is **Option A: manual bank transfer + WhatsApp confirmation.**

Implementation:

1. Cart drawer and `/cart` show two clearly-labeled lines:
   - "Advance (50%) — payable now: PKR X"
   - "Balance (50%) — payable on delivery: PKR X"
2. The only "checkout" payment method enabled in Shopify is **Bank Transfer** (or the offline manual payment method).
3. After the customer completes Shopify checkout, redirect them to a custom `/order-confirmation/[orderId]` page that shows:
   - Order summary
   - Bank account details (env vars: `BANK_NAME`, `BANK_ACCOUNT_TITLE`, `BANK_ACCOUNT_NUMBER`, `BANK_IBAN`)
   - Instruction to send a 50% deposit screenshot to WhatsApp (env var: `WHATSAPP_NUMBER`)
   - A "Send screenshot via WhatsApp" button that opens `https://wa.me/{number}?text={prefilled message with order ID}`
4. The brand team manually confirms each deposit and marks the Shopify order as paid (partial) via the Shopify admin.

When volume justifies it, swap to **Option B**: the "Partial Payment & Deposits" Shopify app. The cart drawer copy and order-confirmation flow should be written so this swap is a small change later.

### Manual Shopify admin steps (do these once)

These cannot be set up in code — the brand owner does them in Shopify admin:

1. **Inventory on every product variant.** If tracking is on and stock is 0 (the Shopify default), `cartLinesAdd` silently caps line quantities at 0 and checkout shows an empty cart. Either uncheck "Track quantity" or set a positive "Available" number on each variant.
2. **Order confirmation email template** — Settings → Notifications → Order confirmation → Edit code. Add a block that mirrors `/order-confirmation/[orderId]`: the 50% advance amount, bank account details, and a `https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi…order%20%23{{ order.name }}` link. The exact bank values live in `.env.local` for the storefront — keep the email copy in sync manually for now.
3. **Order status page redirect** — Settings → Checkout → "Order status page" → "Additional scripts" → add a tiny `<script>window.location.href = "https://bayan.pk/order-confirmation/{{ order.name }}?total={{ order.total_price | divided_by: 100 }}";</script>` (or use the Order Status post-purchase API). This routes the customer from Shopify's default thank-you screen to our custom page.
4. **Bank Transfer** — Settings → Payments → Manual payment methods → Add "Bank Transfer". Disable all card/JazzCash/Stripe gateways until Option B is in place, otherwise customers can pay 100% upfront and the 50/50 model breaks.
5. **Storefront API token scope** — to expose `quantityAvailable` (used for "only N left" badges), tick `unauthenticated_read_product_inventory` on the custom app's Storefront API config and reinstall.
6. **Webhooks for cache invalidation** — Settings → Notifications → Webhooks → create "Product update", "Product create", "Product delete", "Collection update" webhooks pointing to `https://bayan.pk/api/revalidate?secret={SHOPIFY_REVALIDATION_SECRET}`. Until deployed, skip this — dev can't receive webhooks.

---

## Environment variables

```env
# Shopify
SHOPIFY_STORE_DOMAIN=bayan-ethnicwear.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_REVALIDATION_SECRET=

# WhatsApp + Bank (for 50% deposit flow)
NEXT_PUBLIC_WHATSAPP_NUMBER=92XXXXXXXXXX
BANK_NAME=
BANK_ACCOUNT_TITLE=
BANK_ACCOUNT_NUMBER=
BANK_IBAN=

# Site
NEXT_PUBLIC_SITE_URL=https://bayan.pk
NEXT_PUBLIC_INSTAGRAM_HANDLE=bayan_ethnicwear
NEXT_PUBLIC_TIKTOK_HANDLE=bayan_ethnicwear
NEXT_PUBLIC_CONTACT_EMAIL=hello@bayan.pk
```

Real values pending from the brand owner — leave placeholders in `.env.example`; never commit secrets.

---

## Build order (suggested)

1. **Scaffold** — `npx create-next-app@latest` with App Router, TypeScript, Tailwind. Add Framer Motion. Set up brand tokens in CSS + Tailwind config. Get Google Fonts loading via `next/font`.
2. **Layout shell** — Root layout with announcement bar (marquee), nav (sticky, blurred), footer, floating WhatsApp button. Make the marquee, nav, and footer match the prototype.
3. **Shopify client** — Create `lib/shopify/` with a GraphQL fetcher (use the official Storefront API). Type-safe query helpers for: products, collections, product by handle, collection by handle, cart create, cart add lines, cart remove lines, cart update lines.
4. **Homepage** — port the prototype. Replace placeholder products with `getProducts({ first: 4, sortKey: "CREATED_AT", reverse: true })` from Shopify. Replace placeholder collections with `getCollections()`.
5. **Product card component** — reusable, used on home + shop + collections + related products. Handle hover quick-add.
6. **Shop page** — `/shop` with server-side filter URL params (`?size=M&price=lt-10000&category=pret`) and sort.
7. **Product detail** — `/product/[handle]` with image gallery, variant selector, add-to-cart action, fabric + care tabs, related products.
8. **Cart drawer** — slide-in from right, optimistic updates, the 50/50 split display, "Proceed to Checkout" button → Shopify checkout URL.
9. **Order confirmation page** — `/order-confirmation/[orderId]` with bank details + WhatsApp deposit flow.
10. **About / Contact / FAQ / Size Guide** — build using the same design system. About reuses the homepage story section's vibe.
11. **Account pages** — login, signup, order history. Use Shopify customer auth tokens.
12. **SEO + sitemap** — `app/sitemap.ts` pulling all products and collections. Open Graph images.
13. **Deploy** — push to GitHub, connect Vercel, add env vars, attach custom domain.

---

## Open items (pending from brand owner)

- [ ] Approval of prototype visual direction (homepage in `reference/prototype.html`)
- [ ] Shopify store setup — domain + Storefront API token
- [ ] Real product photography (replace placeholder cards)
- [ ] Hero campaign image (optional — fallback to floral-art hero exists in prototype)
- [ ] Real social handles, WhatsApp number, contact email
- [ ] Bank account details for the 50% deposit flow
- [ ] GitHub username (to invite as collaborator on the repo)
- [ ] Decision on `.pk` vs `.com` domain

Until these arrive, Claude Code can build the entire site using:
- Placeholder products generated by `lib/shopify/mock.ts` (mirrors the real Shopify type shape)
- Env var placeholders
- The brand identity already finalized above

---

## What "done" looks like

- Lighthouse: 95+ across performance, accessibility, best practices, SEO
- Mobile-perfect at 375px / 768px / 1280px
- Cart drawer feels native — sub-200ms response to add/remove
- Product detail page loads in <2s on a fast 3G throttle
- Zero console errors / TypeScript errors / accessibility violations
- All copy is in the Bayan voice — quiet, intentional, romantic
- The 50/50 payment model is clearly explained at every relevant touchpoint (cart, checkout, order confirmation, FAQ)
- Customer can place an order end-to-end against the real Shopify store

---

## Code conventions

- TypeScript strict mode. No `any`.
- Server components by default. Use `"use client"` only when needed (interactivity, framer-motion, hooks).
- Co-locate components with their pages where they're single-use; promote to `components/` only when reused.
- Tailwind for layout and spacing. CSS variables for brand colors. No inline `style` for color (use Tailwind tokens).
- Form actions use Server Actions; no separate API routes unless required by an external webhook.
- Keep `lib/shopify/queries.ts` and `lib/shopify/mutations.ts` as the single source of GraphQL strings.

---

## Reference

- Prototype: `reference/prototype.html` — open this in a browser to see the visual target.
- Roadmap (long-form): see `reference/Bayan-Roadmap.docx` — covers stages, costs, payment-gateway comparison, and rationale.
- Inspiration: ethnic.com.pk (their info-density layout, not their template aesthetic).

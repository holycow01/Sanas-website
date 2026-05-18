# Bayan — Handoff to Claude Code

This folder is your starting point. Drop it into a new project folder, open Claude Code there, and you're off.

---

## What's in this folder

```
bayan-handoff/
├── CLAUDE.md           ← Project bible. Claude Code reads this on every session.
├── HANDOFF.md          ← This file — instructions for you (the human).
├── PROMPTS.md          ← Copy/paste prompts for each major build stage.
└── reference/
    ├── prototype.html  ← The homepage design, fully built as a static HTML demo.
    └── Bayan-Roadmap.docx  ← Long-form plan (payment models, costs, gateways).
```

---

## Step-by-step setup

### 1. Install Claude Code (if you haven't)

```bash
npm install -g @anthropic-ai/claude-code
```

Then run `claude` in any terminal to launch it. First time, it'll walk you through signing in.

### 2. Create the project folder

```bash
mkdir bayan-storefront
cd bayan-storefront
```

### 3. Move this handoff folder into the project

Drop the entire `bayan-handoff/` folder inside `bayan-storefront/`. Your structure should look like:

```
bayan-storefront/
└── bayan-handoff/
    ├── CLAUDE.md
    ├── HANDOFF.md
    ├── PROMPTS.md
    └── reference/
```

### 4. Promote CLAUDE.md to the project root

Claude Code looks for `CLAUDE.md` at the repo root. Move it up one level:

```bash
mv bayan-handoff/CLAUDE.md ./CLAUDE.md
```

Now your structure is:

```
bayan-storefront/
├── CLAUDE.md           ← Promoted to root — Claude Code reads this automatically
└── bayan-handoff/
    ├── HANDOFF.md
    ├── PROMPTS.md
    └── reference/
```

### 5. Open Claude Code

```bash
claude
```

It will read `CLAUDE.md` and have full context on the project.

### 6. Paste the first prompt

Open `bayan-handoff/PROMPTS.md` and paste **Prompt 1 — Scaffold the project** into Claude Code. It will scaffold the Next.js app, install dependencies, set up Tailwind with your brand tokens, and load the fonts.

After each prompt completes, review what Claude Code built, commit to git, and move to the next prompt.

---

## How to think about the conversation

Claude Code is best when you treat it like a focused, opinionated developer who needs **clear scope per turn**:

✅ **Good prompt**  
> "Build the product detail page at /product/[handle]. Pull product data from the mock Shopify client. Match the prototype's typography and color tokens. Image gallery on the left with thumbnails; right column has name, price, size selector, add-to-cart button, fabric tab, care tab, related products section."

❌ **Bad prompt**  
> "Build the whole site."

Each `PROMPTS.md` prompt is scoped this way. You can also just chat naturally — Claude Code is good at follow-ups.

---

## When the brand owner sends real assets

When she sends product photos, Shopify token, etc:

1. Drop product photos in `public/images/products/`.
2. Add Shopify env vars to `.env.local` (never commit this).
3. Tell Claude Code: *"Switch from the mock Shopify client to the real Storefront API using the env vars in `.env.local`. Make sure the build still works."*

Claude Code will swap the data source. You won't have to rewrite any pages.

---

## Deploying to Vercel (when ready)

1. Push to GitHub: `git remote add origin <your-repo> && git push -u origin main`
2. Go to vercel.com → New Project → Import the repo
3. Add the env vars from `.env.local` in Vercel's project settings
4. Click Deploy
5. Add the custom domain in Vercel → set the DNS records at your registrar

Total time: ~15 minutes.

---

## Quick reference — common Claude Code commands

| Command | What it does |
|---|---|
| `claude` | Start a new Claude Code session in current folder |
| `/clear` | Reset conversation (keeps CLAUDE.md context) |
| `/init` | Generate a fresh CLAUDE.md by reading the repo (don't use here — we already have one) |
| `/review` | Review the diff of your current changes |
| `git diff` (in terminal) | See what Claude Code changed before committing |

---

## If you get stuck

- Re-read `CLAUDE.md` together with Claude Code: "Read CLAUDE.md and tell me where we are in the build order."
- For payment-flow questions, the long-form rationale is in `bayan-handoff/reference/Bayan-Roadmap.docx`.
- The prototype (`reference/prototype.html`) is the visual source of truth. When Claude Code's output doesn't match the design, say *"Compare what you built to `bayan-handoff/reference/prototype.html` and align the colors, typography, and spacing."*

Good luck. The hard thinking is already done in CLAUDE.md — the rest is execution.

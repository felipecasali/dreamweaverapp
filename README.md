# Dream Weaver

Private dream journal with AI interpretations. Rebuild of dreamweaverapp.com on Next.js 16 + Supabase, deployed on Vercel.

## Stack

- **Next.js 16** (App Router, `src/proxy.ts` instead of middleware). Cache Components is off for the MVP.
- **next-intl**: English at `/`, Portuguese at `/pt`, Spanish at `/es`, with `hreflang` and a localized sitemap.
- **Supabase** (`sa-east-1`, project `dreamweaver`): Auth (email + password), Postgres with RLS on every table.
- **AI layer** in `src/lib/ai`: provider-agnostic. `AI_PROVIDER=stub` returns labelled demo readings until a model is chosen.

## Data model

| Table | Purpose |
| --- | --- |
| `profiles` | One per user: birth date, locale, AI-training opt-in (off by default), plan, terms acceptance. `plan` is not writable by users. |
| `dreams` | One row per dream. Full-text search column `search`. |
| `interpretations` | Every reading of a dream (style, text, model, feedback). Rereading a dream adds a row here instead of a new journal entry. |

`delete_my_account()` lets a signed-in user erase their own account (cascades to all rows). The free quota (`FREE_INTERPRETATIONS`, default 3) is enforced in `src/app/api/interpret/route.ts`.

## Local development

```bash
cp .env.example .env.local   # fill in the publishable key
npm install
npm run dev
```

## Connecting a real AI model

1. Add `src/lib/ai/<provider>.ts` implementing `DreamInterpreter`, using `buildSystemPrompt()` and parsing the JSON reply.
2. Register it in `getInterpreter()` (`src/lib/ai/index.ts`).
3. Set `AI_PROVIDER` and the provider's API key in Vercel (server-only env var).
4. Name the provider in the Privacy policy (`src/content/legal.ts`).

## Not in this MVP

Payments (Stripe), Mind Safe, image generation, migration of users and dreams from the Firebase site. Legal texts in `src/content/legal.ts` are drafts pending legal review.

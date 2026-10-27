# alimor.ir — Agent Rules

Ali Mortazavi's personal site (fa/en/ar): an introduction, not a portfolio. Projects live on paradisecode.ir.

## Commands

- `pnpm dev` (:7796) | `pnpm typecheck` | `pnpm lint` | `pnpm build`
- Deploy: `scripts/deploy.sh release` (builds here, ships to 89.46.217.18, health-checks, rolls back). `caddy`, `rollback`, `status`, `bootstrap` also exist.
- pnpm only; the lockfile is committed.

## Architecture

- Next 16 App Router, one page per locale under `app/[locale]`, standalone output served by systemd `alimor-web` on 127.0.0.1:7742 behind Caddy (`infra/`).
- All copy lives in `src/i18n/{fa,en,ar}.ts`. `fa` is the source shape; TypeScript enforces parity. Facts (links, stack, years) live in `src/lib/site.ts`.
- Contact form: `app/api/contact/route.ts` → Bale bot (`NOTIFY_*` env, same bot as Paradise Code). Rate-limited in memory, honeypot field.
- Motion: `motion/react` + Lenis. Everything must work with motion off (reduced-motion or the header toggle): pinned sections fall back to static layouts, the shader falls back to a CSS gradient.
- `public/resume.pdf` is optional; résumé buttons appear only when it exists at build time.

## Code

- TS strict, no `any`, `catch (e: unknown)`. kebab-case files, named exports. Comments explain WHY only.
- Logical classes only (ms/me/ps/pe/start/end). Directional icons: `rtl:-scale-x-100`.
- Split animated text by words, never letters (Persian/Arabic letters join).
- Facts must be verifiable. Never invent numbers, clients or ratings.

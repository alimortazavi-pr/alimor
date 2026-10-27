# alimor.ir

Personal site of **Ali Mortazavi**, senior front-end engineer and founder of [Paradise Code](https://paradisecode.ir).

Persian, English and Arabic · Next.js 16 · React 19 · Tailwind v4 · motion · Lenis · a hand-written WebGL shader.

```bash
pnpm install
pnpm dev        # http://localhost:7796
```

## Production

- Server `89.46.217.18`, path `/opt/alimor/{releases,current,shared,runtime}`, unit `alimor-web` on `127.0.0.1:7742`.
- Caddy site `infra/caddy/alimor.caddy` (imported from `/etc/caddy/Caddyfile`). Caddy issues the TLS certificates.
- `sedalb.ir` redirects permanently to `alimor.ir`.
- DNS for both domains is on ArvanCloud.

```bash
scripts/deploy.sh bootstrap   # once
scripts/deploy.sh caddy       # after changing the Caddy file
scripts/deploy.sh release     # every deploy
```

Contact form messages go to Bale; set `NOTIFY_BOT_TOKEN`, `NOTIFY_CHAT_ID` (and optionally `NOTIFY_BOT_API_BASE`) in `/opt/alimor/shared/web.env`.

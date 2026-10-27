#!/usr/bin/env bash
# Deploys alimor.ir to the shared Iran server, next to paradisecode.ir. Run from the repo root on the Mac.
#
#   scripts/deploy.sh bootstrap   first install: user, dirs, Node runtime, env file, systemd unit
#   scripts/deploy.sh release     build here, ship, switch, health-check, roll back on failure (default)
#   scripts/deploy.sh caddy       install infra/caddy/alimor.caddy (backup, validate, reload, restore)
#   scripts/deploy.sh rollback    switch back to the previous release
#   scripts/deploy.sh status      service state and the local health check
#
# The server can't reach npm or Google Fonts, so everything is built here and shipped as files.
set -euo pipefail

SERVER="${ALIMOR_SERVER:-root@89.46.217.18}"
SSH_KEY="${ALIMOR_SSH_KEY:-$HOME/.ssh/id_ed25519_server_89_46_217_18}"
ROOT=/opt/alimor
PORT=7742
KEEP_RELEASES=5

ssh_cmd=(ssh -o BatchMode=yes -i "$SSH_KEY" "$SERVER")
remote() { "${ssh_cmd[@]}" "$@"; }
# Reuses Paradise Code's Bale notifier when it is there; never blocks or fails the script
tell() { remote "[ -x /opt/paradise-code/bin/notify.sh ] && /opt/paradise-code/bin/notify.sh" <<<"$1" || true; }
log() { printf '\033[1;36m▸ %s\033[0m\n' "$*"; }

cd "$(dirname "$0")/.."

bootstrap() {
  log "Installing unit, user, runtime and env file"
  remote "mkdir -p $ROOT/{releases,shared,backups,runtime}"
  scp -q -i "$SSH_KEY" infra/systemd/alimor-web.service "$SERVER:/etc/systemd/system/alimor-web.service"
  remote bash -s <<'REMOTE'
set -euo pipefail
ROOT=/opt/alimor
chown root:root /etc/systemd/system/alimor-web.service
id alimor >/dev/null 2>&1 || useradd --system --home-dir "$ROOT" --shell /usr/sbin/nologin alimor
# Own copy of Node 24 so other projects' runtime upgrades can't break this site
[ -x "$ROOT/runtime/node" ] || install -m 755 /opt/project-runtime/node24 "$ROOT/runtime/node"
if [ ! -f "$ROOT/shared/web.env" ]; then
  umask 077
  # The contact form talks to the same Bale bot and chat as Paradise Code
  src=/opt/paradise-code/shared/api.env
  { grep -E '^NOTIFY_(BOT_API_BASE|BOT_TOKEN|CHAT_ID)=' "$src" 2>/dev/null || true; } > "$ROOT/shared/web.env"
fi
chown root:alimor "$ROOT/shared/web.env" && chmod 640 "$ROOT/shared/web.env"
systemctl daemon-reload
systemctl enable alimor-web >/dev/null 2>&1
REMOTE
}

build() {
  CI=true pnpm install --frozen-lockfile --prefer-offline >/dev/null
  log "Building"
  pnpm build
  rm -rf .deploy && cp -R .next/standalone .deploy
  if find .deploy/node_modules -name "*.node" 2>/dev/null | grep -q .; then
    echo "Bundle contains native binaries built for macOS; refusing to ship" >&2
    find .deploy/node_modules -name "*.node" >&2
    exit 1
  fi
  git rev-parse --short HEAD > .deploy/REVISION 2>/dev/null || echo "uncommitted" > .deploy/REVISION
}

health() {
  remote "for i in \$(seq 1 30); do curl -fsS -o /dev/null http://127.0.0.1:$PORT/fa && exit 0; sleep 2; done; exit 1"
}

release() {
  build
  local stamp previous
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  previous=$(remote "readlink $ROOT/current || true")

  log "Uploading release $stamp"
  # Hard-link unchanged files against the previous release: only changed files travel
  rsync -az --delete ${previous:+--link-dest="$previous"} -e "ssh -i $SSH_KEY" .deploy/ "$SERVER:$ROOT/releases/$stamp/"
  remote "chown -R alimor:alimor $ROOT/releases/$stamp && ln -sfn $ROOT/releases/$stamp $ROOT/current && systemctl restart alimor-web"

  log "Health check"
  if health; then
    log "Live: $stamp ($(cat .deploy/REVISION))"
    tell "🚀 alimor.ir: نسخهٔ جدید منتشر شد — $(cat .deploy/REVISION) $(git log -1 --pretty=%s 2>/dev/null)"
    remote "ls -1dt $ROOT/releases/* | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf"
  else
    echo "Health check failed" >&2
    tell "⚠️ alimor.ir: انتشار $(cat .deploy/REVISION) ناموفق بود${previous:+ و به نسخهٔ قبلی برگشت}"
    if [ -n "$previous" ]; then
      log "Rolling back to $previous"
      remote "ln -sfn $previous $ROOT/current && systemctl restart alimor-web"
    fi
    remote "journalctl -u alimor-web -n 40 --no-pager" >&2
    exit 1
  fi
}

caddy() {
  log "Installing Caddy site"
  scp -q -i "$SSH_KEY" infra/caddy/alimor.caddy "$SERVER:/tmp/alimor.caddy.new"
  remote bash -s <<'REMOTE'
set -euo pipefail
stamp=$(date -u +%Y%m%dT%H%M%SZ)
dir=/opt/alimor/backups/caddy
mkdir -p "$dir"
cp /etc/caddy/Caddyfile "$dir/Caddyfile.$stamp"
[ -f /etc/caddy/alimor.caddy ] && cp /etc/caddy/alimor.caddy "$dir/alimor.caddy.$stamp"
install -m 644 /tmp/alimor.caddy.new /etc/caddy/alimor.caddy
grep -q '^import /etc/caddy/alimor.caddy' /etc/caddy/Caddyfile || echo 'import /etc/caddy/alimor.caddy' >> /etc/caddy/Caddyfile
if caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
  systemctl reload caddy
  echo "Caddy reloaded"
else
  echo "Caddy validation failed; restoring" >&2
  cp "$dir/Caddyfile.$stamp" /etc/caddy/Caddyfile
  if [ -f "$dir/alimor.caddy.$stamp" ]; then cp "$dir/alimor.caddy.$stamp" /etc/caddy/alimor.caddy; else rm -f /etc/caddy/alimor.caddy; fi
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
  exit 1
fi
REMOTE
}

rollback() {
  local previous
  previous=$(remote "ls -1dt $ROOT/releases/* | sed -n 2p")
  [ -n "$previous" ] || { echo "No previous release" >&2; exit 1; }
  remote "ln -sfn $previous $ROOT/current && systemctl restart alimor-web"
  health && log "Rolled back to $previous"
}

case "${1:-release}" in
  bootstrap) bootstrap ;;
  release) release ;;
  caddy) caddy ;;
  rollback) rollback ;;
  status) remote "systemctl --no-pager status alimor-web | head -5; curl -fsS -o /dev/null -w 'local %{http_code}\n' http://127.0.0.1:$PORT/fa" ;;
  *) echo "usage: $0 bootstrap|release|caddy|rollback|status" >&2; exit 2 ;;
esac

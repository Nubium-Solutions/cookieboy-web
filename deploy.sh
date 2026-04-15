#!/bin/bash
set -e
cd /var/www/cookieboy-web

BEFORE=$(git rev-parse HEAD)
git fetch origin main
git reset --hard origin/main
AFTER=$(git rev-parse HEAD)

if [ "$BEFORE" = "$AFTER" ]; then
  exit 0
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') Deploy $BEFORE -> $AFTER"
npm install --no-audit --no-fund
# Playwright: descarga Chromium si falta (idempotente)
npx --yes playwright install chromium >/dev/null 2>&1 || true
npm run build
pm2 describe cookieboy-web >/dev/null 2>&1 \
  && pm2 reload cookieboy-web --update-env \
  || pm2 start "npm run start" --name cookieboy-web --cwd /var/www/cookieboy-web -i 2
echo "$(date '+%Y-%m-%d %H:%M:%S') Deploy OK"

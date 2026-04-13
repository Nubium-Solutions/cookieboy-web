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
npm ci
npm run build
pm2 reload cookieboy-web || pm2 start "npm run start" --name cookieboy-web --cwd /var/www/cookieboy-web
echo "$(date '+%Y-%m-%d %H:%M:%S') Deploy OK"

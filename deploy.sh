#!/bin/bash
# ──────────────────────────────────────────────────
# FratDex Deploy Script
# Run this ONE command after every git push:
#   ~/fratDex/fratDex/deploy.sh
# ──────────────────────────────────────────────────

set -e  # stop on any error

echo "🔄 Pulling latest code..."
cd ~/fratDex/fratDex
git pull origin main

echo "📂 Copying frontend to Nginx..."
sudo cp -r ~/fratDex/fratDex/MakeNJIT2026/* /var/www/html/

echo "🔁 Restarting FastAPI backend..."
sudo systemctl restart fratdex

echo "⏳ Waiting for API to be ready..."
until curl -sf http://localhost:8000/api/health > /dev/null 2>&1; do
    sleep 2
    echo "   ...still loading InsightFace..."
done

echo ""
echo "✅ Deploy complete!"
echo "   Frontend: http://localhost (Nginx)"
echo "   Backend:  http://localhost:8000 (FastAPI)"
echo ""
echo "   To check logs:  sudo journalctl -u fratdex -f"
echo "   To reopen kiosk: chromium --kiosk http://localhost &"

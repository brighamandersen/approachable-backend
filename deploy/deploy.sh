#!/bin/bash
set -euo pipefail

echo "Deploying approachable-api"

# nginx

sudo ln -sf /home/brig/code/approachable-backend/deploy/nginx.conf /etc/nginx/conf.d/approachable-api.conf

sudo nginx -t
sudo systemctl reload nginx

# backend

cd /home/brig/code/approachable-backend
npm run build

# systemd

sudo ln -sf /home/brig/code/approachable-backend/deploy/systemd.service /etc/systemd/system/approachable-api.service

sudo systemctl daemon-reload
sudo systemctl enable approachable-api.service
sudo systemctl restart approachable-api.service

echo "Deployment complete for approachable-api"

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "[redeploy] docker is not installed or not on PATH" >&2
  exit 1
fi

if ! command -v docker compose >/dev/null 2>&1; then
  echo "[redeploy] docker compose v2 is required" >&2
  exit 1
fi

echo "[redeploy] pulling latest image dependencies (if any)"
docker compose pull --ignore-pull-failures || true

echo "[redeploy] rebuilding containers"
docker compose build

echo "[redeploy] restarting stack"
docker compose up -d --remove-orphans

echo "[redeploy] active containers"
docker compose ps

#!/usr/bin/env bash
# TimeFraim screenshot sandbox: boots an ISOLATED local Supabase project
# ("timefraim-shots") seeded with sample planner data, then starts the TimeFraim
# app against it so scripts/capture-timefraim-screenshots.js has a clean,
# reproducible day to photograph.
#
# The real local project ("timefraim", Docker volume supabase_db_timefraim) is
# never started, reset, or modified: the sandbox uses its own project id, so it
# gets its own containers and volumes. It does reuse the app's ports and .env
# (API 55331, Postgres 55332, server 4000, web 6173), which is why the real
# stack must be stopped first.
#
# Requirements: Docker, the Supabase CLI, corepack (Node 24), curl, and the
# sibling TimeFraim repo with a populated .env.
#
# Usage:
#   bash scripts/timefraim-sandbox/start.sh
#   TIMEFRAIM_DIR=/path/to/timefraim bash scripts/timefraim-sandbox/start.sh
# Tear down with scripts/timefraim-sandbox/stop.sh.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMEFRAIM_DIR="${TIMEFRAIM_DIR:-$HOME/Engineering/GitHub/timefraim}"
WORKDIR="${TIMEFRAIM_SHOTS_WORKDIR:-$HOME/.cache/timefraim-shots}"
PROJECT_ID="timefraim-shots"
PORTS=(4000 6173 55331 55332)
# Services the screenshots never touch; skipping them makes startup faster.
EXCLUDED_SERVICES="studio,imgproxy,inbucket,realtime,storage,edge-runtime,vector,analytics"

log() { printf '\n[timefraim-sandbox] %s\n' "$*"; }
die() { printf '\n[timefraim-sandbox] ERROR: %s\n' "$*" >&2; exit 1; }

[ "$PROJECT_ID" != "timefraim" ] || die "refusing to run against the real project id"
[ -f "$TIMEFRAIM_DIR/supabase/config.toml" ] || die "TimeFraim repo not found at $TIMEFRAIM_DIR (set TIMEFRAIM_DIR)"
[ -f "$TIMEFRAIM_DIR/.env" ] || die "$TIMEFRAIM_DIR/.env is missing; the app reads its local settings from it"
command -v supabase >/dev/null || die "supabase CLI not found on PATH"
command -v corepack >/dev/null || die "corepack not found (it ships with Node 24)"
command -v curl >/dev/null || die "curl not found"
docker info >/dev/null 2>&1 || die "Docker is not running"

for port in "${PORTS[@]}"; do
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    die "port $port is in use. If the real TimeFraim stack is running, stop 'pnpm dev' and run plain 'supabase stop' inside $TIMEFRAIM_DIR (never --no-backup there), then retry."
  fi
done

log "Preparing the scratch project in $WORKDIR"
mkdir -p "$WORKDIR/supabase"
rm -rf "$WORKDIR/supabase/migrations"
cp -R "$TIMEFRAIM_DIR/supabase/migrations" "$WORKDIR/supabase/migrations"
cp "$SCRIPT_DIR/seed.sql" "$WORKDIR/supabase/seed.sql"

# Derive config.toml from the real one so ports and auth settings stay in sync:
# - own project id => own containers and volumes (supabase_db_timefraim-shots)
# - 7-day JWTs so a session minted now is still valid at the fixed capture date
# - Google OAuth off (its env() secrets are not needed for the magic-link login)
# - no edge functions (they are not started for screenshots)
sed -e 's/^project_id = .*/project_id = "timefraim-shots"/' \
    -e 's/^jwt_expiry = .*/jwt_expiry = 604800/' \
    -e '/^\[auth\.external\.google\]/,/^$/{s/^enabled = true/enabled = false/;s/^client_id = .*/client_id = ""/;s/^secret = .*/secret = ""/;}' \
    -e '/^\[functions\./,$d' \
    "$TIMEFRAIM_DIR/supabase/config.toml" > "$WORKDIR/supabase/config.toml"
grep -q '^project_id = "timefraim-shots"$' "$WORKDIR/supabase/config.toml" || die "failed to rewrite project_id in the sandbox config"
grep -q '^jwt_expiry = 604800$' "$WORKDIR/supabase/config.toml" || die "failed to rewrite jwt_expiry in the sandbox config"

# Always start from a fresh sandbox database so the seed is exactly what the
# screenshots show. --project-id is hard-coded to the sandbox, so this can only
# ever delete sandbox volumes.
log "Removing any previous $PROJECT_ID sandbox state"
supabase stop --workdir "$WORKDIR" --project-id "$PROJECT_ID" --no-backup >/dev/null 2>&1 || true

log "Starting the isolated Supabase project $PROJECT_ID"
if ! supabase start --workdir "$WORKDIR" --yes -x "$EXCLUDED_SERVICES"; then
  log "Start with service exclusions failed; retrying with the full stack"
  supabase start --workdir "$WORKDIR" --yes
fi

log "Starting the TimeFraim app (logs: $WORKDIR/dev.log)"
(
  cd "$TIMEFRAIM_DIR"
  COREPACK_ENABLE_DOWNLOAD_PROMPT=0 nohup corepack pnpm dev > "$WORKDIR/dev.log" 2>&1 &
  echo $! > "$WORKDIR/app.pid"
)

wait_for() {
  local url="$1" label="$2" attempt
  for attempt in $(seq 1 90); do
    if curl -sf "$url" >/dev/null 2>&1; then
      log "$label is up at $url"
      return 0
    fi
    sleep 1
  done
  die "$label did not come up at $url (see $WORKDIR/dev.log)"
}
wait_for "http://127.0.0.1:4000/health" "API server"
wait_for "http://127.0.0.1:6173/" "Web app"

log "Sandbox status"
supabase status --workdir "$WORKDIR" || true

log "Supabase database volumes (supabase_db_timefraim is the real one and must be untouched):"
docker volume ls --filter name=supabase_db_timefraim --format '  {{.Name}}'

log "Ready. Capture with:"
printf '  NODE_PATH=<node_modules containing playwright> node --env-file=%s/.env scripts/capture-timefraim-screenshots.js\n' "$TIMEFRAIM_DIR"

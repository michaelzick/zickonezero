#!/usr/bin/env bash
# Tears down the TimeFraim screenshot sandbox started by start.sh: stops the app
# processes it launched and removes the "timefraim-shots" Supabase project
# together with its data volumes. The project id is hard-coded to the sandbox,
# so the real "timefraim" project and its supabase_db_timefraim volume are never
# affected.
#
# Usage:
#   bash scripts/timefraim-sandbox/stop.sh
set -euo pipefail

WORKDIR="${TIMEFRAIM_SHOTS_WORKDIR:-$HOME/.cache/timefraim-shots}"
PROJECT_ID="timefraim-shots"

log() { printf '\n[timefraim-sandbox] %s\n' "$*"; }

[ "$PROJECT_ID" != "timefraim" ] || { echo "refusing to stop the real project" >&2; exit 1; }

# corepack -> pnpm -> node workers: walk the tree so nothing is orphaned.
kill_tree() {
  local pid="$1" child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child"
  done
  kill "$pid" 2>/dev/null || true
}

if [ -f "$WORKDIR/app.pid" ]; then
  log "Stopping the TimeFraim app started by start.sh"
  kill_tree "$(cat "$WORKDIR/app.pid")"
  rm -f "$WORKDIR/app.pid"
  # Belt and braces for anything the tree walk missed.
  for port in 4000 6173; do
    for pid in $(lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true); do
      kill "$pid" 2>/dev/null || true
    done
  done
fi

log "Stopping the $PROJECT_ID Supabase project and deleting its volumes"
if [ -f "$WORKDIR/supabase/config.toml" ]; then
  supabase stop --workdir "$WORKDIR" --project-id "$PROJECT_ID" --no-backup
else
  supabase stop --project-id "$PROJECT_ID" --no-backup
fi

log "Supabase database volumes still present (supabase_db_timefraim must remain):"
docker volume ls --filter name=supabase_db_timefraim --format '  {{.Name}}'

#!/usr/bin/env python3
"""Prune deals_cache.json: keep newest N deals + backfill archive safety.

The gateway's terminal security guard scans tokens that look like file
paths in every command. Data files over 1 MiB fail its bounded read
closed, which blocks innocent `python3 -c` commands that mention the
path. Keep the cache comfortably under 1 MiB so this never recurs.

Strategy:
  1. Keep deals whose published_at (or fetched_at) is within N days (default 21).
  2. Keep newest-M cap (default 400) as a hard ceiling.
  3. Never touch deals with empty published_at (Twitter deals) — they are
     dedupe anchors; there are ~71 and they are small.
"""
import json
import os
import sys
from datetime import datetime, timedelta, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_PATH = os.path.join(SCRIPT_DIR, "deals_cache.json")

MAX_AGE_DAYS = int(os.environ.get("PRUNE_MAX_AGE_DAYS", "21"))
MAX_DEALS = int(os.environ.get("PRUNE_MAX_DEALS", "400"))
SIZE_BUDGET = 900 * 1024  # stay well under the guard's 1 MiB bound


def _ts(deal):
    return deal.get("published_at") or deal.get("fetched_at") or ""


def main():
    with open(CACHE_PATH) as f:
        cache = json.load(f)
    deals = cache["deals"]
    before = len(deals)
    size_before = os.path.getsize(CACHE_PATH)

    cutoff = datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)

    def in_age_window(d):
        ts = _ts(d)
        if not ts:
            return True  # no timestamp → keep (dedupe anchor)
        try:
            t = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        except ValueError:
            return True
        return t >= cutoff

    aged = [d for d in deals if in_age_window(d)]
    # hard cap: newest first by timestamp
    aged.sort(key=_ts, reverse=True)
    kept = aged[:MAX_DEALS]
    # keep original relative order for stable rendering
    kept_ids = {id(d) for d in kept}
    result = [d for d in deals if id(d) in kept_ids]

    pruned = before - len(result)
    cache["deals"] = result
    tmp = CACHE_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)
    os.replace(tmp, CACHE_PATH)
    size_after = os.path.getsize(CACHE_PATH)
    print(
        f"Pruned {pruned} deals ({before} → {len(result)}); "
        f"size {size_before/1024:.0f}KB → {size_after/1024:.0f}KB "
        f"(budget {SIZE_BUDGET//1024}KB)"
    )
    if size_after > SIZE_BUDGET:
        print(
            f"WARNING: still over size budget; lower PRUNE_MAX_DEALS "
            f"(currently {MAX_DEALS}) and re-run",
            file=sys.stderr,
        )
        sys.exit(2)


if __name__ == "__main__":
    main()

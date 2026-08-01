#!/usr/bin/env python3
"""
Add new deals to the deals cache and rebuild index.html.

Usage:
  python3 add_deals.py

This script:
1. Loads deals_cache.json
2. Adds any tweets listed in NEW_TWEETS below (skipping duplicates)
3. Saves the cache
4. Rebuilds index.html from the cache + template

The cron job edits the NEW_TWEETS list below before running this script.
Existing tweets are NEVER refetched — they stay cached.
"""
import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from gen_deals import (
    load_cache,
    save_cache,
    add_deals_to_cache,
    generate_all_cards,
)
import build_index

# ── Tweets to add today (edit this list) ──
# Format: (url, label, badge_color, deal_type, country)
# deal_type: "1fl" (1-for-1), "deal" (discount/promo), "free" (freebie)
# Duplicate tweet IDs are automatically skipped.
# Leave empty [] to just rebuild from existing cache.
NEW_TWEETS = [
]


def main():
    cache = load_cache()
    before = len(cache["deals"])

    if NEW_TWEETS:
        cache, num_new, num_skipped = add_deals_to_cache(NEW_TWEETS, cache)
        save_cache(cache)
        print(f"\nAdded {num_new} new deals, skipped {num_skipped} duplicates", file=sys.stderr)
    else:
        print("No new deals to add — rebuilding from cache only", file=sys.stderr)

    print(f"Cache: {before} → {len(cache['deals'])} deals total", file=sys.stderr)

    # Rebuild index.html
    build_index.main()


if __name__ == "__main__":
    main()

# AGENTS.md — SG Food Deals Operating Manual

> **Read this before touching anything.** This file is injected into every agent session working in this repo.

## Architecture: Modular Build System

```
Content Sources (Agent edits these)          Build (Agent runs this)         Output (NEVER touch)
─────────────────────────────────         ──────────────────────────      ─────────────────────
scripts/posts.json                         python3 scripts/build_index.py  →  index.html
  ↳ post metadata (date, title, slug)                                         (AUTO-GENERATED)

posts/YYYY-MM-DD-slug.html                                                   ⚠️ DO NOT EDIT
  ↳ full article HTML (images, i18n)

scripts/deals_cache.json
  ↳ tweet data + translations + deal_type + country
```

## The Golden Rule

**`index.html` is AUTO-GENERATED. NEVER edit it directly.**

It is rebuilt from scratch on every `python3 scripts/build_index.py` run. Any manual edit will be lost.

A git pre-commit hook will **block** any commit where `index.html` lacks the `AUTO-GENERATED` header.

---

## How to Add a Blog Post (Guide)

### 1. Write the post file

Create `posts/YYYY-MM-DD-slug.html`. Study an existing post for the exact structure:
- Nav is **OUTSIDE** the `.wrap` div
- Use images with proper `<figure>` and attribution captions
- Full **i18n**: every element has `data-en` / `data-zh` attributes
- Warm, appetizing design matching `style.css` (amber/red/lime gradient theme)
- Content focus: food deal guides, where to eat cheap, best hawker stalls, promo roundups

### 2. Add metadata to `scripts/posts.json`

Prepend one entry to the JSON array:

```json
{
  "date": "2026-08-01",
  "slug": "your-slug",
  "country": "SG",
  "title_en": "English Title",
  "title_zh": "中文标题",
  "read_time": 5,
  "excerpt_en": "1-2 sentence English excerpt for the listing card.",
  "excerpt_zh": "1-2句中文摘要。"
}
```

### 3. Rebuild and push

```bash
python3 scripts/build_index.py
git add -A && git commit -m "Daily post: TITLE" && git push
```

**That's it.** The build script handles all sorting, card generation, preview selection, country pills, and assembly.

---

## How to Add Deal Items (from Twitter/X)

### 1. Check what's already cached

```bash
python3 -c "import json; c=json.load(open('scripts/deals_cache.json')); [print(f'{d[\"id\"]} {d[\"label\"]} {d.get(\"deal_type\",\"\")} {d.get(\"country\",\"\")}') for d in c['deals']]"
```

### 2. Search for new food deals on Twitter

Use `bird` CLI to search for Singapore food deals. Try multiple keyword queries:

```bash
# Primary searches
/opt/homebrew/bin/bird search "Singapore food deal OR SG food promo OR 1-for-1 Singapore" -n 20 --plain

# Broader searches for 羊毛 (freebies, promos)
/opt/homebrew/bin/bird search "Singapore free food OR SG food promo code OR Singapore food discount" -n 20 --plain

# Hawker / specific deals
/opt/homebrew/bin/bird search "Singapore hawker promotion OR SG cheap eats OR Singapore 1 for 1 dining" -n 20 --plain

# Chinese-language searches (many SG deal accounts post in Chinese)
/opt/homebrew/bin/bird search "新加坡 美食 优惠 OR 新加坡 买一送一 OR 新加坡 免费食物" -n 20 --plain
```

### 3. Add new deals

Edit `scripts/add_deals.py` → set `NEW_TWEETS` list:

```python
NEW_TWEETS = [
    ("https://x.com/account/status/XXX", "Label", "#color", "1fl", "SG"),
]
```

**Deal types:** `"1fl"` (1-for-1, red tag), `"deal"` (promo/discount, amber tag), `"free"` (freebie, green tag)
**Badge colors:** Use the source account's brand color, or a warm color like `#f59e0b`, `#ef4444`, `#84cc16`
**Country codes:** `SG`, `MY`, `TH`, `JP`, `KR`, `TW`, `HK`, `US`, `UK`, `AU`

### 4. Add Chinese translations

```bash
python3 -c "
import json
cache = json.load(open('scripts/deals_cache.json'))
trans = { 'TWEET_ID': '中文翻译' }
for d in cache['deals']:
    if d['id'] in trans:
        d['translation_zh'] = trans[d['id']]
json.dump(cache, open('scripts/deals_cache.json','w'), ensure_ascii=False, indent=2)
"
```

### 5. Run add_deals.py, clear, rebuild

```bash
python3 scripts/add_deals.py
# Edit scripts/add_deals.py → set NEW_TWEETS = []
python3 scripts/build_index.py
git add -A && git commit -m "Deals update (N new)" && git push
```

---

## Selection Criteria for Deals

Pick tweets that are **actual food deals** worth sharing:
- ✅ 1-for-1 dining promotions
- ✅ Free food / freebies (e.g., free coffee, free dessert)
- ✅ Promo codes and discount codes
- ✅ Flash sales and limited-time offers
- ✅ Student/senior/military discounts
- ✅ Credit card dining promos (e.g., DBS, UOB, OCBC)
- ✅ New restaurant opening promos
- ❌ Skip: generic food photos without deals, restaurant reviews, personal opinions, spam

---

## Image Attribution Rule

**Every deal card with an image must cite its source.** The tweet URL in the "View source" link serves as attribution. For blog post images, always use:

```html
<figure>
  <img src="URL" alt="Description" />
  <figcaption>Photo: Source Name via Twitter/X</figcaption>
</figure>
```

---

## File Reference

| File | Editable? | Purpose |
|------|-----------|---------|
| `scripts/posts.json` | ✅ Yes | Post metadata manifest |
| `posts/*.html` | ✅ Yes | Full article pages (images, i18n) |
| `scripts/deals_cache.json` | ✅ Yes | Cached tweet data + translations |
| `scripts/add_deals.py` | ✅ Yes (temporarily) | Add new tweets, then clear `NEW_TWEETS` |
| `scripts/build_index.py` | ⚠️ Careful | The build engine |
| `scripts/gen_deals.py` | ⚠️ Careful | Tweet card generator |
| `index_template.html` | ⚠️ Structure only | HTML skeleton with placeholders |
| `index.html` | ❌ NEVER | Auto-generated |
| `style.css` | ✅ Yes | Shared styles (warm food theme) |
| `app.js` | ✅ Yes | Theme toggle, tab switching, i18n, country filter |

---

## Cron Schedule

| Time (SGT) | Job |
|------------|-----|
| **08:00** | Write daily guide post + fetch new deals |
| **20:00** | Fetch new deals only (catch afternoon/evening promos) |

---

## Do NOT

- **Do NOT** edit `index.html` — it's generated and will be overwritten.
- **Do NOT** add post/deal HTML to `index_template.html` — use the JSON manifests.
- **Do NOT** touch `posts/*.html` unless writing/editing that specific article.
- **Do NOT** use first person "I" — posts are anonymous.
- **Do NOT** post non-food deals — this is a food deals blog.
- **Do NOT** forget image attribution — always cite the source.
- **Do NOT** add deals without Chinese translations — every deal needs a `translation_zh`.

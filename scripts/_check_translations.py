import json
c = json.load(open('scripts/deals_cache.json'))
for d in c['deals']:
    miss_t = not d.get('translation_zh', '').strip()
    miss_e = d.get('source_type') == 'rss' and not d.get('excerpt_zh', '').strip()
    if miss_t or miss_e:
        text = d['title'] if d.get('source_type') == 'rss' else d.get('tweet_data', {}).get('text', '')
        excerpt = d.get('excerpt', '')[:200] if d.get('source_type') == 'rss' else ''
        print(f'{d["id"]}|need:{"T" if miss_t else ""}{"E" if miss_e else ""}|{text[:120]}')
        if excerpt:
            print(f'  excerpt: {excerpt}')
        print()

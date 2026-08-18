import json
c = json.load(open('scripts/deals_cache.json'))
targets = ['fcd2e35cf2212989', '4f919984e5195ba6', '3972a907bf6c06f3', 'b620cd08c5e6a450']
for d in c['deals']:
    if d['id'] in targets:
        print(f'=== {d["id"]} | {d.get("source_name","")} ===')
        print(f'TITLE: {d.get("title","")}')
        print(f'EXCERPT: {d.get("excerpt","")}')
        print()
# Also: check A&W waffle deal + YAYOI happy hour beer (weekday dessert-adjacent)
for d in c['deals']:
    t = (d.get('title','') + ' ' + d.get('excerpt','')).lower()
    if ('godzilla' in t or 'yayoi' in t) and d.get('published_at','') >= '2026-08-08':
        print(f'=== {d["id"]} | {d.get("source_name","")} ===')
        print(f'TITLE: {d.get("title","")}')
        print(f'EXCERPT: {d.get("excerpt","")[:400]}')
        print()

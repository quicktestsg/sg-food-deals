import json

cache = json.load(open('scripts/deals_cache.json'))

trans = {
    'fa5079b8616033c6': 'McDonald\'s Samurai Samurai Burger 携新搭档回归 8月20日起',
    '1cf115008c7827b3': 'More Yogurt 买一送一 星耀樟宜(14-16日)及Waterway Point(17-19日)',
    '5602e5a6162f08e3': 'Sheng Siong 自家品牌4天特卖 最高省46%(14-17日)',
    'eb310a302155db0f': 'Prime超市 WOW优惠 仅限4天(14-17日)',
    '0d2e22cc957c5c99': 'Giant yuu会员3天特卖 最高半价(14-16日)',
    '8d76a38063916e4a': 'Meatsmith庆全球50强 排名 8月27日送101个汉堡',
    'c7fc606a6d172124': 'SaSa新加坡 8月13日起 任意消费送$5现金券',
    '6884bae4ff3b03e9': 'TamJai SamGor 8月13日起 $9.90++ 超值套餐含饮料或小食',
    '0bcb1945061dbd87': 'METRO x Lacoste 8月14-27日 免费香水体验装 长堤坊',
    'b10c4b87f6fde789': 'Unity药房 8月13-19日 Herbal Essences洗发/护发 仅需199 Linkpoints',
    '9e1fc7021c28fe3b': 'McDonald\'s Chiikawa开心乐园餐 8月13日-9月10日 收集8款限定玩具',
    '3841c183dfdbad34': 'Haidilao x POP TOY SHOW 8月13日-9月30日 到店3次送盲盒',
    '19af0939de1f4f0a': 'LINK Outlet 8月11-17日 Shaw Plaza 最低3折大牌特卖',
    'd32ddaa419a8b453': 'Cold Storage精选杂货优惠 至8月19日 日常食材省钱好时机',
    '29e88df8751a58a3': 'Collective @ Dao by Dorsett SAFRA 1换1主食 至9月30日',
    'd6c613f7b76f64ad': 'Cold Storage Milo买2送1 8月13-19日 家庭囤货好时机',
    '31b626631d965615': 'Secret Recipe 8月21日 大坡精选蛋糕半价 周年庆特卖',
    '218610ba0319680e': 'Popeyes 8月17-30日 Chicken Mania 5块炸鸡桶仅$10.90',
    'deeadb00373f198f': 'Haidilao 学生套餐$29.90++ 8月13日起 指定门店',
    '901f4edd8f0d548f': 'HaveFun KTV Downtown East开幕 喜力啤酒塔仅$26.80',
    'd6a1b5b81f4fc2ef': 'McDonald\'s Samurai Burger 8月18-30日 回归+新配菜+限定Pop-Up活动',
}

excerpts = {
    'fa5079b8616033c6': '全新Katsu鸡条、Kyoho葡萄冰淇淋及草莓大福派登场',
    '1cf115008c7827b3': '以全新方式体验酸奶，买一送一限定时段',
    '5602e5a6162f08e3': 'Sheng Siong自家品牌4天超级特卖，8月14-17日，最高省46%',
    'eb310a302155db0f': 'Prime超市WOW优惠仅限4天，至8月17日，售完即止',
    '0d2e22cc957c5c99': 'Giant yuu会员专属3天特卖，8月14-16日，最高半价',
    '8d76a38063916e4a': 'Meatsmith庆祝全球50强排名，8月27日上午11:30起免费送101个MSX芝士汉堡',
    'c7fc606a6d172124': 'SaSa新加坡8月13日起，任意消费即送$5现金券，全岛门店适用',
    '6884bae4ff3b03e9': 'TamJai SamGor超值套餐$9.90++，8月13日起，每周不同碗款配饮料或小食',
    '0bcb1945061dbd87': 'METRO长堤坊L1的Lacoste Pop-Up，8月14-27日，出示活动帖即可领免费香水体验装',
    'b10c4b87f6fde789': 'Unity药房8月13-19日，Linkpoints会员仅需199积分兑换Herbal Essences洗发/护发100ml装',
    '9e1fc7021c28fe3b': 'McDonald\'s Chiikawa开心乐园餐，8月13日-9月10日，8款限定玩具分4周推出',
    '3841c183dfdbad34': 'Haidilao携手POP TOY SHOW，8月13日-9月30日，到店3次即可获随机盲盒',
    '19af0939de1f4f0a': 'LINK Outlet Store最低3折特卖，涵盖Adidas、Under Armour、Crocs等品牌，Shaw Plaza，8月11-17日',
    'd32ddaa419a8b453': 'Cold Storage精选杂货优惠至8月19日，涵盖生鲜及日常食材',
    '29e88df8751a58a3': 'SAFRA会员可享1换1主食(最高价值$68++)，另享全单8折，8月1日-9月30日',
    'd6c613f7b76f64ad': 'Cold Storage Milo买2送1，8月13-19日，家庭囤货好时机',
    '31b626631d965615': 'Secret Recipe周年庆，8月21日中午12点起，精选整蛋糕半价，售完即止',
    '218610ba0319680e': 'Popeyes限定Chicken Mania优惠，8月17-30日，5块炸鸡桶仅$10.90(原价$24.50)',
    'deeadb00373f198f': 'Haidilao学生套餐$29.90++，8月13日起，指定门店指定时段',
    '901f4edd8f0d548f': 'HaveFun Downtown East开幕优惠，喜力啤酒塔仅$26.80(原价$117.50)',
    'd6a1b5b81f4fc2ef': 'McDonald\'s Samurai Burger 8月18-30日回归，配Katsu鸡条、海盐薯条、Kyoho葡萄甜品及草莓大福派',
}

for d in cache['deals']:
    if d['id'] in trans:
        d['translation_zh'] = trans[d['id']]
    if d['id'] in excerpts:
        d['excerpt_zh'] = excerpts[d['id']]

json.dump(cache, open('scripts/deals_cache.json', 'w'), ensure_ascii=False, indent=2)
print(f'Updated {len(trans)} titles, {len(excerpts)} excerpts')

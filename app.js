// ═══ SG Food Deals ═══

// ─── Theme toggle ───
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('food-theme');
if (saved) root.setAttribute('data-theme', saved);

toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('food-theme', next);
});

// ─── i18n (中英文切换) ───
const i18n = {
    en: {
        'nav.about': 'About',
        'nav.posts': 'Guides',
        'intro.badge': 'Fresh deals daily',
        'intro.tagline': 'Singapore food deals & steals, <em>updated every day.</em>',
        'intro.bio': '1-for-1s, freebies, flash promos, and all the 羊毛 worth your time. Curated from across the island so you never miss a bite.',
        'blog.recent': 'Recent Guides',
        'deals.title': 'Today\'s Deals',
        'deals.subtitle': 'Curated from social media — promo codes, 1-for-1s, freebies & flash sales',
        'deals.viewSource': 'View source →',
        'preview.allPosts': 'View all',
        'preview.allDeals': 'View all deals',
        'about.title': 'About',
        'about.p1': 'SG Food Deals is a daily-updated blog that rounds up the best food deals, promos, and steals across Singapore.',
        'about.p2': 'From 1-for-1 dining to free coffee, student discounts to flash promos — if it\'s a 羊毛 worth sharing, it\'s here. We expand country by country.',
        'about.p3': 'Updated daily by an AI agent scanning social media.',
        'lang.switchTo': '中文',
        'country.all': 'All Countries',
    },
    zh: {
        'nav.about': '关于',
        'nav.posts': '攻略',
        'intro.badge': '每日更新好价',
        'intro.tagline': '新加坡美食羊毛，<em>每天更新。</em>',
        'intro.bio': '买一送一、免费福利、限时优惠，所有值得薅的羊毛都在这里。精选全岛好价，不错过每一口。',
        'blog.recent': '最新攻略',
        'deals.title': '今日优惠',
        'deals.subtitle': '精选自社交媒体——优惠码、买一送一、免费福利与限时促销',
        'deals.viewSource': '查看来源 →',
        'preview.allPosts': '查看全部',
        'preview.allDeals': '查看全部优惠',
        'about.title': '关于',
        'about.p1': 'SG Food Deals 是一个每日更新的博客，汇总新加坡最划算的美食优惠、促销和羊毛。',
        'about.p2': '从买一送一到免费咖啡，从学生折扣到限时促销——只要是值得分享的羊毛，都在这里。我们会逐步扩展到更多国家。',
        'about.p3': '每天由 AI 智能体从社交媒体精选更新。',
        'lang.switchTo': 'EN',
        'country.all': '全部国家',
    }
};

function detectLang() {
    const saved = localStorage.getItem('food-lang');
    if (saved && i18n[saved]) return saved;
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    return browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function applyLang(lang) {
    const strings = i18n[lang] || i18n.en;

    // 1. data-i18n — UI strings (textContent)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (strings[key]) el.textContent = strings[key];
    });

    // 2. data-i18n-html — UI strings with HTML (innerHTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (strings[key]) el.innerHTML = strings[key];
    });

    // 3. data-en / data-zh — inline content translation
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        el.innerHTML = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
    });

    // 4. Deal cards "View source"
    document.querySelectorAll('.deal-open').forEach(el => {
        el.textContent = strings['deals.viewSource'];
    });

    document.documentElement.setAttribute('lang', lang);

    const langLabel = document.querySelector('.lang-label');
    if (langLabel) langLabel.textContent = lang === 'en' ? '中文' : 'EN';
}

let currentLang = detectLang();
applyLang(currentLang);

const langToggle = document.getElementById('langToggle');
langToggle?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    localStorage.setItem('food-lang', currentLang);
    applyLang(currentLang);
});

// ─── Feed tabs (Preview | Posts | Deals) ───
function switchFeed(target) {
    document.querySelectorAll('.feed-tabs .tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.feed === target);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === 'pane-' + target);
    });
    localStorage.setItem('food-feed', target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.feed-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchFeed(btn.dataset.feed));
});

document.querySelectorAll('.preview-more').forEach(btn => {
    btn.addEventListener('click', () => switchFeed(btn.dataset.feed));
});

const savedFeed = localStorage.getItem('food-feed');
if (savedFeed === 'posts' || savedFeed === 'deals') {
    switchFeed(savedFeed);
}

// ─── Country filter ───
document.querySelectorAll('.country-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.country-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const country = pill.dataset.country;
        // Filter deal cards
        document.querySelectorAll('.deal-card').forEach(card => {
            if (country === 'all' || card.dataset.country === country) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        // Filter post items
        document.querySelectorAll('.post-item').forEach(card => {
            if (country === 'all' || card.dataset.country === country) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ─── Image lightbox ───
(function() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
        <img src="" alt="" />
    `;
    document.body.appendChild(overlay);

    const lbImg = overlay.querySelector('img');
    const lbClose = overlay.querySelector('.lightbox-close');

    function open(src) {
        lbImg.src = src;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        const mediaLink = e.target.closest('.deal-media');
        if (mediaLink) {
            e.preventDefault();
            const full = mediaLink.getAttribute('data-full') || mediaLink.querySelector('img')?.src;
            if (full) open(full);
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.closest('.lightbox-close')) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();

// ─── Nav scroll state ───
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');
}, { passive: true });

// ─── Nav dropdown menu ───
(function() {
    const menuBtn = document.getElementById('navMenuBtn');
    const dropdown = document.getElementById('navDropdown');
    if (!menuBtn || !dropdown) return;

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#navDropdown') && !e.target.closest('#navMenuBtn')) {
            dropdown.classList.remove('open');
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') dropdown.classList.remove('open');
    });
})();

// ─── Reading progress bar ───
const progress = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
    if (!progress) return;
    const winHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / winHeight) * 100;
    progress.style.width = Math.min(scrolled, 100) + '%';
}, { passive: true });

// ─── OneSignal Push + Email ───
const ONESIGNAL_APP_ID = '28fd6467-beb3-4134-b11b-e3a029f7a77d';

// Helper: run code after OneSignal SDK is ready
function whenOneSignalReady(fn) {
    if (window.OneSignalDeferred) {
        window.OneSignalDeferred.push(async function(OneSignal) {
            try { await fn(OneSignal); } catch(e) { console.warn('OneSignal:', e); }
        });
    }
}

// ─── Push notification toggle (nav bell + footer button) ───
function setupPushButtons() {
    const buttons = [
        document.getElementById('pushToggle'),
        document.getElementById('footerPushBtn'),
    ].filter(Boolean);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            whenOneSignalReady(async (OneSignal) => {
                const permitted = OneSignal.Notifications.permission;
                if (permitted) {
                    // Already subscribed — show feedback
                    const lang = document.documentElement.getAttribute('lang');
                    btn.textContent = lang === 'zh' ? '✅ 已开启推送' : '✅ Push enabled';
                    btn.classList.add('subscribed');
                    return;
                }
                // Request permission — triggers browser native prompt
                await OneSignal.Notifications.requestPermission();
            });
        });
    });

    // Update button state if already subscribed
    whenOneSignalReady(async (OneSignal) => {
        if (OneSignal.Notifications.permission) {
            buttons.forEach(btn => {
                const lang = document.documentElement.getAttribute('lang');
                btn.textContent = lang === 'zh' ? '✅ 已开启推送' : '✅ Push enabled';
                btn.classList.add('subscribed');
            });
        }
    });
}
setupPushButtons();

// ─── Email subscription via OneSignal ───
(function() {
    const form = document.getElementById('emailSubscribeForm');
    const success = document.getElementById('emailSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value.trim();
        if (!email) return;

        const btn = form.querySelector('button');
        const origText = btn.textContent;
        btn.textContent = '...';
        btn.disabled = true;

        try {
            whenOneSignalReady(async (OneSignal) => {
                // Add email subscription to current OneSignal user
                await OneSignal.User.addEmail(email);
                form.style.display = 'none';
                success.classList.add('show');
            });
            // Fallback: also send to Formspree as backup
            await fetch('https://formspree.io/f/mqervnja', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, _subject: 'Email subscribe', source: 'sg-food-deals-onesignal' })
            }).catch(() => {}); // ignore errors — OneSignal is primary
        } catch (err) {
            btn.textContent = origText;
            btn.disabled = false;
            // Even if OneSignal fails, show success (Formspree fallback)
            form.style.display = 'none';
            success.classList.add('show');
        }
    });
})();

// ─── Contact form (Formspree — used on About/Contact pages) ───
(function() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('contactSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const origText = btn.textContent;
        btn.textContent = '...';
        btn.disabled = true;

        try {
            const res = await fetch('https://formspree.io/f/mqervnja', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: form.querySelector('[name="name"]')?.value || '',
                    email: form.querySelector('[name="email"]')?.value || '',
                    message: form.querySelector('[name="message"]')?.value || '',
                    _subject: 'Contact form message',
                    source: 'sg-food-deals'
                })
            });
            if (!res.ok) throw new Error('Submit failed');
            form.style.display = 'none';
            success.classList.add('show');
        } catch (err) {
            btn.textContent = origText;
            btn.disabled = false;
            alert('Something went wrong. Please try again.');
        }
    });
})();

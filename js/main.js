/**
 * NLP Group – Main JS
 * Handles: navbar scroll, mobile menu, modal, calculator, GA4 events, page-links from DB
 */

/* ── GA4 Event Helper ────────────────────────── */
function trackEvent(name, params) {
    if (typeof gtag === 'function') {
        gtag('event', name, Object.assign({ trang_nguon: window.location.pathname }, params || {}));
    }
}

/* ── URL Database loader ─────────────────────── */
let siteDB = null;

async function loadDB() {
    try {
        // Resolve path to admin/db.json from any depth
        const depth = (window.location.pathname.match(/\//g) || []).length;
        const prefix = depth <= 2 ? './' : '../'.repeat(depth - 2);
        const res = await fetch(prefix + 'admin/db.json');
        siteDB = await res.json();
        applyDBLinks();
        applyGATag();
    } catch (e) {
        console.warn('DB load failed, using static links.', e);
    }
}

function applyDBLinks() {
    if (!siteDB || !siteDB.pages) return;
    document.querySelectorAll('[data-page-slug]').forEach(el => {
        const slug = el.getAttribute('data-page-slug');
        const page = siteDB.pages.find(p => p.slug === slug);
        if (page && page.status === 'active') {
            el.href = page.url;
            if (page.title) el.title = page.title;
        }
    });
    document.querySelectorAll('[data-slug]').forEach(el => {
        const slug = el.getAttribute('data-slug');
        const page = siteDB.pages.find(p => p.slug === slug);
        if (page && page.status === 'active') {
            el.href = page.url;
        }
    });
}

function applyGATag() {
    if (!siteDB || !siteDB.settings) return;
    const gid = siteDB.settings.google_tag;
    if (gid && !document.querySelector(`script[src*="${gid}"]`)) {
        const s1 = document.createElement('script');
        s1.async = true;
        s1.src = `https://www.googletagmanager.com/gtag/js?id=${gid}`;
        document.head.appendChild(s1);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', gid);
    }
}

/* ── GA4: Hotline click ──────────────────────── */
document.addEventListener('click', function(e) {
    const btn = e.target.closest('a[href^="tel:"]');
    if (!btn) return;
    const phone = (btn.getAttribute('href') || '').replace('tel:', '').replace(/\s/g, '');
    const viTriNut = btn.closest('footer') ? 'chan_trang'
                   : btn.closest('nav')    ? 'dau_trang'
                   : btn.closest('[class*="fixed"]') ? 'nut_noi' : 'trong_bai';
    trackEvent('bam_goi_hotline', {
        so_dien_thoai: phone,
        vi_tri_nut: viTriNut,
        loai_thiet_bi: /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent) ? 'dien_thoai' : 'may_tinh'
    });
}, true);

/* ── GA4: Zalo FAB click ─────────────────────── */
document.addEventListener('click', function(e) {
    const btn = e.target.closest('a[href*="zalo.me"]');
    if (!btn) return;
    const viTriNut = btn.classList.contains('fab-zalo') ? 'fab' : 'trong_bai';
    trackEvent('bam_chat_zalo', { vi_tri_nut: viTriNut });
}, true);

/* ── GA4: Product card click ─────────────────── */
document.addEventListener('click', function(e) {
    const card = e.target.closest('[data-product-name]');
    if (!card) return;
    trackEvent('xem_san_pham', {
        ten_san_pham: card.getAttribute('data-product-name') || '',
        loai_san_pham: card.getAttribute('data-product-type') || ''
    });
}, true);

/* ── Navbar ──────────────────────────────────── */
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
        nav.classList.toggle('shadow-md', window.scrollY > 10);
    }, { passive: true });

    const btn  = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            const open = !menu.classList.contains('hidden');
            menu.classList.toggle('hidden', open);
            const icon = btn.querySelector('i');
            if (icon) icon.className = open ? 'fa-solid fa-bars text-2xl' : 'fa-solid fa-xmark text-2xl';
        });
        document.addEventListener('click', e => {
            if (!nav.contains(e.target)) menu.classList.add('hidden');
        });
    }
})();

/* ── Lead Modal ──────────────────────────────── */
const modal = document.getElementById('leadModal');

window.openModal = function(service) {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    trackEvent('bam_mo_modal', { vi_tri_nut: 'cta_button', dich_vu: service || '' });
    if (service) {
        const sel = document.querySelector('#contactForm select');
        if (sel) {
            const opt = [...sel.options].find(o => o.text.toLowerCase().includes(service.toLowerCase()));
            if (opt) sel.value = opt.value;
        }
    }
};

window.closeModal = function() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
};

if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── Form Submit ─────────────────────────────── */
window.submitForm = function(e) {
    e.preventDefault();
    const form       = e.target;
    const submitBtn  = form.querySelector('button[type="submit"]');
    const origHTML   = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
    submitBtn.disabled  = true;

    const serviceVal = form.querySelector('select')?.value || '';
    const data = {
        type:    'lead',
        name:    form.querySelector('input[type="text"]')?.value,
        phone:   form.querySelector('input[type="tel"]')?.value,
        service: serviceVal,
        source:  window.location.pathname,
        time:    new Date().toISOString(),
    };

    const leads = JSON.parse(localStorage.getItem('nlpgroup_leads') || '[]');
    leads.unshift(data);
    localStorage.setItem('nlpgroup_leads', JSON.stringify(leads));

    // GA4 lead event
    const dich_vu = serviceVal.toLowerCase().includes('trạm sạc') || serviceVal.toLowerCase().includes('ev') ? 'ev'
                  : serviceVal.toLowerCase().includes('hybrid') ? 'hybrid' : 'solar';
    trackEvent('submit_form_lead', { dich_vu, source: data.source });

    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã Gửi Thành Công!';
        submitBtn.classList.replace('bg-solar-600', 'bg-green-600');
        submitBtn.classList.remove('hover:bg-solar-700');

        setTimeout(() => {
            closeModal();
            form.reset();
            submitBtn.innerHTML = origHTML;
            submitBtn.disabled  = false;
            submitBtn.classList.replace('bg-green-600', 'bg-solar-600');
            submitBtn.classList.add('hover:bg-solar-700');
        }, 2000);
    }, 900);
};

/* ── Calculator ──────────────────────────────── */
let calcDebounce = null;
window.updateCalculator = function() {
    const slider = document.getElementById('billSlider');
    if (!slider) return;

    const billValue = parseInt(slider.value);
    const fmt = new Intl.NumberFormat('vi-VN');

    document.getElementById('billDisplay').innerText = fmt.format(billValue) + ' đ';

    let kwp = (billValue / 300000).toFixed(1);
    if (parseFloat(kwp) < 3) kwp = '3.0';

    const area       = Math.round(parseFloat(kwp) * 5);
    const yearlySave = Math.round(billValue * 12 * 0.6);
    const trees      = Math.round(parseFloat(kwp) * 10);
    const payback    = (parseFloat(kwp) * 18000000 / yearlySave).toFixed(1);

    document.getElementById('powerResult').innerText  = `~ ${kwp} kWp`;
    document.getElementById('areaResult').innerText   = `~ ${area} m²`;
    document.getElementById('savingResult').innerText = `~ ${fmt.format(yearlySave)} đ`;
    document.getElementById('treeResult').innerText   = trees;
    const pr = document.getElementById('paybackResult');
    if (pr) pr.innerText = `~ ${payback} năm`;

    // GA4 debounced – fire after 800ms idle
    clearTimeout(calcDebounce);
    calcDebounce = setTimeout(() => {
        const bucket = billValue < 3000000  ? 'duoi_3tr'
                     : billValue < 10000000 ? '3tr_10tr'
                     : billValue < 30000000 ? '10tr_30tr' : 'tren_30tr';
        trackEvent('bam_tinh_toan', { hoa_don_value: bucket });
    }, 800);
};

/* ── Page init ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-fade');
    updateCalculator();
    loadDB();

    // Active nav link highlight
    const path = window.location.pathname;
    document.querySelectorAll('nav a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href && href !== '#' && href.length > 1) {
            const hPath = new URL(href, window.location.href).pathname;
            if (hPath !== '/' && path.startsWith(hPath)) {
                a.classList.add('text-solar-600', '!font-bold');
            }
        }
    });
});

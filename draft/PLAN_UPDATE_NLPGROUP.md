# PLAN UPDATE — nlpgroup.com.vn
**Phiên bản:** v1.0 | **Cập nhật:** 2026-01-10  
**Nguồn tham khảo:** `draft/TMT-EGREEN/` (TMT-EGREEN.com)  
**Mục tiêu:** Nâng cấp toàn diện giao diện, UX, tính năng và hạ tầng kỹ thuật của `nlpgroup.com.vn` để đạt chuẩn thương mại thực tiễn B2B/B2C có thể kinh doanh.

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### 1.1 Cấu trúc trang hiện tại (đã có)

| Trang | Path | Trạng thái |
|-------|------|-----------|
| Trang chủ | `index.html` | ✅ Tốt – cần nâng cấp hero + animations |
| Điện mặt trời | `pages/dien-mat-troi/` | ✅ Có – cần thêm ảnh thực tế |
| Biến tần Hòa lưới | `pages/dien-mat-troi/bien-tan-hoa-luoi/` | ✅ Có |
| Biến tần Hybrid | `pages/dien-mat-troi/bien-tan-hybrid/` | ✅ Có |
| Tấm pin Solar | `pages/dien-mat-troi/tam-pin-solar/` | ✅ Có |
| Pin Lưu trữ | `pages/dien-mat-troi/pin-luu-tru/` | ✅ Có |
| Trụ sạc ô tô | `pages/tru-sac/` | ✅ Có – cần ROI calculator tốt hơn |
| Trụ sạc DC | `pages/tru-sac/tru-sac-dc/` | ✅ Có |
| Trụ sạc AC | `pages/tru-sac/tru-sac-ac/` | ✅ Có |
| Dịch vụ | `pages/dich-vu/` | ✅ Có |
| Thuê – Mua | `pages/dich-vu/thue-mua/` | ✅ Có |
| Trả chậm 0% | `pages/dich-vu/tra-cham/` | ✅ Có |
| Tin tức | `pages/tin-tuc/` | ✅ Có – cần nội dung thực |
| Liên hệ | `pages/lien-he/` | ✅ Có |
| Admin | `admin/index.html` | ✅ Có – cần hoàn thiện |
| 404 | `404.html` | ✅ Có |

### 1.2 Thiếu so với TMT-EGREEN (Gap Analysis)

| Chức năng | TMT-EGREEN | nlpgroup | Ưu tiên |
|-----------|-----------|---------|---------|
| Trang "Về chúng tôi" + Timeline | ✅ | ❌ | P1 |
| Trang Đăng ký đối tác nhượng quyền | ✅ | ❌ | P1 |
| GA4 Event Tracking chi tiết | ✅ 7 events | ❌ | P1 |
| WOW.js scroll animations | ✅ | ❌ | P2 |
| Swiper slider sản phẩm | ✅ | ❌ | P2 |
| Bản đồ tương tác Leaflet | ✅ | ❌ | P2 |
| Form đối tác cascade select (tỉnh/phường) | ✅ | ❌ | P1 |
| App download CTAs (CH Play / App Store) | ✅ | ❌ | P3 |
| Mobile-first design nghiêm ngặt | ✅ | Một phần | P1 |
| Glassmorphism section tối | ✅ | Một phần | P2 |
| Footer đầy đủ (MST, social, app store) | ✅ | Thiếu MST | P2 |
| Trang Điều khoản + Bảo mật | ❌ | ❌ | P3 |
| SEO Schema.org WebPage/Organization | ✅ | ❌ | P1 |
| Admin: Quản lý Leads đầy đủ | N/A | Một phần | P1 |
| Admin: Cài đặt site từ panel | N/A | Cơ bản | P1 |
| Blog thực với nội dung | ✅ | Khung | P2 |

---

## 2. DANH SÁCH TASK UPDATE (Ưu tiên P1 → P3)

### 🔴 P1 — Phải làm ngay (Tuần 1)

#### T1.1 – Tạo trang "Về chúng tôi"
- **Path:** `pages/ve-chung-toi/index.html`
- **Nội dung:** Hero banner, Timeline công ty NLP Group, Đội ngũ lãnh đạo, Sứ mệnh/Tầm nhìn, Số liệu ấn tượng (số dự án, kWp lắp đặt, khách hàng)
- **Style học từ tmt:** Hero fullscreen với overlay tối, timeline dạng alternating left/right, glassmorphism numbers overlay
- **Học từ:** `draft/TMT-EGREEN/ve-chung-toi.html`
- **Slug DB:** `ve-chung-toi`
- **Navbar:** Thêm link "Về chúng tôi" vào menu chính

#### T1.2 – Tạo trang Đăng ký đối tác
- **Path:** `pages/doi-tac/index.html`
- **Nội dung:** 4 benefit cards đối tác (% hoa hồng, hỗ trợ kỹ thuật, exclusive zone), Form đăng ký 2-cột (Tên, SĐT, Tỉnh/Thành, Loại đối tác)
- **Style học từ tmt:** `dang-ky-doi-tac.html` – backdrop blur glassmorphism dark section, cascade select tỉnh/thành
- **API cascade tỉnh/thành:** Dùng `https://provinces.open-api.vn/api/p/` (miễn phí, không cần đăng ký)
- **Slug DB:** `dang-ky-doi-tac`

#### T1.3 – GA4 Event Tracking
- **File:** `js/main.js` – bổ sung tracking events
- **Events cần thêm:**
  - `bam_goi_hotline` – click tel: links (vị trí: header/footer/fab/trong_bai)
  - `bam_mo_modal` – click "Tư vấn ngay" / "Khảo sát miễn phí"
  - `submit_form_lead` – submit form thành công (kèm service type)
  - `xem_san_pham` – click vào trang sản phẩm
  - `bam_chat_zalo` – click Zalo FAB
  - `bam_tinh_toan` – di chuyển slider calculator
- **Setup:** Thêm `G-XXXXXXXXXX` vào `admin/db.json` → `settings.google_tag`

#### T1.4 – Schema.org SEO Markup
- **File:** `index.html` + tất cả trang trong `pages/`
- **Schema cần thêm:**
  - `Organization` – tên, địa chỉ, SĐT, logo, sameAs (social)
  - `WebPage` + `BreadcrumbList` trên các trang con
  - `Product` + `Offer` trên trang sản phẩm inverter
  - `LocalBusiness` trên trang liên hệ
  - `FAQPage` trên các trang có FAQ accordion

#### T1.5 – Admin Panel hoàn thiện
- **Thêm trang:** `admin/pages.html` – quản lý trang/slug CRUD đầy đủ
- **Thêm trang:** `admin/leads.html` – danh sách leads từ localStorage + export CSV
- **Thêm trang:** `admin/settings.html` – chỉnh SĐT, email, GA4 ID, FB Pixel, bật maintenance
- **Cải thiện:** `admin/db.json` – thêm field `meta_og_image`, `canonical`, `breadcrumb`
- **Email thực:** Đổi `contact@muabandien.com` → `contact@nlpgroup.com.vn` trong db.json

---

### 🟠 P2 — Nâng cấp UI/UX (Tuần 2)

#### T2.1 – WOW.js Scroll Animations
- **CDN:** `https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js`
- **CSS:** `https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css`
- **Áp dụng:** Tất cả section cards dùng `class="wow fadeIn"` / `wow fadeInLeft` với `data-wow-delay`
- **File:** Khởi tạo `new WOW().init()` trong `js/main.js`
- **Học từ:** `draft/TMT-EGREEN/index.html` section stats, benefit cards

#### T2.2 – Swiper Product Slider
- **CDN:** `swiper-bundle.min.js` + `swiper-bundle.min.css`
- **Vị trí:** Section sản phẩm trang chủ (4 cards inverter) → chuyển thành Swiper trên mobile (1 card/slide)
- **Config:** `slidesPerView: 1.2`, `spaceBetween: 16`, breakpoints desktop `slidesPerView: 4`
- **Học từ:** `draft/TMT-EGREEN/` swiper gallery trụ sạc

#### T2.3 – Nâng cấp Hero Section
- **Thay ảnh Unsplash placeholder** → ảnh thực dự án NLP Group (hoặc stock có bản quyền tương đối)
- **Thêm video background loop** (optional, dùng `<video autoplay muted loop playsinline>`) hoặc ảnh WebP tối ưu
- **Thêm stats strip** dưới hero: số dự án đã lắp / kWp / khách hàng / năm kinh nghiệm (học tmt hero stats grid)

#### T2.4 – Footer Nâng cấp
- **Thêm:** MST doanh nghiệp (Giấy phép kinh doanh số ...)
- **Thêm:** Link app CH Play / App Store (nếu có app riêng)
- **Thêm:** Chính sách bảo mật link, Điều khoản sử dụng link
- **Thêm:** Copyright với địa chỉ đăng ký kinh doanh đầy đủ
- **Cải thiện:** Icon xã hội có brand color chính xác (Facebook blue, YouTube red, TikTok black/pink)

#### T2.5 – Mobile UX Improvements
- **Sticky bottom bar mobile:** Giống TMT-EGREEN – thanh cố định dưới màn hình mobile với: [Gọi ngay] [Chat Zalo] [Tư vấn]
- **Touch-friendly:** Tăng kích thước vùng tap các link menu mobile ≥ 44px
- **Swipe gesture:** Dropdown menu mobile có animation slide-down mượt
- **Performance:** Lazy load ảnh bằng `loading="lazy"` trên tất cả `<img>`

#### T2.6 – Blog/Tin tức (5 bài thực)
- **Path:** `pages/tin-tuc/index.html` – hiện có khung, cần bổ sung 5 bài thực
- **Bài 1:** "NĐ 135/2024 nói gì về tự sản xuất tự tiêu thụ?" (SEO keyword: NĐ 135 điện mặt trời)
- **Bài 2:** "DEYE vs SOLIS: Biến tần nào tốt hơn cho gia đình Việt?" 
- **Bài 3:** "Chi phí lắp điện mặt trời 2025 – Bảng giá chi tiết"
- **Bài 4:** "Trạm sạc xe điện: Đầu tư bao nhiêu? Thu hồi vốn bao lâu?"
- **Bài 5:** "Pin lưu trữ LiFePO4 vs Lead-acid: Lựa chọn nào thông minh hơn?"
- **SEO:** Mỗi bài có `<article>` + `Article` Schema + H1/H2 cấu trúc + internal links

---

### 🟡 P3 — Tính năng nâng cao (Tuần 3+)

#### T3.1 – Bản đồ tương tác dự án
- **Thư viện:** Leaflet.js (CDN) + OpenStreetMap tiles (miễn phí)
- **Path:** `pages/du-an/index.html` (trang mới)
- **Chức năng:** Marker các dự án NLP Group đã lắp đặt toàn quốc (dùng `db.json` hoặc GeoJSON inline)
- **Popup marker:** Ảnh dự án, công suất, khách hàng, năm lắp đặt
- **Học từ:** `draft/TMT-EGREEN/tim-kiem-tram-sac-gan-nhat.html`

#### T3.2 – Trang Dự án / Case Studies
- **Path:** `pages/du-an/index.html`
- **Nội dung:** Grid case studies (ảnh thực + thông số: kWp, loại hệ thống, tiết kiệm/tháng, khách hàng)
- **Trang detail:** `pages/du-an/[ten-du-an]/index.html` – full case study có timeline và số liệu
- **Slug DB:** `du-an`, thêm array `projects` vào `admin/db.json`

#### T3.3 – Trang Điều khoản + Bảo mật
- **Path:** `pages/dieu-khoan/index.html`, `pages/bao-mat/index.html`
- **Yêu cầu pháp lý:** Bắt buộc theo Luật BVQLNTD và yêu cầu Google AdSense/Ads
- **Nội dung:** Standard B2B service terms, PDPA-compliant privacy policy tiếng Việt

#### T3.4 – Tích hợp Zalo OA / Facebook Messenger
- **Zalo:** Thêm Zalo OA Chat Widget (snippet JS Zalo)
- **Facebook:** Thêm Facebook Messenger Chat Plugin
- **Thay thế:** FAB hiện tại (a[href=tel] + a[href=zalo.me]) → upgrade thành proper chat widget

#### T3.5 – PWA (Progressive Web App)
- **Đã có:** `favicon_io/site.webmanifest`
- **Cần thêm:** `sw.js` service worker (cache-first strategy cho CSS/JS/fonts)
- **Benefit:** Tải nhanh lần 2, offline fallback, "Add to Home Screen" prompt

---

## 3. KIẾN TRÚC KỸ THUẬT MỤC TIÊU

### 3.1 Cây thư mục mục tiêu (sau khi hoàn thành)

```
nlpgroup.com.vn/
│
├── index.html                    ← Trang chủ (cải thiện hero, stats, animations)
├── 404.html
├── sw.js                         ← [T3.5] Service Worker PWA
│
├── css/
│   ├── main.css                  ← Thêm: WOW animations, sticky mobile bar
│   └── admin.css
│
├── js/
│   ├── main.js                   ← Thêm: GA4 events, WOW init, Swiper init
│   └── admin.js                  ← Thêm: leads export CSV, settings CRUD
│
├── favicon_io/                   ← ✅ Đã có
│
├── pages/
│   ├── ve-chung-toi/index.html   ← [T1.1] MỚI
│   ├── doi-tac/index.html        ← [T1.2] MỚI
│   ├── du-an/index.html          ← [T3.2] MỚI
│   ├── dieu-khoan/index.html     ← [T3.3] MỚI
│   ├── bao-mat/index.html        ← [T3.3] MỚI
│   ├── dien-mat-troi/…           ← ✅ Có – bổ sung Schema.org [T1.4]
│   ├── tru-sac/…                 ← ✅ Có – thêm bản đồ [T3.1]
│   ├── dich-vu/…                 ← ✅ Có
│   ├── tin-tuc/…                 ← Thêm 5 bài thực [T2.6]
│   └── lien-he/…                 ← ✅ Có – thêm Schema LocalBusiness [T1.4]
│
└── admin/
    ├── index.html                ← Dashboard ✅
    ├── login.html                ← ✅
    ├── pages.html                ← [T1.5] MỚI – quản lý URL/slug CRUD
    ├── leads.html                ← [T1.5] MỚI – danh sách leads + export
    ├── settings.html             ← [T1.5] MỚI – cài đặt site
    └── db.json                   ← Thêm: projects[], posts[], settings mở rộng
```

### 3.2 Mở rộng `admin/db.json`

```json
{
  "site": { ... },
  "pages": [ ... ],          // ✅ Đã có
  "products": [ ... ],       // ✅ Đã có
  "projects": [              // [T3.2] MỚI
    {
      "id": "pj_001",
      "title": "Nhà máy ABC, Bình Dương",
      "power_kwp": 500,
      "type": "industrial",
      "year": 2024,
      "monthly_saving": 45000000,
      "lat": 10.9804,
      "lng": 106.6519,
      "image": "...",
      "status": "active"
    }
  ],
  "posts": [                 // [T2.6] MỚI
    {
      "id": "post_001",
      "title": "NĐ 135/2024 nói gì?",
      "slug": "nd-135-2024-tu-san-tu-tieu",
      "excerpt": "...",
      "content_url": "pages/tin-tuc/nd-135-2024/",
      "category": "chinh-sach",
      "published_at": "2026-01-01",
      "status": "active"
    }
  ],
  "settings": {
    "phone": "0333.864.000",
    "zalo": "https://zalo.me/0333864000",
    "email": "contact@nlpgroup.com.vn",   // ← Đổi từ muabandien.com
    "google_tag": "G-XXXXXXXXXX",          // ← Điền GA4 ID thực
    "fb_pixel": "",
    "zalo_oa_id": "",
    "business_license": "0312XXXXXXX",    // ← MST thực
    "maintenance": false,
    "address_hcm": "...",
    "address_hn": "..."
  }
}
```

---

## 4. STYLE GUIDE (Học từ TMT-EGREEN)

### 4.1 Màu sắc (giữ nguyên NLP Group identity)
```css
:root {
  --color-primary:   #16a34a;  /* solar-600 – xanh lá chủ đạo */
  --color-primary-h: #15803d;  /* hover state */
  --color-dark:      #0f172a;  /* dark navy */
  --color-bg:        #f6f8f7;  /* background nhẹ (học tmt) */
  --color-surface:   #ffffff;
  --color-border:    #E5ECE8;  /* border card (học tmt) */
  --color-muted:     #57606a;
}
```

### 4.2 Card Component (học tmt style)
```css
.card-nlp {
  border-radius: 16px;              /* hoặc 24px cho card lớn */
  border: 2px solid #E5ECE8;
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
  background: #ffffff;
  padding: 24px;
  transition: transform .2s, box-shadow .2s;
}
.card-nlp:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.10);
}
```

### 4.3 Glassmorphism Dark Section
```css
.glass-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255,255,255,0.50);
  border-radius: 16px;
}
```

### 4.4 Typography Scale (Inter font)
| Class | Size | Weight | Use |
|-------|------|--------|-----|
| `.heading-xl` | 48–56px | 900 Black | Hero H1 |
| `.heading-lg` | 36–40px | 800 ExtraBold | Section H2 |
| `.heading-md` | 24–28px | 700 Bold | Card H3 |
| `.body-lg` | 18px | 400/500 | Lead text |
| `.body-sm` | 14px | 400 | Secondary text |
| `.label` | 12px | 700 | Badge/tag uppercase |

### 4.5 Animation Delays (WOW.js)
```html
<!-- Pattern học tmt: tăng delay mỗi card 0.1s -->
<div class="wow fadeIn" data-wow-delay="0.1s">Card 1</div>
<div class="wow fadeIn" data-wow-delay="0.2s">Card 2</div>
<div class="wow fadeIn" data-wow-delay="0.3s">Card 3</div>
```

---

## 5. GA4 TRACKING PLAN (học TMT-EGREEN)

### Events cần implement

| Event Name | Trigger | Parameters |
|-----------|---------|-----------|
| `bam_goi_hotline` | Click `a[href^="tel:"]` | `so_dien_thoai`, `vi_tri_nut` (dau_trang/chan_trang/fab/trong_bai), `loai_thiet_bi` |
| `bam_chat_zalo` | Click Zalo FAB / link | `vi_tri_nut` |
| `bam_mo_modal` | Click "Tư vấn ngay" | `vi_tri_nut`, `trang_nguon` |
| `submit_form_lead` | Form submit success | `dich_vu` (solar/ev/hybrid), `trang_nguon` |
| `bam_tinh_toan` | Slider input change | `hoa_don_value` (range bucket), `trang_nguon` |
| `xem_san_pham` | Click product card/link | `ten_san_pham`, `loai_san_pham` |
| `dang_ky_doi_tac` | Partner form submit | `tinh_thanh`, `loai_doi_tac` |

### Cách thêm vào `js/main.js`
```javascript
// Centralized gtag helper (check GA4 đã load)
function trackEvent(name, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', name, { trang_nguon: window.location.pathname, ...params });
  }
}

// Ví dụ: click hotline
document.addEventListener('click', e => {
  const btn = e.target.closest('a[href^="tel:"]');
  if (!btn) return;
  trackEvent('bam_goi_hotline', {
    so_dien_thoai: btn.href.replace('tel:', ''),
    vi_tri_nut: btn.closest('footer') ? 'chan_trang' :
                btn.closest('nav')    ? 'dau_trang'  : 'trong_bai'
  });
}, true);
```

---

## 6. SEO CHECKLIST MỤC TIÊU

### Per-page checklist

- [ ] `<title>` ≤ 60 ký tự, chứa keyword chính
- [ ] `<meta description>` 150–160 ký tự
- [ ] `<link rel="canonical">` đúng URL tuyệt đối
- [ ] `<meta property="og:image">` kích thước 1200×630px
- [ ] H1 duy nhất, chứa keyword trang
- [ ] H2/H3 cấu trúc thứ bậc logic
- [ ] Internal links ≥ 3 link đến trang liên quan
- [ ] Schema.org JSON-LD phù hợp loại trang
- [ ] `alt` đầy đủ cho tất cả ảnh
- [ ] `loading="lazy"` cho ảnh dưới fold
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

### Keyword targets chính

| Trang | Keyword chính | Keyword phụ |
|-------|--------------|------------|
| Trang chủ | điện mặt trời NLP Group | giải pháp năng lượng mặt trời |
| Biến tần Hybrid | biến tần hybrid DEYE SOLIS | biến tần hybrid lưu trữ |
| Trụ sạc DC | trụ sạc xe điện 120kW | trạm sạc DC nhanh |
| Thuê – Mua | điện mặt trời thuê mua | lắp solar 0 đồng |
| Liên hệ | NLP Group liên hệ | tư vấn điện mặt trời miễn phí |

---

## 7. PERFORMANCE TARGETS

| Metric | Hiện tại (ước tính) | Mục tiêu | Giải pháp |
|--------|---------------------|----------|----------|
| LCP (trang chủ) | ~4.5s (Unsplash remote) | < 2.0s | Tự host ảnh WebP |
| CLS | ~0.1 | < 0.05 | Thêm `width/height` cho ảnh |
| JS bundle | ~150KB (FA6) | < 100KB | Font Awesome subset |
| CSS | ~50KB (Tailwind CDN) | < 30KB | Tailwind purge / custom CSS |
| Total requests | ~12 | < 8 | Inline critical CSS |

### Quick wins (không cần build tool)
1. Thêm `loading="lazy"` tất cả `<img>` dưới fold
2. Thêm `fetchpriority="high"` cho hero image
3. Chuyển Font Awesome từ CDN JS → CDN CSS (không block render)
4. Thêm `<link rel="preconnect" href="https://fonts.googleapis.com">`
5. Nén ảnh placeholder → thay bằng `aspect-ratio` CSS placeholder + ảnh thực

---

## 8. DEPLOYMENT PLAN

### Cloudflare Pages (hiện tại)
- **Repo:** `https://github.com/thekingbao/vnsolar.git` branch `main`
- **Deploy trigger:** Push to `main` → auto-deploy
- **Custom domain:** `nlpgroup.com.vn` → CNAME → Cloudflare Pages

### Môi trường
| Env | URL | Branch |
|-----|-----|--------|
| Production | `nlpgroup.com.vn` | `main` |
| Preview | `*.pages.dev` | PR branch |

### Quy trình deploy tính năng mới
1. Tạo branch `feature/[ten-tinh-nang]`
2. Phát triển + kiểm tra local
3. Commit + push → tạo PR
4. Xem preview trên `*.pages.dev`
5. Merge vào `main` → tự deploy

---

## 9. TIMELINE THỰC THI

### Sprint 1 – Tuần 1 (P1 tasks)
| Ngày | Task | Output |
|------|------|--------|
| 1 | T1.1 Trang Về chúng tôi | `pages/ve-chung-toi/index.html` |
| 2 | T1.2 Trang Đối tác | `pages/doi-tac/index.html` |
| 3 | T1.3 GA4 Tracking | `js/main.js` – 7 events |
| 4 | T1.4 Schema.org SEO | Tất cả trang có JSON-LD |
| 5 | T1.5 Admin hoàn thiện | `admin/pages.html`, `leads.html`, `settings.html` |

### Sprint 2 – Tuần 2 (P2 tasks)
| Ngày | Task | Output |
|------|------|--------|
| 1 | T2.1 WOW.js Animations | `js/main.js` + `css/main.css` |
| 2 | T2.2 Swiper Slider | Section sản phẩm trang chủ |
| 3 | T2.3 Hero nâng cấp | `index.html` hero section |
| 4 | T2.4 Footer + T2.5 Mobile bar | `index.html` + `css/main.css` |
| 5 | T2.6 Blog 5 bài | `pages/tin-tuc/` + 5 trang detail |

### Sprint 3 – Tuần 3+ (P3 tasks)
- T3.1 Bản đồ dự án Leaflet
- T3.2 Trang Case Studies
- T3.3 Điều khoản + Bảo mật
- T3.4 Zalo OA / Messenger widget
- T3.5 PWA Service Worker

---

## 10. CHECKLIST PHÁT TRIỂN

### Trước khi commit
- [ ] Test trên mobile Chrome (375px) + tablet (768px) + desktop (1440px)
- [ ] Kiểm tra Console không có lỗi JS
- [ ] Tất cả link internal hoạt động (không 404)
- [ ] Form modal submit + reset hoạt động
- [ ] Calculator hiển thị kết quả đúng
- [ ] Admin login hoạt động (admin/nlpgroup2025)
- [ ] `db.json` parse không lỗi (JSON valid)

### Sau khi deploy lên Cloudflare
- [ ] Kiểm tra HTTPS hoạt động
- [ ] Kiểm tra redirect `www.nlpgroup.com.vn` → `nlpgroup.com.vn`
- [ ] Test Lighthouse score ≥ 80 Performance / 90 SEO / 100 Accessibility
- [ ] Submit sitemap lên Google Search Console
- [ ] Kiểm tra GA4 Realtime data nhận được events

---

*File này được cập nhật tự động khi hoàn thành từng task. Đánh dấu [x] khi done.*

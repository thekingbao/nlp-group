/**
 * NLP-EGREEN – Site Configuration
 * ================================
 * File này được tạo tự động. Để thay đổi: vào Admin > Cài đặt Site
 * Sau khi lưu từ Admin, thay thế file này bằng file đã xuất.
 *
 * CÁCH CẤU HÌNH GOOGLE MAPS API KEY:
 *   1. Vào https://console.cloud.google.com/
 *   2. Tạo project → Enable "Maps JavaScript API"
 *   3. Tạo API Key → Copy vào field googleMapsKey bên dưới
 *   4. Hoặc vào Admin > Cài đặt > Google Maps API Key → Lưu & Xuất
 */
window.NLP_CONFIG = {

    /* ── Thông tin liên hệ ──────────────────────── */
    siteName:        'NLP-EGREEN',
    phone:           '0944.086.788',
    email:           'contact@nlp-egreen.com',
    zalo:            'https://zalo.me/0944086788',

    /* ── Google Maps API Key ─────────────────────
     * Để trống → bản đồ sẽ không tải (chỉ hiện danh sách trạm)
     * Sau khi có key: điền vào đây hoặc cập nhật qua Admin
     */
    googleMapsKey:   '',   /* ← ĐIỀN KEY VÀO ĐÂY */

    /* ── Google Analytics 4 ──────────────────────
     * Điền Measurement ID (G-XXXXXXXXXX) để bật tracking
     */
    ga4Id:           '',   /* ← G-XXXXXXXXXX */

    /* ── Facebook Pixel ──────────────────────────*/
    fbPixelId:       '',

    /* ── Zalo OA ─────────────────────────────────*/
    zaloOaId:        '',

    /* ── Maintenance mode ────────────────────────
     * true  → hiển thị trang bảo trì cho visitor
     * false → bình thường
     */
    maintenance:     false,

    /* ── Version / build stamp ───────────────────*/
    _v: '1.0.0'
};

/* ── Auto-inject GA4 nếu có ID ──────────────────── */
(function() {
    var gid = window.NLP_CONFIG.ga4Id;
    if (!gid) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gid;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', gid);
})();

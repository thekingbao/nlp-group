/**
 * NLP Group – Demo Data Seeder
 * Chạy 1 lần khi lần đầu mở site, seed localStorage với dữ liệu demo thực tế.
 * Để reset: localStorage.removeItem('nlpgroup_demo_seeded') rồi reload.
 */
(function seedDemoData() {
    if (localStorage.getItem('nlpgroup_demo_seeded') === 'v3') return;

    /* ── 1. LEADS (20 bản ghi) ─────────────────────────────── */
    const now = Date.now();
    const h   = 3600000;
    const d   = 86400000;

    const LEADS = [
        // Solar B2B
        { type:'lead', name:'Nguyễn Văn Thắng',    phone:'0901234567', service:'Điện mặt trời cho Nhà xưởng / B2B',  source:'/pages/dien-mat-troi/', province:'Bình Dương',   company:'Cty TNHH Thắng Lợi Textile', bill_range:'30tr_100tr', time: new Date(now - 2*h).toISOString()  },
        { type:'lead', name:'Trần Thị Mai Linh',    phone:'0912345678', service:'Điện mặt trời mái nhà (Gia đình)',    source:'/pages/dien-mat-troi/', province:'TP.HCM',       company:'',                           bill_range:'1tr_5tr',    time: new Date(now - 5*h).toISOString()  },
        { type:'lead', name:'Lê Quốc Hùng',         phone:'0923456789', service:'Lắp đặt Trạm sạc Ô tô điện',         source:'/pages/tru-sac/',       province:'Hà Nội',        company:'Sân Bay Nội Bài Parking',    bill_range:'',           time: new Date(now - 8*h).toISOString()  },
        { type:'lead', name:'Phạm Thị Bích Ngọc',   phone:'0934567890', service:'Điện mặt trời cho Nhà xưởng / B2B',  source:'/',                     province:'Đồng Nai',      company:'KCN Long Thành',             bill_range:'100tr+',     time: new Date(now - 1*d).toISOString()  },
        { type:'lead', name:'Hoàng Minh Tuấn',      phone:'0945678901', service:'Điện mặt trời mái nhà (Gia đình)',    source:'/',                     province:'Đà Nẵng',       company:'',                           bill_range:'3tr_10tr',   time: new Date(now - 1*d - 3*h).toISOString() },
        { type:'lead', name:'Vũ Thị Thu Hà',        phone:'0956789012', service:'Lắp đặt Trạm sạc Ô tô điện',         source:'/pages/tru-sac/tru-sac-dc/', province:'TP.HCM',   company:'Khách sạn Hà Thành Palace',  bill_range:'',           time: new Date(now - 2*d).toISOString()  },
        { type:'lead', name:'Ngô Thanh Bình',        phone:'0967890123', service:'Điện mặt trời cho Nhà xưởng / B2B',  source:'/pages/dich-vu/thue-mua/', province:'Long An',    company:'Cty CP Thực phẩm Bình Long', bill_range:'50tr_100tr', time: new Date(now - 2*d - 5*h).toISOString() },
        { type:'lead', name:'Đặng Thị Lan Anh',     phone:'0978901234', service:'Mua biến tần / vật tư bán lẻ',        source:'/pages/dien-mat-troi/bien-tan-hybrid/', province:'Cần Thơ', company:'',             bill_range:'',           time: new Date(now - 3*d).toISOString()  },
        { type:'lead', name:'Bùi Đức Thọ',          phone:'0989012345', service:'Điện mặt trời cho Nhà xưởng / B2B',  source:'/pages/dien-mat-troi/', province:'Hải Phòng',     company:'Cty TNHH Cơ khí Đức Thọ',   bill_range:'10tr_30tr',  time: new Date(now - 3*d - 2*h).toISOString() },
        { type:'lead', name:'Trịnh Văn Khoa',       phone:'0990123456', service:'Lắp đặt Trạm sạc Ô tô điện',         source:'/pages/tru-sac/',       province:'Khánh Hòa',     company:'Vincom Nha Trang',           bill_range:'',           time: new Date(now - 4*d).toISOString()  },
        { type:'lead', name:'Lý Thị Mỹ Duyên',     phone:'0901111222', service:'Điện mặt trời mái nhà (Gia đình)',    source:'/',                     province:'TP.HCM',        company:'',                           bill_range:'1tr_5tr',    time: new Date(now - 4*d - 1*h).toISOString() },
        { type:'lead', name:'Đinh Quang Vinh',      phone:'0912222333', service:'Điện mặt trời cho Nhà xưởng / B2B',  source:'/pages/dien-mat-troi/', province:'Bình Phước',    company:'Lâm Nghiệp Vinh Phát',       bill_range:'30tr_100tr', time: new Date(now - 5*d).toISOString()  },
        { type:'lead', name:'Cao Thị Phương Nhi',   phone:'0923333444', service:'Điện mặt trời mái nhà (Gia đình)',    source:'/pages/tin-tuc/nd-135-2024-dien-mat-troi-tu-san-tu-tieu/', province:'Đà Lạt', company:'', bill_range:'3tr_10tr', time: new Date(now - 5*d - 4*h).toISOString() },
        { type:'lead', name:'Phan Thành Đạt',       phone:'0934444555', service:'Lắp đặt Trạm sạc Ô tô điện',         source:'/pages/tru-sac/tru-sac-ac/', province:'Huế',       company:'Resort Laguna Lăng Cô',      bill_range:'',           time: new Date(now - 6*d).toISOString()  },
        { type:'lead', name:'Trương Thị Ánh Tuyết', phone:'0945555666', service:'Điện mặt trời cho Nhà xưởng / B2B',  source:'/',                     province:'Tiền Giang',    company:'Cty TNHH Nông sản Ánh Sáng', bill_range:'10tr_30tr', time: new Date(now - 6*d - 6*h).toISOString() },
        { type:'lead', name:'Lê Văn Nhân',          phone:'0956666777', service:'Mua biến tần / vật tư bán lẻ',        source:'/pages/dien-mat-troi/bien-tan-hoa-luoi/', province:'Đắk Lắk', company:'',              bill_range:'',           time: new Date(now - 7*d).toISOString()  },
        { type:'lead', name:'Nguyễn Thị Thanh Vân', phone:'0967777888', service:'Điện mặt trời mái nhà (Gia đình)',    source:'/pages/dich-vu/tra-cham/', province:'Vũng Tàu',   company:'',                           bill_range:'1tr_5tr',    time: new Date(now - 7*d - 3*h).toISOString() },

        // Partner registrations
        { type:'partner', name:'Phan Đức Minh',     phone:'0978888999', service:'', partner_type:'Đại lý Solar cấp 1', province:'Bắc Ninh',  district:'TP. Bắc Ninh', company:'Cty TNHH Minh Phát Energy',    source:'/pages/doi-tac/', time: new Date(now - 1*d - 7*h).toISOString() },
        { type:'partner', name:'Lâm Thị Thu Thảo',  phone:'0989999000', service:'', partner_type:'Đại lý EV + Solar',   province:'Quảng Nam', district:'TP. Tam Kỳ',  company:'Công ty CP Thảo Nguyên Green', source:'/pages/doi-tac/', time: new Date(now - 3*d - 2*h).toISOString() },
        { type:'partner', name:'Hồ Văn Tùng',       phone:'0900001111', service:'', partner_type:'Nhà phân phối cấp 2', province:'Cà Mau',    district:'TP. Cà Mau',   company:'DNTN Tùng Phát Solar',         source:'/pages/doi-tac/', time: new Date(now - 6*d - 1*h).toISOString() },
    ];

    localStorage.setItem('nlpgroup_leads', JSON.stringify(LEADS));

    /* ── 2. CALCULATOR HISTORY (cho analytics demo) ───────── */
    const CALC_HISTORY = [
        { bill: 8000000,  kwp: '26.7', saving: 57600000, ts: new Date(now - 1*h).toISOString() },
        { bill: 15000000, kwp: '50.0', saving: 108000000, ts: new Date(now - 4*h).toISOString() },
        { bill: 3500000,  kwp: '11.7', saving: 25200000, ts: new Date(now - 12*h).toISOString() },
        { bill: 45000000, kwp: '150.0', saving: 324000000, ts: new Date(now - 1*d).toISOString() },
        { bill: 2000000,  kwp: '6.7', saving: 14400000, ts: new Date(now - 2*d).toISOString() },
    ];
    localStorage.setItem('nlpgroup_calc_history', JSON.stringify(CALC_HISTORY));

    /* ── 3. USER PREFS (demo state) ────────────────────────── */
    localStorage.setItem('nlpgroup_prefs', JSON.stringify({
        dark_mode: false,
        last_visited: '/',
        seen_cta: false,
        calc_last_bill: 8000000
    }));

    /* ── 4. DEMO SESSION STATS (hiển thị trên admin) ─────── */
    const SESSION_STATS = {
        page_views_today: 247,
        unique_visitors:  89,
        avg_time_sec:     184,
        bounce_rate:      38.4,
        top_pages: [
            { path: '/', views: 87 },
            { path: '/pages/dien-mat-troi/', views: 43 },
            { path: '/pages/tru-sac/', views: 38 },
            { path: '/pages/tin-tuc/', views: 31 },
            { path: '/pages/ve-chung-toi/', views: 24 },
        ],
        devices: { mobile: 58, desktop: 34, tablet: 8 }
    };
    localStorage.setItem('nlpgroup_session_stats', JSON.stringify(SESSION_STATS));

    /* ── 5. DEMO NOTIFICATIONS (admin bell) ────────────────── */
    const NOTIFICATIONS = [
        { id:'n1', type:'lead',    msg:'Lead mới: Nguyễn Văn Thắng (0901234567) — Solar B2B Bình Dương', read:false, time: new Date(now - 2*h).toISOString() },
        { id:'n2', type:'partner', msg:'Đăng ký đối tác: Phan Đức Minh — Đại lý cấp 1 Bắc Ninh',        read:false, time: new Date(now - 1*d - 7*h).toISOString() },
        { id:'n3', type:'alert',   msg:'Trạm sạc Nha Trang Vincom đang offline — cần kiểm tra',           read:false, time: new Date(now - 2*d).toISOString() },
        { id:'n4', type:'lead',    msg:'Lead mới: Lê Quốc Hùng (0923456789) — EV Trạm sạc Hà Nội',       read:true,  time: new Date(now - 8*h).toISOString() },
        { id:'n5', type:'system',  msg:'PWA Service Worker cập nhật lên v2 — cache mới sẵn sàng',          read:true,  time: new Date(now - 3*d).toISOString() },
    ];
    localStorage.setItem('nlpgroup_notifications', JSON.stringify(NOTIFICATIONS));

    /* ── DONE ─────────────────────────────────────────────── */
    localStorage.setItem('nlpgroup_demo_seeded', 'v3');
    console.info('[NLP Demo] ✅ Seeded %d leads, %d calc records, notifications.', LEADS.length, CALC_HISTORY.length);
})();

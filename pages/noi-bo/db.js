/**
 * NLP Group — Internal Portal Shared Mock Database
 * Simulates a REST API / shared state between Admin, Legal, Finance portals
 * In production: replace with real fetch() calls to backend API
 */

const DB = (() => {
  // ─── Seed Data ────────────────────────────────────────────────────────────
  const _projects = [
    { id: "PRJ-001", name: "Solar 50kWp – Nhà máy Bình Dương", client: "Cty TNHH Bình Minh Textiles", type: "solar", power: 50, status: "active", contractDate: "2024-03-15", value: 850000000, paid: 850000000, legalStatus: "approved", legalNote: "Hồ sơ đầy đủ, đã ký kết.", region: "Bình Dương" },
    { id: "PRJ-002", name: "Trạm sạc 4 cổng DC – Chuỗi cửa hàng ABC", client: "Cty CP ABC Retail", type: "ev", power: 120, status: "installing", contractDate: "2024-06-01", value: 480000000, paid: 240000000, legalStatus: "pending", legalNote: "Đang chờ giấy phép PCCC.", region: "TP.HCM" },
    { id: "PRJ-003", name: "Solar BESS 30kWp + 20kWh – Khách sạn Đà Nẵng", client: "Khách sạn Sông Hàn", type: "solar", power: 30, status: "pending", contractDate: "2024-07-20", value: 620000000, paid: 0, legalStatus: "review", legalNote: "Cần bổ sung hồ sơ đất.", region: "Đà Nẵng" },
    { id: "PRJ-004", name: "Solar 100kWp – Khu công nghiệp Long An", client: "KCN Long An Phase 2", type: "solar", power: 100, status: "completed", contractDate: "2023-11-10", value: 1650000000, paid: 1650000000, legalStatus: "approved", legalNote: "Nghiệm thu hoàn thành.", region: "Long An" },
    { id: "PRJ-005", name: "Trụ sạc AC 22kW – Chung cư Vinhomes", client: "Vinhomes Grand Park", type: "ev", power: 22, status: "active", contractDate: "2024-05-12", value: 95000000, paid: 95000000, legalStatus: "approved", legalNote: "Đã bàn giao vận hành.", region: "TP.HCM" },
    { id: "PRJ-006", name: "Solar 20kWp – Văn phòng Hà Nội", client: "Tập đoàn XYZ Holdings", type: "solar", power: 20, status: "installing", contractDate: "2024-08-01", value: 340000000, paid: 170000000, legalStatus: "approved", legalNote: "Đã có giấy phép xây dựng.", region: "Hà Nội" },
    { id: "PRJ-007", name: "Trạm sạc siêu tốc 240kW – Quốc lộ 1A", client: "Công ty Logistics VTC", type: "ev", power: 240, status: "pending", contractDate: "2024-09-05", value: 2100000000, paid: 0, legalStatus: "review", legalNote: "Đang thẩm định phương án kỹ thuật điện lực.", region: "Bình Thuận" },
  ];

  const _invoices = [
    { id: "INV-001", projectId: "PRJ-001", amount: 850000000, issued: "2024-03-20", due: "2024-04-20", status: "paid", type: "full" },
    { id: "INV-002", projectId: "PRJ-002", amount: 240000000, issued: "2024-06-05", due: "2024-07-05", status: "paid", type: "deposit" },
    { id: "INV-003", projectId: "PRJ-002", amount: 240000000, issued: "2024-09-01", due: "2024-10-01", status: "overdue", type: "progress" },
    { id: "INV-004", projectId: "PRJ-004", amount: 1650000000, issued: "2023-12-01", due: "2024-01-01", status: "paid", type: "full" },
    { id: "INV-005", projectId: "PRJ-005", amount: 95000000, issued: "2024-05-15", due: "2024-06-15", status: "paid", type: "full" },
    { id: "INV-006", projectId: "PRJ-006", amount: 170000000, issued: "2024-08-05", due: "2024-09-05", status: "paid", type: "deposit" },
    { id: "INV-007", projectId: "PRJ-006", amount: 170000000, issued: "2024-10-01", due: "2024-11-01", status: "pending", type: "progress" },
    { id: "INV-008", projectId: "PRJ-003", amount: 186000000, issued: "2024-07-25", due: "2024-08-25", status: "pending", type: "deposit" },
    { id: "INV-009", projectId: "PRJ-007", amount: 630000000, issued: "2024-09-10", due: "2024-10-10", status: "pending", type: "deposit" },
  ];

  const _legalDocs = [
    { id: "DOC-001", projectId: "PRJ-001", type: "Hợp đồng EPC", status: "signed", signedDate: "2024-03-15", expiry: "2029-03-15", file: "HĐ_PRJ001_signed.pdf" },
    { id: "DOC-002", projectId: "PRJ-001", type: "Giấy phép đấu nối điện", status: "approved", signedDate: "2024-03-18", expiry: null, file: "GPDN_PRJ001.pdf" },
    { id: "DOC-003", projectId: "PRJ-002", type: "Hợp đồng EPC", status: "signed", signedDate: "2024-06-01", expiry: "2029-06-01", file: "HĐ_PRJ002_signed.pdf" },
    { id: "DOC-004", projectId: "PRJ-002", type: "Giấy phép PCCC", status: "pending", signedDate: null, expiry: null, file: null },
    { id: "DOC-005", projectId: "PRJ-003", type: "Hợp đồng EPC", status: "draft", signedDate: null, expiry: null, file: "HĐ_PRJ003_draft.pdf" },
    { id: "DOC-006", projectId: "PRJ-003", type: "Hồ sơ đất", status: "missing", signedDate: null, expiry: null, file: null },
    { id: "DOC-007", projectId: "PRJ-004", type: "Hợp đồng EPC", status: "signed", signedDate: "2023-11-10", expiry: "2028-11-10", file: "HĐ_PRJ004_signed.pdf" },
    { id: "DOC-008", projectId: "PRJ-005", type: "Hợp đồng EPC", status: "signed", signedDate: "2024-05-12", expiry: "2029-05-12", file: "HĐ_PRJ005_signed.pdf" },
    { id: "DOC-009", projectId: "PRJ-006", type: "Hợp đồng EPC", status: "signed", signedDate: "2024-08-01", expiry: "2029-08-01", file: "HĐ_PRJ006_signed.pdf" },
    { id: "DOC-010", projectId: "PRJ-006", type: "Giấy phép xây dựng", status: "approved", signedDate: "2024-07-28", expiry: "2025-07-28", file: "GPXD_PRJ006.pdf" },
    { id: "DOC-011", projectId: "PRJ-007", type: "Hợp đồng EPC", status: "draft", signedDate: null, expiry: null, file: "HĐ_PRJ007_draft.pdf" },
    { id: "DOC-012", projectId: "PRJ-007", type: "Thẩm định phương án kỹ thuật", status: "review", signedDate: null, expiry: null, file: null },
  ];

  const _notifications = [];
  let _listeners = {};

  // ─── Event Bus ────────────────────────────────────────────────────────────
  const _emit = (event, payload) => {
    const ts = new Date().toLocaleTimeString('vi-VN');
    _notifications.unshift({ event, payload, ts, read: false });
    (_listeners[event] || []).forEach(fn => fn(payload));
    (_listeners['*'] || []).forEach(fn => fn(event, payload));
  };

  // ─── Public API ───────────────────────────────────────────────────────────
  return {
    // Subscribe
    on(event, fn) {
      _listeners[event] = _listeners[event] || [];
      _listeners[event].push(fn);
    },
    onAny(fn) { _listeners['*'] = _listeners['*'] || []; _listeners['*'].push(fn); },

    // Projects
    getProjects(filter = {}) {
      return _projects.filter(p =>
        (!filter.type   || p.type   === filter.type)   &&
        (!filter.status || p.status === filter.status) &&
        (!filter.legalStatus || p.legalStatus === filter.legalStatus)
      );
    },
    getProject(id) { return _projects.find(p => p.id === id); },
    updateProjectStatus(id, status) {
      const p = _projects.find(p => p.id === id);
      if (p) { p.status = status; _emit('project:statusChanged', { id, status, name: p.name }); }
    },
    updateLegalStatus(id, legalStatus, note) {
      const p = _projects.find(p => p.id === id);
      if (p) { p.legalStatus = legalStatus; p.legalNote = note || p.legalNote; _emit('legal:statusChanged', { id, legalStatus, name: p.name }); }
    },

    // Invoices
    getInvoices(projectId) {
      return projectId ? _invoices.filter(i => i.projectId === projectId) : [..._invoices];
    },
    updateInvoiceStatus(id, status) {
      const inv = _invoices.find(i => i.id === id);
      if (inv) { inv.status = status; _emit('invoice:statusChanged', { id, status, projectId: inv.projectId }); }
    },

    // Legal Docs
    getDocs(projectId) {
      return projectId ? _legalDocs.filter(d => d.projectId === projectId) : [..._legalDocs];
    },
    updateDocStatus(id, status, note) {
      const d = _legalDocs.find(d => d.id === id);
      if (d) { d.status = status; _emit('doc:statusChanged', { id, status, projectId: d.projectId, type: d.type }); }
    },
    addDoc(doc) {
      const newDoc = { id: 'DOC-' + String(_legalDocs.length + 1).padStart(3,'0'), ...doc };
      _legalDocs.push(newDoc);
      _emit('doc:added', newDoc);
      return newDoc;
    },

    // Notifications
    getNotifications() { return [..._notifications]; },
    markRead() { _notifications.forEach(n => n.read = true); },

    // Stats helpers
    stats() {
      const totalValue = _projects.reduce((s, p) => s + p.value, 0);
      const totalPaid  = _projects.reduce((s, p) => s + p.paid, 0);
      const overdue    = _invoices.filter(i => i.status === 'overdue').length;
      const pending    = _invoices.filter(i => i.status === 'pending').length;
      const legalIssues = _projects.filter(p => p.legalStatus === 'review' || p.legalStatus === 'pending').length;
      return { totalValue, totalPaid, outstanding: totalValue - totalPaid, overdue, pending, legalIssues,
               totalProjects: _projects.length, activeProjects: _projects.filter(p => p.status === 'active').length };
    },
    fmt(n) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n); },
  };
})();

-- NLP Group — D1 Seed Data
-- Migrated from pages/noi-bo-react/src/store.jsx INIT_* constants
-- Run: wrangler d1 execute nlpgroup-db --file=workers/api/db/seed.sql

-- ─── Projects ─────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO projects (id, name, client, type, power, status, contract_date, value, paid, legal_status, legal_note, region) VALUES
  ('PRJ-001','Solar 50kWp – Nhà máy Bình Dương','Cty TNHH Bình Minh Textiles','solar',50,'active','2024-03-15',850000000,850000000,'approved','Hồ sơ đầy đủ, đã ký kết.','Bình Dương'),
  ('PRJ-002','Trạm sạc 4 cổng DC – Chuỗi ABC','Cty CP ABC Retail','ev',120,'installing','2024-06-01',480000000,240000000,'pending','Đang chờ giấy phép PCCC.','TP.HCM'),
  ('PRJ-003','Solar BESS 30kWp + 20kWh – KS Đà Nẵng','Khách sạn Sông Hàn','solar',30,'pending','2024-07-20',620000000,0,'review','Cần bổ sung hồ sơ đất.','Đà Nẵng'),
  ('PRJ-004','Solar 100kWp – KCN Long An','KCN Long An Phase 2','solar',100,'completed','2023-11-10',1650000000,1650000000,'approved','Nghiệm thu hoàn thành.','Long An'),
  ('PRJ-005','Trụ sạc AC 22kW – Vinhomes','Vinhomes Grand Park','ev',22,'active','2024-05-12',95000000,95000000,'approved','Đã bàn giao vận hành.','TP.HCM'),
  ('PRJ-006','Solar 20kWp – Văn phòng Hà Nội','Tập đoàn XYZ Holdings','solar',20,'installing','2024-08-01',340000000,170000000,'approved','Đã có giấy phép xây dựng.','Hà Nội'),
  ('PRJ-007','Trạm sạc siêu tốc 240kW – QL1A','Công ty Logistics VTC','ev',240,'pending','2024-09-05',2100000000,0,'review','Đang thẩm định phương án kỹ thuật điện lực.','Bình Thuận');

-- ─── Invoices ─────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO invoices (id, project_id, amount, issued, due, status, type) VALUES
  ('INV-001','PRJ-001',850000000,'2024-03-20','2024-04-20','paid','full'),
  ('INV-002','PRJ-002',240000000,'2024-06-05','2024-07-05','paid','deposit'),
  ('INV-003','PRJ-002',240000000,'2024-09-01','2024-10-01','overdue','progress'),
  ('INV-004','PRJ-004',1650000000,'2023-12-01','2024-01-01','paid','full'),
  ('INV-005','PRJ-005',95000000,'2024-05-15','2024-06-15','paid','full'),
  ('INV-006','PRJ-006',170000000,'2024-08-05','2024-09-05','paid','deposit'),
  ('INV-007','PRJ-006',170000000,'2024-10-01','2024-11-01','pending','progress'),
  ('INV-008','PRJ-003',186000000,'2024-07-25','2024-08-25','pending','deposit'),
  ('INV-009','PRJ-007',630000000,'2024-09-10','2024-10-10','pending','deposit');

-- ─── Docs ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO docs (id, project_id, type, status, signed_date, expiry, file_name) VALUES
  ('DOC-001','PRJ-001','Hợp đồng EPC','signed','2024-03-15','2029-03-15','HĐ_PRJ001_signed.pdf'),
  ('DOC-002','PRJ-001','Giấy phép đấu nối điện','approved','2024-03-18',NULL,'GPDN_PRJ001.pdf'),
  ('DOC-003','PRJ-002','Hợp đồng EPC','signed','2024-06-01','2029-06-01','HĐ_PRJ002_signed.pdf'),
  ('DOC-004','PRJ-002','Giấy phép PCCC','pending',NULL,NULL,NULL),
  ('DOC-005','PRJ-003','Hợp đồng EPC','draft',NULL,NULL,'HĐ_PRJ003_draft.pdf'),
  ('DOC-006','PRJ-003','Hồ sơ đất','missing',NULL,NULL,NULL),
  ('DOC-007','PRJ-004','Hợp đồng EPC','signed','2023-11-10','2028-11-10','HĐ_PRJ004_signed.pdf'),
  ('DOC-008','PRJ-005','Hợp đồng EPC','signed','2024-05-12','2029-05-12','HĐ_PRJ005_signed.pdf'),
  ('DOC-009','PRJ-006','Hợp đồng EPC','signed','2024-08-01','2029-08-01','HĐ_PRJ006_signed.pdf'),
  ('DOC-010','PRJ-006','Giấy phép xây dựng','approved','2024-07-28','2025-07-28','GPXD_PRJ006.pdf'),
  ('DOC-011','PRJ-007','Hợp đồng EPC','draft',NULL,NULL,'HĐ_PRJ007_draft.pdf'),
  ('DOC-012','PRJ-007','Thẩm định phương án kỹ thuật','review',NULL,NULL,NULL);

-- ─── Admin user (change password before production!) ─────────────────────────
-- password_hash placeholder: use `wrangler d1 execute` with actual bcrypt hash
INSERT OR IGNORE INTO users (id, email, name, role) VALUES
  ('usr-admin-001', 'admin@nlpgroup.com.vn', 'NLP Admin', 'admin'),
  ('usr-finance-001', 'finance@nlpgroup.com.vn', 'NLP Finance', 'finance'),
  ('usr-legal-001', 'legal@nlpgroup.com.vn', 'NLP Legal', 'legal');

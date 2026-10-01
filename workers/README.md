# NLP Group — Full-Stack Setup Guide

## Kiến trúc tổng quan

```
Cloudflare Pages (static)
  ├── /                   → index.html (Marketing site)
  ├── /noi-bo/*           → pages/noi-bo-react/dist/ (React Portal)
  └── /api/*              → Workers API (Hono + D1 + R2)
```

---

## Yêu cầu

- Node.js ≥ 20
- pnpm hoặc npm
- Tài khoản Cloudflare (có Wrangler login)

---

## Giai đoạn 1: Khởi tạo Backend (lần đầu)

### 1.1 Cài Wrangler và login

```bash
npm install -g wrangler
wrangler login
```

### 1.2 Tạo D1 Database

```bash
cd workers
npm install
npm run db:create
# Copy database_id vào wrangler.toml (thay REPLACE_WITH_D1_ID)
```

### 1.3 Chạy migration + seed

```bash
npm run db:migrate
npm run db:seed
```

### 1.4 Tạo R2 Bucket

```bash
npm run r2:create
```

### 1.5 Tạo KV Namespace

```bash
wrangler kv namespace create nlpgroup-kv
# Copy id vào wrangler.toml (thay REPLACE_WITH_KV_ID)
```

### 1.6 Set secrets

```bash
# Tạo JWT_SECRET ngẫu nhiên 64 ký tự
wrangler secret put JWT_SECRET
# Nhập: <random-64-char-string>

# Giai đoạn 5 — Resend email
wrangler secret put RESEND_API_KEY
```

### 1.7 Dev local

```bash
# Terminal 1: Workers API
cd workers && npm run dev
# → http://localhost:8787

# Terminal 2: React Portal
cd pages/noi-bo-react
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:8787/api trong .env.local
npm install && npm run dev
# → http://localhost:5173
```

---

## Giai đoạn 2: Auth — Đặt password cho users

Sau khi seed DB, cần set password cho từng user:

```bash
# Chạy script tạo hash
node -e "
const { hashPassword } = await import('./workers/api/lib/password.ts')
console.log(await hashPassword('your-secure-password'))
"

# Cập nhật DB
wrangler d1 execute nlpgroup-db --command \
  \"UPDATE users SET password_hash = '<hash>' WHERE email = 'admin@nlpgroup.com.vn'\"
```

---

## Cấu trúc thư mục Workers

```
workers/
├── api/
│   ├── index.ts              ← Hono app entry
│   ├── db/
│   │   ├── schema.sql        ← D1 schema
│   │   └── seed.sql          ← Initial data
│   ├── lib/
│   │   ├── jwt.ts            ← Sign/verify JWT (Web Crypto)
│   │   └── password.ts       ← PBKDF2 password hashing
│   ├── middleware/
│   │   └── auth.ts           ← JWT guard + role guard
│   └── routes/
│       ├── auth.ts           ← login / refresh / logout / me
│       ├── projects.ts       ← CRUD projects
│       ├── invoices.ts       ← CRUD invoices
│       ├── docs.ts           ← CRUD docs
│       └── files.ts          ← R2 upload / presigned URL
├── package.json
└── tsconfig.json
```

## API Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | /api/auth/login | — | Đăng nhập |
| POST | /api/auth/refresh | — | Refresh token |
| POST | /api/auth/logout | — | Đăng xuất |
| GET  | /api/auth/me | ✅ | Info user hiện tại |
| GET  | /api/projects | ✅ | Danh sách dự án |
| GET  | /api/projects/:id | ✅ | Chi tiết dự án |
| POST | /api/projects | admin | Tạo dự án |
| PATCH | /api/projects/:id | admin/legal/finance | Cập nhật |
| DELETE | /api/projects/:id | admin | Xoá |
| GET  | /api/invoices | ✅ | Danh sách hoá đơn |
| POST | /api/invoices | admin/finance | Tạo hoá đơn |
| PATCH | /api/invoices/:id | admin/finance | Cập nhật |
| GET  | /api/docs | ✅ | Danh sách hồ sơ |
| POST | /api/docs | admin/legal | Tạo hồ sơ |
| PATCH | /api/docs/:id | admin/legal | Cập nhật |
| DELETE | /api/docs/:id | admin/legal | Xoá + R2 |
| POST | /api/files/upload | admin/legal/finance | Upload file lên R2 |
| GET  | /api/files/:key/url | ✅ | Presigned download URL |
| DELETE | /api/files/:key | admin/legal | Xoá file R2 |

## Deploy Production

```bash
# Deploy Workers API
cd workers && npm run deploy

# Build + deploy Portal
cd pages/noi-bo-react && npm run build
# Cloudflare Pages tự pickup từ dist/

# Migrate DB production
cd workers && npm run db:migrate:prod && npm run db:seed:prod
```

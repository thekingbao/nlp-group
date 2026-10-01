/**
 * NLP Group — Typed API Client
 * Used by noi-bo-react portal to call Workers API
 *
 * Usage:
 *   import { api } from '../lib/api'
 *   const projects = await api.projects.list({ type: 'solar' })
 */

// ─── Types (mirror DB schema) ─────────────────────────────────────────────────
export type ProjectType   = 'solar' | 'ev'
export type ProjectStatus = 'pending' | 'installing' | 'active' | 'completed'
export type LegalStatus   = 'pending' | 'review' | 'approved'
export type InvoiceStatus = 'pending' | 'paid' | 'overdue'
export type InvoiceType   = 'full' | 'deposit' | 'progress' | 'final'
export type DocStatus     = 'pending' | 'draft' | 'review' | 'approved' | 'signed' | 'missing'
export type UserRole      = 'admin' | 'finance' | 'legal' | 'viewer'

export interface Project {
  id:            string
  name:          string
  client:        string
  type:          ProjectType
  power:         number
  status:        ProjectStatus
  contract_date: string | null
  value:         number
  paid:          number
  legal_status:  LegalStatus
  legal_note:    string | null
  region:        string | null
  created_at:    string
  updated_at:    string
}

export interface Invoice {
  id:           string
  project_id:   string
  project_name: string
  client:       string
  amount:       number
  issued:       string
  due:          string
  status:       InvoiceStatus
  type:         InvoiceType
  created_at:   string
  updated_at:   string
}

export interface Doc {
  id:                    string
  project_id:            string
  project_name:          string
  project_legal_status:  LegalStatus
  type:                  string
  status:                DocStatus
  signed_date:           string | null
  expiry:                string | null
  file_key:              string | null
  file_name:             string | null
  created_at:            string
  updated_at:            string
}

export interface AuthUser {
  id:    string
  email: string
  name:  string
  role:  UserRole
}

export interface LoginResponse {
  access_token:  string
  refresh_token: string
  token_type:    string
  expires_in:    number
  user:          AuthUser
}

// ─── Token store (in-memory + localStorage) ───────────────────────────────────
const TOKEN_KEY   = 'nlp_access_token'
const REFRESH_KEY = 'nlp_refresh_token'

export const tokenStore = {
  getAccess:    () => localStorage.getItem(TOKEN_KEY),
  getRefresh:   () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh?: string) => {
    localStorage.setItem(TOKEN_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

// ─── Base fetch ───────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL ?? '/api'

async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = tokenStore.getAccess()
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let res = await fetch(`${BASE}${path}`, { ...init, headers })

  // Auto-refresh on 401
  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      headers.set('Authorization', `Bearer ${tokenStore.getAccess()}`)
      res = await fetch(`${BASE}${path}`, { ...init, headers })
    } else {
      tokenStore.clear()
      window.location.href = '/noi-bo/login'
      throw new Error('Session expired')
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

async function tryRefresh(): Promise<boolean> {
  const refresh = tokenStore.getRefresh()
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })
    if (!res.ok) return false
    const { access_token } = await res.json() as { access_token: string }
    tokenStore.set(access_token)
    return true
  } catch {
    return false
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const data = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    tokenStore.set(data.access_token, data.refresh_token)
    return data
  },
  logout: async () => {
    const refresh = tokenStore.getRefresh()
    await apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refresh }),
    }).catch(() => {})
    tokenStore.clear()
  },
  me: () => apiFetch<AuthUser>('/auth/me'),
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const projects = {
  list: (params?: { type?: ProjectType; status?: ProjectStatus; legal_status?: LegalStatus }) => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString()
    return apiFetch<Project[]>(`/projects${qs ? `?${qs}` : ''}`)
  },
  get:    (id: string)                   => apiFetch<Project>(`/projects/${id}`),
  create: (body: Partial<Project>)       => apiFetch<Project>('/projects', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Project>) =>
    apiFetch<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string)                   => apiFetch<{ ok: boolean }>(`/projects/${id}`, { method: 'DELETE' }),
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
const invoices = {
  list: (params?: { project_id?: string; status?: InvoiceStatus }) => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString()
    return apiFetch<Invoice[]>(`/invoices${qs ? `?${qs}` : ''}`)
  },
  get:    (id: string)                    => apiFetch<Invoice>(`/invoices/${id}`),
  create: (body: Partial<Invoice>)        => apiFetch<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Invoice>) =>
    apiFetch<Invoice>(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}

// ─── Docs ─────────────────────────────────────────────────────────────────────
const docs = {
  list: (params?: { project_id?: string; status?: DocStatus }) => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString()
    return apiFetch<Doc[]>(`/docs${qs ? `?${qs}` : ''}`)
  },
  get:    (id: string)               => apiFetch<Doc>(`/docs/${id}`),
  create: (body: Partial<Doc>)       => apiFetch<Doc>('/docs', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Doc>) =>
    apiFetch<Doc>(`/docs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string)               => apiFetch<{ ok: boolean }>(`/docs/${id}`, { method: 'DELETE' }),
  uploadFile: async (docId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    form.append('doc_id', docId)
    return apiFetch<{ key: string; file_name: string; doc_id: string }>(
      '/files/upload', { method: 'POST', body: form },
    )
  },
  getFileUrl: (key: string) =>
    apiFetch<{ url: string; expires_in: number; key: string }>(`/files/${encodeURIComponent(key)}/url`),
}

// ─── Export ───────────────────────────────────────────────────────────────────
export const api = { auth, projects, invoices, docs }

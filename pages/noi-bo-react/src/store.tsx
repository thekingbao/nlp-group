/**
 * NLP Group — Shared Portal Store (React Context)
 * Giai đoạn 3: Replaced seed data with real API calls via api.ts
 * State persisted in React, mutations call Workers API and update local state optimistically.
 */

import {
  createContext, useContext, useReducer,
  useCallback, useEffect, useState,
} from 'react'
import { api } from './lib/api'
import type { Project, Invoice, Doc, AuthUser } from './lib/api'

// ─── Re-export types for consumers ────────────────────────────────────────────
export type { Project, Invoice, Doc, AuthUser }

// ─── State shape ──────────────────────────────────────────────────────────────
type Notification = {
  id: number; event: string; msg: string; ts: string; read: boolean
}

type PortalState = {
  projects:      Project[]
  invoices:      Invoice[]
  docs:          Doc[]
  notifications: Notification[]
  loading:       boolean
  error:         string | null
  user:          AuthUser | null
}

const initialState: PortalState = {
  projects: [], invoices: [], docs: [],
  notifications: [], loading: true, error: null, user: null,
}

// ─── Actions ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'LOADED'; projects: Project[]; invoices: Invoice[]; docs: Doc[] }
  | { type: 'ERROR';  error: string }
  | { type: 'SET_USER'; user: AuthUser | null }
  | { type: 'PROJECT_UPDATED'; project: Project }
  | { type: 'PROJECT_ADDED';   project: Project }
  | { type: 'PROJECT_DELETED'; id: string }
  | { type: 'INVOICE_UPDATED'; invoice: Invoice }
  | { type: 'INVOICE_ADDED';   invoice: Invoice }
  | { type: 'DOC_UPDATED';     doc: Doc }
  | { type: 'DOC_ADDED';       doc: Doc }
  | { type: 'DOC_DELETED';     id: string }
  | { type: 'NOTIFY';          event: string; msg: string }
  | { type: 'MARK_READ' }

function notify(msg: string, event: string): Notification {
  return { id: Date.now(), event, msg, ts: new Date().toLocaleTimeString('vi-VN'), read: false }
}

function portalReducer(state: PortalState, action: Action): PortalState {
  switch (action.type) {
    case 'LOADED':
      return { ...state, loading: false, error: null, projects: action.projects, invoices: action.invoices, docs: action.docs }
    case 'ERROR':
      return { ...state, loading: false, error: action.error }
    case 'SET_USER':
      return { ...state, user: action.user }
    case 'PROJECT_UPDATED': {
      const projects = state.projects.map(p => p.id === action.project.id ? action.project : p)
      return { ...state, projects, notifications: [notify(`Cập nhật dự án ${action.project.name}`, 'project:updated'), ...state.notifications] }
    }
    case 'PROJECT_ADDED':
      return { ...state, projects: [action.project, ...state.projects], notifications: [notify(`Thêm dự án: ${action.project.name}`, 'project:added'), ...state.notifications] }
    case 'PROJECT_DELETED': {
      const projects = state.projects.filter(p => p.id !== action.id)
      return { ...state, projects, notifications: [notify(`Xoá dự án ${action.id}`, 'project:deleted'), ...state.notifications] }
    }
    case 'INVOICE_UPDATED': {
      const invoices = state.invoices.map(i => i.id === action.invoice.id ? action.invoice : i)
      return { ...state, invoices, notifications: [notify(`Hoá đơn ${action.invoice.id} → ${action.invoice.status}`, 'invoice:updated'), ...state.notifications] }
    }
    case 'INVOICE_ADDED':
      return { ...state, invoices: [...state.invoices, action.invoice], notifications: [notify(`Thêm hoá đơn ${action.invoice.id}`, 'invoice:added'), ...state.notifications] }
    case 'DOC_UPDATED': {
      const docs = state.docs.map(d => d.id === action.doc.id ? action.doc : d)
      return { ...state, docs, notifications: [notify(`Hồ sơ ${action.doc.id} → ${action.doc.status}`, 'doc:updated'), ...state.notifications] }
    }
    case 'DOC_ADDED':
      return { ...state, docs: [...state.docs, action.doc], notifications: [notify(`Thêm hồ sơ: ${action.doc.type}`, 'doc:added'), ...state.notifications] }
    case 'DOC_DELETED': {
      const docs = state.docs.filter(d => d.id !== action.id)
      return { ...state, docs, notifications: [notify(`Xoá hồ sơ ${action.id}`, 'doc:deleted'), ...state.notifications] }
    }
    case 'NOTIFY':
      return { ...state, notifications: [notify(action.msg, action.event), ...state.notifications] }
    case 'MARK_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const PortalCtx = createContext<ReturnType<typeof makeValue> | null>(null)

function makeValue(state: PortalState, dispatch: React.Dispatch<Action>) {
  // ── Selectors ──────────────────────────────────────────────────────────────
  const getProject  = (id: string) => state.projects.find(p => p.id === id)
  const getProjects = (filter: { type?: string; status?: string; legal_status?: string } = {}) =>
    state.projects.filter(p =>
      (!filter.type         || p.type         === filter.type) &&
      (!filter.status       || p.status       === filter.status) &&
      (!filter.legal_status || p.legal_status === filter.legal_status)
    )
  const getInvoices = (projectId?: string) =>
    projectId ? state.invoices.filter(i => i.project_id === projectId) : state.invoices
  const getDocs = (projectId?: string) =>
    projectId ? state.docs.filter(d => d.project_id === projectId) : state.docs

  // ── Actions → API → dispatch ───────────────────────────────────────────────
  const actions = {
    updateProjectStatus: async (id: string, status: string) => {
      const updated = await api.projects.update(id, { status } as Partial<Project>)
      dispatch({ type: 'PROJECT_UPDATED', project: updated })
    },
    updateLegalStatus: async (id: string, legal_status: string, legal_note?: string) => {
      const body: Partial<Project> = { legal_status } as Partial<Project>
      if (legal_note) (body as Record<string, unknown>).legal_note = legal_note
      const updated = await api.projects.update(id, body)
      dispatch({ type: 'PROJECT_UPDATED', project: updated })
    },
    createProject: async (body: Partial<Project>) => {
      const created = await api.projects.create(body)
      dispatch({ type: 'PROJECT_ADDED', project: created })
    },
    deleteProject: async (id: string) => {
      await api.projects.delete(id)
      dispatch({ type: 'PROJECT_DELETED', id })
    },
    updateInvoiceStatus: async (id: string, status: string) => {
      const updated = await api.invoices.update(id, { status } as Partial<Invoice>)
      dispatch({ type: 'INVOICE_UPDATED', invoice: updated })
    },
    addInvoice: async (body: Partial<Invoice>) => {
      const created = await api.invoices.create(body)
      dispatch({ type: 'INVOICE_ADDED', invoice: created })
    },
    updateDocStatus: async (id: string, status: string) => {
      const updated = await api.docs.update(id, { status } as Partial<Doc>)
      dispatch({ type: 'DOC_UPDATED', doc: updated })
    },
    addDoc: async (body: Partial<Doc>) => {
      const created = await api.docs.create(body)
      dispatch({ type: 'DOC_ADDED', doc: created })
    },
    deleteDoc: async (id: string) => {
      await api.docs.delete(id)
      dispatch({ type: 'DOC_DELETED', id })
    },
    uploadDocFile: async (docId: string, file: File) => {
      const result = await api.docs.uploadFile(docId, file)
      // Refresh the specific doc after upload
      const updated = await api.docs.get(docId)
      dispatch({ type: 'DOC_UPDATED', doc: updated })
      return result
    },
    markRead: () => dispatch({ type: 'MARK_READ' }),
    logout: async () => {
      await api.auth.logout()
      window.location.href = '/noi-bo/login'
    },
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = () => {
    const { projects, invoices } = state
    return {
      totalValue:     projects.reduce((s, p) => s + p.value, 0),
      totalPaid:      projects.reduce((s, p) => s + p.paid, 0),
      outstanding:    projects.reduce((s, p) => s + (p.value - p.paid), 0),
      overdue:        invoices.filter(i => i.status === 'overdue').length,
      pending:        invoices.filter(i => i.status === 'pending').length,
      legalIssues:    projects.filter(p => ['review', 'pending'].includes(p.legal_status)).length,
      totalProjects:  projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
    }
  }

  const fmt     = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('vi-VN') : '—'
  const pct     = (a: number, b: number) => b ? Math.round(a / b * 100) : 0

  const unreadCount = state.notifications.filter(n => !n.read).length

  return {
    state, dispatch,
    getProject, getProjects, getInvoices, getDocs,
    stats, fmt, fmtDate, pct,
    actions, unreadCount,
    loading: state.loading, error: state.error, user: state.user,
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(portalReducer, initialState)

  // Load all data on mount
  useEffect(() => {
    ;(async () => {
      try {
        const [me, projects, invoices, docs] = await Promise.all([
          api.auth.me().catch(() => null),
          api.projects.list(),
          api.invoices.list(),
          api.docs.list(),
        ])
        if (me) dispatch({ type: 'SET_USER', user: me })
        dispatch({ type: 'LOADED', projects, invoices, docs })
      } catch (err) {
        dispatch({ type: 'ERROR', error: (err as Error).message ?? 'Lỗi tải dữ liệu' })
      }
    })()
  }, [])

  const value = useCallback(
    () => makeValue(state, dispatch),
    [state],
  )

  return (
    <PortalCtx.Provider value={value()}>
      {children}
    </PortalCtx.Provider>
  )
}

export const usePortal = () => {
  const ctx = useContext(PortalCtx)
  if (!ctx) throw new Error('usePortal must be used inside PortalProvider')
  return ctx
}

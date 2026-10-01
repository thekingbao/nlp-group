/**
 * NLP Group — Shared Portal Store (React Context)
 * Mirrors db.js logic but as React state with Context + useReducer
 */

import { createContext, useContext, useReducer, useCallback } from 'react'

// ─── Seed Data ────────────────────────────────────────────────────────────
const INIT_PROJECTS = [
  { id:'PRJ-001', name:'Solar 50kWp – Nhà máy Bình Dương', client:'Cty TNHH Bình Minh Textiles', type:'solar', power:50, status:'active', contractDate:'2024-03-15', value:850000000, paid:850000000, legalStatus:'approved', legalNote:'Hồ sơ đầy đủ, đã ký kết.', region:'Bình Dương' },
  { id:'PRJ-002', name:'Trạm sạc 4 cổng DC – Chuỗi ABC', client:'Cty CP ABC Retail', type:'ev', power:120, status:'installing', contractDate:'2024-06-01', value:480000000, paid:240000000, legalStatus:'pending', legalNote:'Đang chờ giấy phép PCCC.', region:'TP.HCM' },
  { id:'PRJ-003', name:'Solar BESS 30kWp + 20kWh – KS Đà Nẵng', client:'Khách sạn Sông Hàn', type:'solar', power:30, status:'pending', contractDate:'2024-07-20', value:620000000, paid:0, legalStatus:'review', legalNote:'Cần bổ sung hồ sơ đất.', region:'Đà Nẵng' },
  { id:'PRJ-004', name:'Solar 100kWp – KCN Long An', client:'KCN Long An Phase 2', type:'solar', power:100, status:'completed', contractDate:'2023-11-10', value:1650000000, paid:1650000000, legalStatus:'approved', legalNote:'Nghiệm thu hoàn thành.', region:'Long An' },
  { id:'PRJ-005', name:'Trụ sạc AC 22kW – Vinhomes', client:'Vinhomes Grand Park', type:'ev', power:22, status:'active', contractDate:'2024-05-12', value:95000000, paid:95000000, legalStatus:'approved', legalNote:'Đã bàn giao vận hành.', region:'TP.HCM' },
  { id:'PRJ-006', name:'Solar 20kWp – Văn phòng Hà Nội', client:'Tập đoàn XYZ Holdings', type:'solar', power:20, status:'installing', contractDate:'2024-08-01', value:340000000, paid:170000000, legalStatus:'approved', legalNote:'Đã có giấy phép xây dựng.', region:'Hà Nội' },
  { id:'PRJ-007', name:'Trạm sạc siêu tốc 240kW – QL1A', client:'Công ty Logistics VTC', type:'ev', power:240, status:'pending', contractDate:'2024-09-05', value:2100000000, paid:0, legalStatus:'review', legalNote:'Đang thẩm định phương án kỹ thuật điện lực.', region:'Bình Thuận' },
]

const INIT_INVOICES = [
  { id:'INV-001', projectId:'PRJ-001', amount:850000000, issued:'2024-03-20', due:'2024-04-20', status:'paid', type:'full' },
  { id:'INV-002', projectId:'PRJ-002', amount:240000000, issued:'2024-06-05', due:'2024-07-05', status:'paid', type:'deposit' },
  { id:'INV-003', projectId:'PRJ-002', amount:240000000, issued:'2024-09-01', due:'2024-10-01', status:'overdue', type:'progress' },
  { id:'INV-004', projectId:'PRJ-004', amount:1650000000, issued:'2023-12-01', due:'2024-01-01', status:'paid', type:'full' },
  { id:'INV-005', projectId:'PRJ-005', amount:95000000, issued:'2024-05-15', due:'2024-06-15', status:'paid', type:'full' },
  { id:'INV-006', projectId:'PRJ-006', amount:170000000, issued:'2024-08-05', due:'2024-09-05', status:'paid', type:'deposit' },
  { id:'INV-007', projectId:'PRJ-006', amount:170000000, issued:'2024-10-01', due:'2024-11-01', status:'pending', type:'progress' },
  { id:'INV-008', projectId:'PRJ-003', amount:186000000, issued:'2024-07-25', due:'2024-08-25', status:'pending', type:'deposit' },
  { id:'INV-009', projectId:'PRJ-007', amount:630000000, issued:'2024-09-10', due:'2024-10-10', status:'pending', type:'deposit' },
]

const INIT_DOCS = [
  { id:'DOC-001', projectId:'PRJ-001', type:'Hợp đồng EPC', status:'signed', signedDate:'2024-03-15', expiry:'2029-03-15', file:'HĐ_PRJ001_signed.pdf' },
  { id:'DOC-002', projectId:'PRJ-001', type:'Giấy phép đấu nối điện', status:'approved', signedDate:'2024-03-18', expiry:null, file:'GPDN_PRJ001.pdf' },
  { id:'DOC-003', projectId:'PRJ-002', type:'Hợp đồng EPC', status:'signed', signedDate:'2024-06-01', expiry:'2029-06-01', file:'HĐ_PRJ002_signed.pdf' },
  { id:'DOC-004', projectId:'PRJ-002', type:'Giấy phép PCCC', status:'pending', signedDate:null, expiry:null, file:null },
  { id:'DOC-005', projectId:'PRJ-003', type:'Hợp đồng EPC', status:'draft', signedDate:null, expiry:null, file:'HĐ_PRJ003_draft.pdf' },
  { id:'DOC-006', projectId:'PRJ-003', type:'Hồ sơ đất', status:'missing', signedDate:null, expiry:null, file:null },
  { id:'DOC-007', projectId:'PRJ-004', type:'Hợp đồng EPC', status:'signed', signedDate:'2023-11-10', expiry:'2028-11-10', file:'HĐ_PRJ004_signed.pdf' },
  { id:'DOC-008', projectId:'PRJ-005', type:'Hợp đồng EPC', status:'signed', signedDate:'2024-05-12', expiry:'2029-05-12', file:'HĐ_PRJ005_signed.pdf' },
  { id:'DOC-009', projectId:'PRJ-006', type:'Hợp đồng EPC', status:'signed', signedDate:'2024-08-01', expiry:'2029-08-01', file:'HĐ_PRJ006_signed.pdf' },
  { id:'DOC-010', projectId:'PRJ-006', type:'Giấy phép xây dựng', status:'approved', signedDate:'2024-07-28', expiry:'2025-07-28', file:'GPXD_PRJ006.pdf' },
  { id:'DOC-011', projectId:'PRJ-007', type:'Hợp đồng EPC', status:'draft', signedDate:null, expiry:null, file:'HĐ_PRJ007_draft.pdf' },
  { id:'DOC-012', projectId:'PRJ-007', type:'Thẩm định phương án kỹ thuật', status:'review', signedDate:null, expiry:null, file:null },
]

// ─── Reducer ──────────────────────────────────────────────────────────────
const initialState = {
  projects: INIT_PROJECTS,
  invoices: INIT_INVOICES,
  docs: INIT_DOCS,
  notifications: [],
}

function portalReducer(state, action) {
  const ts = new Date().toLocaleTimeString('vi-VN')
  switch (action.type) {
    case 'PROJECT_STATUS': {
      const projects = state.projects.map(p =>
        p.id === action.id ? { ...p, status: action.status } : p
      )
      const p = projects.find(p => p.id === action.id)
      return { ...state, projects, notifications: [{ id: Date.now(), event: 'project:statusChanged', msg: `Dự án ${p.name} → ${action.status}`, ts, read: false }, ...state.notifications] }
    }
    case 'LEGAL_STATUS': {
      const projects = state.projects.map(p =>
        p.id === action.id ? { ...p, legalStatus: action.legalStatus, legalNote: action.note || p.legalNote } : p
      )
      const p = projects.find(p => p.id === action.id)
      return { ...state, projects, notifications: [{ id: Date.now(), event: 'legal:statusChanged', msg: `Pháp lý ${p.name} → ${action.legalStatus}`, ts, read: false }, ...state.notifications] }
    }
    case 'INVOICE_STATUS': {
      const invoices = state.invoices.map(i =>
        i.id === action.id ? { ...i, status: action.status } : i
      )
      return { ...state, invoices, notifications: [{ id: Date.now(), event: 'invoice:statusChanged', msg: `Hóa đơn ${action.id} → ${action.status === 'paid' ? '✅ Đã thu' : action.status}`, ts, read: false }, ...state.notifications] }
    }
    case 'DOC_STATUS': {
      const docs = state.docs.map(d =>
        d.id === action.id ? { ...d, status: action.status } : d
      )
      return { ...state, docs, notifications: [{ id: Date.now(), event: 'doc:statusChanged', msg: `Hồ sơ ${action.id} → ${action.status}`, ts, read: false }, ...state.notifications] }
    }
    case 'DOC_ADD': {
      const newDoc = { id: `DOC-${String(state.docs.length + 1).padStart(3,'0')}`, ...action.doc }
      return { ...state, docs: [...state.docs, newDoc], notifications: [{ id: Date.now(), event: 'doc:added', msg: `Thêm hồ sơ: ${action.doc.type} (${action.doc.projectId})`, ts, read: false }, ...state.notifications] }
    }
    case 'MARK_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────
const PortalCtx = createContext(null)

export function PortalProvider({ children }) {
  const [state, dispatch] = useReducer(portalReducer, initialState)

  const actions = {
    updateProjectStatus: (id, status) => dispatch({ type: 'PROJECT_STATUS', id, status }),
    updateLegalStatus:   (id, legalStatus, note) => dispatch({ type: 'LEGAL_STATUS', id, legalStatus, note }),
    updateInvoiceStatus: (id, status) => dispatch({ type: 'INVOICE_STATUS', id, status }),
    updateDocStatus:     (id, status) => dispatch({ type: 'DOC_STATUS', id, status }),
    addDoc:              (doc) => dispatch({ type: 'DOC_ADD', doc }),
    markRead:            () => dispatch({ type: 'MARK_READ' }),
  }

  // ─ Derived helpers ──────────────────────────────────────────────────────
  const getProject  = useCallback(id => state.projects.find(p => p.id === id), [state.projects])
  const getProjects = useCallback((filter = {}) =>
    state.projects.filter(p =>
      (!filter.type        || p.type        === filter.type) &&
      (!filter.status      || p.status      === filter.status) &&
      (!filter.legalStatus || p.legalStatus === filter.legalStatus)
    ), [state.projects])
  const getInvoices = useCallback(projectId =>
    projectId ? state.invoices.filter(i => i.projectId === projectId) : state.invoices,
    [state.invoices])
  const getDocs = useCallback(projectId =>
    projectId ? state.docs.filter(d => d.projectId === projectId) : state.docs,
    [state.docs])

  const stats = useCallback(() => {
    const { projects, invoices } = state
    return {
      totalValue:    projects.reduce((s, p) => s + p.value, 0),
      totalPaid:     projects.reduce((s, p) => s + p.paid, 0),
      outstanding:   projects.reduce((s, p) => s + (p.value - p.paid), 0),
      overdue:       invoices.filter(i => i.status === 'overdue').length,
      pending:       invoices.filter(i => i.status === 'pending').length,
      legalIssues:   projects.filter(p => ['review','pending'].includes(p.legalStatus)).length,
      totalProjects: projects.length,
      activeProjects:projects.filter(p => p.status === 'active').length,
    }
  }, [state])

  const fmt = n => new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND', maximumFractionDigits:0 }).format(n)
  const fmtDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : '—'
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0

  const unreadCount = state.notifications.filter(n => !n.read).length

  return (
    <PortalCtx.Provider value={{ state, actions, getProject, getProjects, getInvoices, getDocs, stats, fmt, fmtDate, pct, unreadCount }}>
      {children}
    </PortalCtx.Provider>
  )
}

export const usePortal = () => useContext(PortalCtx)

import { useState } from 'react'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge, Drawer } from '../../components/UI'

export default function LegalDocs() {
  const { getProjects, getDocs, actions } = usePortal()
  const [addDrawer, setAddDrawer] = useState(false)
  const [addProjectId, setAddProjectId] = useState('')
  const [addType, setAddType] = useState('')
  const [addStatus, setAddStatus] = useState('pending')

  const projs = getProjects()

  const submitDoc = () => {
    if (!addProjectId || !addType.trim()) { alert('Vui lòng điền đầy đủ thông tin'); return }
    actions.addDoc({ projectId: addProjectId, type: addType, status: addStatus, signedDate: null, expiry: null, file: null })
    setAddDrawer(false)
    setAddType('')
    setAddProjectId('')
  }

  return (
    <>
      <Topbar title="Hồ sơ pháp lý" sub="Quản lý hồ sơ theo dự án">
        <button className="btn btn-primary btn-sm" style={{ background: '#7c3aed', border: 'none' }} onClick={() => setAddDrawer(true)}>+ Thêm hồ sơ</button>
      </Topbar>

      <div className="portal-content">
        {projs.map(p => {
          const docs = getDocs(p.id)
          return (
            <Panel
              key={p.id}
              title={<span>{p.name} <span className="td-id" style={{ marginLeft: 8, fontSize: '.75rem' }}>{p.id}</span></span>}
              actions={<Badge status={p.legalStatus} />}
            >
              <div style={{ padding: '12px 16px' }}>
                {docs.map(d => (
                  <div key={d.id} className="doc-row">
                    <div className="doc-row__info">
                      <div className="doc-row__type">{d.type}</div>
                      <div className="doc-row__file">
                        {d.file ? `📎 ${d.file}` : '— Chưa có file'}
                        {d.signedDate ? ` · Ký: ${new Date(d.signedDate).toLocaleDateString('vi-VN')}` : ''}
                      </div>
                    </div>
                    <Badge status={d.status} />
                    <div className="doc-row__actions">
                      {!['approved','signed'].includes(d.status) && (
                        <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)', border: 'none' }} onClick={() => actions.updateDocStatus(d.id, 'approved')}>✅</button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={() => { setAddProjectId(p.id); setAddDrawer(true) }}
                >
                  + Thêm hồ sơ
                </button>
              </div>
            </Panel>
          )
        })}
      </div>

      {/* Add Doc Drawer */}
      <Drawer open={addDrawer} onClose={() => setAddDrawer(false)} title="Thêm hồ sơ pháp lý">
        <div className="form-group">
          <label className="form-label">Dự án</label>
          <select className="form-select" value={addProjectId} onChange={e => setAddProjectId(e.target.value)}>
            <option value="">-- Chọn dự án --</option>
            {projs.map(p => <option key={p.id} value={p.id}>{p.id} · {p.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Loại hồ sơ</label>
          <input className="form-input" placeholder="VD: Giấy phép PCCC, Hợp đồng EPC..." value={addType} onChange={e => setAddType(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Trạng thái</label>
          <select className="form-select" value={addStatus} onChange={e => setAddStatus(e.target.value)}>
            <option value="pending">Chờ duyệt</option>
            <option value="draft">Bản nháp</option>
            <option value="review">Đang xét</option>
            <option value="approved">Đã duyệt</option>
            <option value="missing">Thiếu hồ sơ</option>
          </select>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#7c3aed', border: 'none', marginTop: 8 }} onClick={submitDoc}>
          + Thêm hồ sơ
        </button>
      </Drawer>
    </>
  )
}

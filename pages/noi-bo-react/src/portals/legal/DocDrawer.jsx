import { usePortal } from '../../store'
import { Badge, Drawer } from '../../components/UI'

export default function LegalDocDrawer({ project, onClose }) {
  const { getDocs, actions, fmtDate } = usePortal()
  const docs = getDocs(project.id)

  return (
    <Drawer open={!!project} onClose={onClose} title={project.name} sub={`${project.id} · ${project.client}`}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '.06em', marginBottom: 8 }}>Trạng thái pháp lý</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Badge status={project.legalStatus} />
          <span style={{ fontSize: '.845rem', color: 'var(--text-muted)' }}>{project.legalNote}</span>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '.06em', marginBottom: 10 }}>
          Hồ sơ pháp lý ({docs.length})
        </div>
        {docs.map(d => (
          <div key={d.id} className="doc-row">
            <div className="doc-row__info">
              <div className="doc-row__type">{d.type}</div>
              <div className="doc-row__file">
                {d.file ? `📎 ${d.file}` : '— Chưa có file'}
                {d.signedDate ? ` · ${new Date(d.signedDate).toLocaleDateString('vi-VN')}` : ''}
                {d.expiry ? ` · HH: ${new Date(d.expiry).toLocaleDateString('vi-VN')}` : ''}
              </div>
            </div>
            <Badge status={d.status} />
            {!['approved','signed'].includes(d.status) && (
              <button className="vnkr-btn vnkr-btn--primary btn-sm" style={{ background: 'var(--success)', border: 'none' }} onClick={() => actions.updateDocStatus(d.id, 'approved')}>✅</button>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  )
}

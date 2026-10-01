import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function LoginPage() {
  const nav = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.auth.login(email, password)
      nav('/', { replace: true })
    } catch (err) {
      setError(err.message ?? 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">
          <div className="login-logo__mark">NLP</div>
          <div className="login-logo__sub">Nội bộ Portal</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email" required autoComplete="email"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="admin@nlpgroup.com.vn"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mật khẩu</label>
          <input
            className="form-input"
            type="password" required autoComplete="current-password"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit" disabled={loading}
          style={{ justifyContent: 'center', marginTop: 4 }}
        >
          {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}

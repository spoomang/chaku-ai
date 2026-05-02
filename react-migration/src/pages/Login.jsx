import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authenticate } from '../services/api'

export default function Login() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  async function handleLogin() {
    setError('')
    const res = await authenticate(userId, password)
    if (!res.token) {
      setError('Error authenticating')
    } else {
      setAuth(res)
      navigate('/users')
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2 className="page-title">Sign In</h2>
        <div className="form-group">
          <label>User ID</label>
          <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="Enter user ID" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleLogin}>Sign In</button>
        </div>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  )
}

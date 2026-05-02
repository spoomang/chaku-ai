import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUsers, createUser } from '../services/api'

export default function Users() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [status, setStatus] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    const res = await getUsers(auth.token)
    if (Array.isArray(res)) setUsers(res)
  }

  async function handleCreateUser() {
    await createUser({ name, shortName, email, mobile })
    setStatus('created successfully')
    setName('')
    setShortName('')
    setEmail('')
    setMobile('')
    fetchUsers()
  }

  return (
    <>
      <div className="card">
        <h2 className="page-title">Users</h2>
        <p className="page-subtitle">Create a new user account</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label>Short Name</label>
            <input value={shortName} onChange={e => setShortName(e.target.value)} placeholder="Short name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="form-group">
            <label>Mobile</label>
            <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Mobile number" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleCreateUser}>Create User</button>
          {status && <span className="status-msg">{status}</span>}
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">All Users</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Short Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.memberId}
                  className="row-link"
                  onClick={() => setSelectedUser(u)}
                >
                  <td>{u.memberId}</td>
                  <td>{u.name}</td>
                  <td>{u.shortName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Hi, {selectedUser.name}</h3>
            <p className="modal-subtitle">What would you like to do?</p>
            <div className="activity-grid">
              <button
                className="activity-btn"
                onClick={() => navigate('/snake', { state: { user: selectedUser } })}
              >
                <span className="activity-icon">🐍</span>
                Snake Game
              </button>
              <button
                className="activity-btn"
                onClick={() => navigate(`/users/${selectedUser.memberId}/groups`, { state: { user: selectedUser } })}
              >
                <span className="activity-icon">📅</span>
                Event Management
              </button>
            </div>
            <button className="modal-cancel" onClick={() => setSelectedUser(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  )
}

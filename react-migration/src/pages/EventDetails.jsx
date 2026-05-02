import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEventMembers, joinEvent } from '../services/api'
import Chat from '../components/Chat'

export default function EventDetails() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const { userId, groupId, eventId } = useParams()
  const { state } = useLocation()
  const { user, group, event } = state || {}

  const [members, setMembers] = useState([])
  const [status, setStatus] = useState('')
  const [showChat, setShowChat] = useState(false)

  useEffect(() => { fetchMembers() }, [])

  async function fetchMembers() {
    const res = await getEventMembers(eventId, auth.token)
    if (Array.isArray(res)) setMembers(res)
  }

  async function handleJoinEvent() {
    const res = await joinEvent(
      { eventId, memberId: userId, groupId: event.groupId, action: 'JOIN' },
      auth.token
    )
    if (res.Status && res.Status > 200) {
      setStatus(res.Message)
    } else {
      fetchMembers()
    }
  }

  return (
    <>
      <div className="card">
        <h2 className="page-title">{event?.name}</h2>
        <p className="page-subtitle">Group: {group?.name} &mdash; User: {user?.name}</p>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={() => navigate(`/users/${userId}/groups/${groupId}/events`, { state: { user, group } })}>
            &larr; Back to Events
          </button>
          <button className="btn btn-primary" onClick={handleJoinEvent}>Join Event</button>
          {status && <span className="status-msg">{status}</span>}
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Members</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i}>
                  <td>{m.memberId}</td>
                  <td>{m.memberName}</td>
                  <td>{m.action}</td>
                  <td>{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!showChat && (
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-ghost" onClick={() => setShowChat(true)}>Load Chat</button>
        </div>
      )}
      {showChat && (
        <Chat
          eventId={eventId}
          groupId={groupId}
          userId={userId}
          userName={user?.name}
          token={auth.token}
        />
      )}
    </>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyGroups, getAllGroups, createGroup, joinGroup } from '../services/api'

export default function Groups() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const { userId } = useParams()
  const { state } = useLocation()
  const user = state?.user

  const [myGroups, setMyGroups] = useState([])
  const [otherGroups, setOtherGroups] = useState([])
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [size, setSize] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchMyGroups()
    fetchOtherGroups()
  }, [])

  async function fetchMyGroups() {
    const res = await getMyGroups(userId, auth.token)
    if (Array.isArray(res)) setMyGroups(res)
  }

  async function fetchOtherGroups() {
    const res = await getAllGroups(auth.token)
    if (Array.isArray(res)) setOtherGroups(res)
  }

  async function handleCreateGroup() {
    await createGroup(
      {
        groupInfo: { name: groupName, description, size: parseInt(size) },
        members: [{ memberId: userId }],
      },
      auth.token
    )
    setStatus('created successfully')
    setGroupName('')
    setDescription('')
    setSize('')
    fetchMyGroups()
  }

  async function handleJoinGroup(groupId) {
    const res = await joinGroup(groupId, userId, auth.token)
    if (res.Status && res.Status > 200) {
      setStatus(res.Message)
    } else {
      fetchMyGroups()
    }
  }

  function goToEvents(group) {
    navigate(`/users/${userId}/groups/${group.groupId}/events`, { state: { user, group } })
  }

  return (
    <>
      <div className="card">
        <h2 className="page-title">Groups</h2>
        <p className="page-subtitle">User: {user?.name}</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Group Name</label>
            <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Group name" />
          </div>
          <div className="form-group">
            <label>Size</label>
            <input value={size} onChange={e => setSize(e.target.value)} placeholder="Max members" />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleCreateGroup}>Create Group</button>
          {status && <span className="status-msg">{status}</span>}
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">My Groups</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Group ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {myGroups.map(g => (
                <tr key={g.groupId} className="row-link" onClick={() => goToEvents(g)}>
                  <td>{g.groupId}</td>
                  <td>{g.name}</td>
                  <td>{g.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Other Groups</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Group ID</th>
                <th>Name</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {otherGroups.map(g => (
                <tr key={g.groupId}>
                  <td>{g.groupId}</td>
                  <td>{g.name}</td>
                  <td>{g.description}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleJoinGroup(g.groupId)}>Join</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

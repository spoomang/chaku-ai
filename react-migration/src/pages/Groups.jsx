import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyGroups, getAllGroups, createGroup, joinGroup } from '../services/api'

function CreateGroupDialog({ onClose, onCreated }) {
  const { auth } = useAuth()
  const { userId } = useParams()
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [size, setSize] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  function validate() {
    const errs = {}
    if (!groupName.trim()) errs.groupName = 'Group name is required'
    if (!description.trim()) errs.description = 'Description is required'
    if (!size.toString().trim()) {
      errs.size = 'Size is required'
    } else if (isNaN(size) || parseInt(size) <= 0) {
      errs.size = 'Size must be a positive number'
    }
    return errs
  }

  async function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    await createGroup(
      {
        groupInfo: { name: groupName, description, size: parseInt(size) },
        members: [{ memberId: userId }],
      },
      auth.token
    )
    setStatus('Group created successfully')
    onCreated()
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <p className="modal-title">Create Group</p>
        <p className="modal-subtitle">Fill in the details to create a new group</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Group Name</label>
            <input
              value={groupName}
              onChange={e => { setGroupName(e.target.value); setErrors(ev => ({ ...ev, groupName: '' })) }}
              placeholder="Group name"
              style={errors.groupName ? { borderColor: 'var(--error, #e53e3e)' } : {}}
            />
            {errors.groupName && <span style={{ color: 'var(--error, #e53e3e)', fontSize: '0.8rem' }}>{errors.groupName}</span>}
          </div>
          <div className="form-group">
            <label>Size</label>
            <input
              value={size}
              onChange={e => { setSize(e.target.value); setErrors(ev => ({ ...ev, size: '' })) }}
              placeholder="Max members"
              type="number"
              min="1"
              style={errors.size ? { borderColor: 'var(--error, #e53e3e)' } : {}}
            />
            {errors.size && <span style={{ color: 'var(--error, #e53e3e)', fontSize: '0.8rem' }}>{errors.size}</span>}
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Description</label>
            <input
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors(ev => ({ ...ev, description: '' })) }}
              placeholder="Description"
              style={errors.description ? { borderColor: 'var(--error, #e53e3e)' } : {}}
            />
            {errors.description && <span style={{ color: 'var(--error, #e53e3e)', fontSize: '0.8rem' }}>{errors.description}</span>}
          </div>
        </div>
        <div className="form-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
        {status && <span className="status-msg">{status}</span>}
      </div>
    </div>
  )
}

export default function Groups() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const { userId } = useParams()
  const { state } = useLocation()
  const user = state?.user

  const [myGroups, setMyGroups] = useState([])
  const [otherGroups, setOtherGroups] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [joinStatus, setJoinStatus] = useState('')

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

  async function handleJoinGroup(groupId) {
    const res = await joinGroup(groupId, userId, auth.token)
    if (res.Status && res.Status > 200) {
      setJoinStatus(res.Message)
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="page-title">Groups</h2>
            <p className="page-subtitle">User: {user?.name}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowDialog(true)}>+ Create Group</button>
        </div>
      </div>

      {showDialog && (
        <CreateGroupDialog
          onClose={() => setShowDialog(false)}
          onCreated={fetchMyGroups}
        />
      )}

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
        {joinStatus && <span className="status-msg">{joinStatus}</span>}
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

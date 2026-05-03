import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getGroupEvents, createEvent, getVenues } from '../services/api'

function CreateEventDialog({ onClose, onCreated, venues, groupId, userId }) {
  const { auth } = useAuth()
  const [eventName, setEventName] = useState('')
  const [type, setType] = useState('')
  const [total, setTotal] = useState('')
  const [standby, setStandby] = useState('')
  const [venueId, setVenueId] = useState(venues[0]?.id ?? '')
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!eventName.trim()) errs.eventName = 'Event name is required'
    if (!type.trim()) errs.type = 'Type is required'
    if (!total.toString().trim()) {
      errs.total = 'Total spots is required'
    } else if (isNaN(total) || parseInt(total) <= 0) {
      errs.total = 'Total must be a positive number'
    }
    if (!standby.toString().trim()) {
      errs.standby = 'Standby spots is required'
    } else if (isNaN(standby) || parseInt(standby) < 0) {
      errs.standby = 'Standby must be a non-negative number'
    }
    return errs
  }

  async function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    await createEvent(
      { groupId, creatorId: userId, name: eventName, type, venueId, noOfParticipants: total, params: { total, standby } },
      auth.token
    )
    onCreated()
    onClose()
  }

  function clearError(field) {
    setErrors(ev => ({ ...ev, [field]: '' }))
  }

  const errorStyle = { borderColor: 'var(--error, #e53e3e)' }
  const errorText = { color: 'var(--error, #e53e3e)', fontSize: '0.8rem' }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <p className="modal-title">Create Event</p>
        <p className="modal-subtitle">Fill in the details to create a new event</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Event Name</label>
            <input
              value={eventName}
              onChange={e => { setEventName(e.target.value); clearError('eventName') }}
              placeholder="Event name"
              style={errors.eventName ? errorStyle : {}}
            />
            {errors.eventName && <span style={errorText}>{errors.eventName}</span>}
          </div>
          <div className="form-group">
            <label>Type</label>
            <input
              value={type}
              onChange={e => { setType(e.target.value); clearError('type') }}
              placeholder="Event type"
              style={errors.type ? errorStyle : {}}
            />
            {errors.type && <span style={errorText}>{errors.type}</span>}
          </div>
          <div className="form-group">
            <label>Total</label>
            <input
              value={total}
              onChange={e => { setTotal(e.target.value); clearError('total') }}
              placeholder="Total spots"
              type="number"
              min="1"
              style={errors.total ? errorStyle : {}}
            />
            {errors.total && <span style={errorText}>{errors.total}</span>}
          </div>
          <div className="form-group">
            <label>Standby</label>
            <input
              value={standby}
              onChange={e => { setStandby(e.target.value); clearError('standby') }}
              placeholder="Standby spots"
              type="number"
              min="0"
              style={errors.standby ? errorStyle : {}}
            />
            {errors.standby && <span style={errorText}>{errors.standby}</span>}
          </div>
          {venues.length > 0 && (
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Venue</label>
              <select value={venueId} onChange={e => setVenueId(e.target.value)}>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="form-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function Events() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const { userId, groupId } = useParams()
  const { state } = useLocation()
  const { user, group } = state || {}

  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    fetchEvents()
    fetchVenues()
  }, [])

  async function fetchEvents() {
    const res = await getGroupEvents(groupId, auth.token)
    if (Array.isArray(res)) setEvents(res)
  }

  async function fetchVenues() {
    const res = await getVenues(auth.token)
    if (Array.isArray(res) && res.length > 0) setVenues(res)
  }

  function goToDetails(event) {
    navigate(
      `/users/${userId}/groups/${groupId}/events/${event.eventId}/details`,
      { state: { user, group, event } }
    )
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="page-title">Events</h2>
            <p className="page-subtitle">Group: {group?.name} &mdash; User: {user?.name}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowDialog(true)}>+ Create Event</button>
        </div>
      </div>

      {showDialog && (
        <CreateEventDialog
          onClose={() => setShowDialog(false)}
          onCreated={fetchEvents}
          venues={venues}
          groupId={groupId}
          userId={userId}
        />
      )}

      <div className="card">
        <h3 className="section-title">Events</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Event ID</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.eventId} className="row-link" onClick={() => goToDetails(e)}>
                  <td>{e.name}</td>
                  <td>{e.type}</td>
                  <td>{e.eventId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

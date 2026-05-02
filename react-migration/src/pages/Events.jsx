import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getGroupEvents, createEvent, getVenues } from '../services/api'

export default function Events() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const { userId, groupId } = useParams()
  const { state } = useLocation()
  const { user, group } = state || {}

  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])
  const [eventName, setEventName] = useState('')
  const [type, setType] = useState('')
  const [total, setTotal] = useState('')
  const [standby, setStandby] = useState('')
  const [venueId, setVenueId] = useState('')
  const [status, setStatus] = useState('')

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
    if (res.venues && res.venues.length > 0) {
      setVenues(res.venues)
      setVenueId(res.venues[0].id)
    }
  }

  async function handleCreateEvent() {
    await createEvent(
      { groupId, creatorId: userId, name: eventName, type, venueId, noOfParticipants: total, params: { total, standby } },
      auth.token
    )
    setStatus('created successfully')
    setEventName('')
    setType('')
    setTotal('')
    setStandby('')
    fetchEvents()
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
        <h2 className="page-title">Events</h2>
        <p className="page-subtitle">Group: {group?.name} &mdash; User: {user?.name}</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Event Name</label>
            <input value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Event name" />
          </div>
          <div className="form-group">
            <label>Type</label>
            <input value={type} onChange={e => setType(e.target.value)} placeholder="Event type" />
          </div>
          <div className="form-group">
            <label>Total</label>
            <input value={total} onChange={e => setTotal(e.target.value)} placeholder="Total spots" />
          </div>
          <div className="form-group">
            <label>Standby</label>
            <input value={standby} onChange={e => setStandby(e.target.value)} placeholder="Standby spots" />
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
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleCreateEvent}>Create Event</button>
          {status && <span className="status-msg">{status}</span>}
        </div>
      </div>

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

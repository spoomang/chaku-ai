import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getForms, getForm, createForm, createTicket, getTickets, getTicket } from '../services/api'

const FIELD_TYPES = ['text', 'textarea', 'number', 'email', 'date', 'dropdown', 'radio', 'checkbox']
const OPTION_TYPES = new Set(['dropdown', 'radio', 'checkbox'])

const STATUS_COLORS = {
  open:        { bg: '#dbeafe', color: '#1d4ed8' },
  in_progress: { bg: '#fef3c7', color: '#b45309' },
  resolved:    { bg: '#d1fae5', color: '#065f46' },
  closed:      { bg: '#f1f5f9', color: '#64748b' },
}

function statusBadge(status) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.closed
  return (
    <span style={{ ...s, padding: '2px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600 }}>
      {status}
    </span>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

let _keySeq = 0
const nextKey = () => String(++_keySeq)

function newField(order) {
  return { _key: nextKey(), label: '', fieldKey: '', fieldType: 'text', placeholder: '', required: false, options: [], displayOrder: order }
}

function newOption(order) {
  return { _key: nextKey(), label: '', value: '', displayOrder: order }
}

// ─── Create Form Dialog ──────────────────────────────────────────────────────

function CreateFormDialog({ userId, token, onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState([])
  const [errors, setErrors] = useState({})

  function addField() {
    setFields(prev => [...prev, newField(prev.length)])
  }

  function removeField(key) {
    setFields(prev => prev.filter(f => f._key !== key))
  }

  function updateField(key, patch) {
    setFields(prev => prev.map(f => f._key === key ? { ...f, ...patch } : f))
  }

  function handleLabelChange(key, val) {
    setFields(prev => prev.map(f =>
      f._key === key ? { ...f, label: val, fieldKey: f.fieldKey || slugify(val) } : f
    ))
  }

  function addOption(fieldKey) {
    setFields(prev => prev.map(f =>
      f._key === fieldKey ? { ...f, options: [...f.options, newOption(f.options.length)] } : f
    ))
  }

  function removeOption(fieldKey, optKey) {
    setFields(prev => prev.map(f =>
      f._key === fieldKey ? { ...f, options: f.options.filter(o => o._key !== optKey) } : f
    ))
  }

  function updateOption(fieldKey, optKey, patch) {
    setFields(prev => prev.map(f =>
      f._key === fieldKey
        ? { ...f, options: f.options.map(o => o._key === optKey ? { ...o, ...patch } : o) }
        : f
    ))
  }

  async function handleSubmit() {
    if (!title.trim()) { setErrors({ title: 'Title is required' }); return }
    const payload = {
      userId,
      title,
      description,
      fields: fields.map((f, i) => ({
        label: f.label,
        fieldKey: f.fieldKey || slugify(f.label) || `field_${i}`,
        fieldType: f.fieldType,
        placeholder: f.placeholder,
        required: f.required,
        displayOrder: i,
        options: OPTION_TYPES.has(f.fieldType)
          ? f.options.map((o, j) => ({ label: o.label, value: o.value, displayOrder: j }))
          : [],
      })),
    }
    await createForm(payload, token)
    onCreated()
    onClose()
  }

  const errStyle = { borderColor: 'var(--red)' }
  const errText = { color: 'var(--red)', fontSize: '0.8rem' }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
        <p className="modal-title">Create Form</p>
        <p className="modal-subtitle">Define your form title, description and fields</p>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Title</label>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors({}) }}
            placeholder="Form title"
            style={errors.title ? errStyle : {}}
          />
          {errors.title && <span style={errText}>{errors.title}</span>}
        </div>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
        </div>

        <div style={{ fontWeight: 600, marginBottom: 10 }}>Fields</div>
        {fields.map(f => (
          <div key={f._key} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Label</label>
                <input value={f.label} onChange={e => handleLabelChange(f._key, e.target.value)} placeholder="Field label" />
              </div>
              <div className="form-group">
                <label>Key</label>
                <input value={f.fieldKey} onChange={e => updateField(f._key, { fieldKey: e.target.value })} placeholder="field_key" />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={f.fieldType} onChange={e => updateField(f._key, { fieldType: e.target.value })}>
                  {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Placeholder</label>
                <input value={f.placeholder} onChange={e => updateField(f._key, { placeholder: e.target.value })} placeholder="Placeholder text" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                <input type="checkbox" checked={f.required} onChange={e => updateField(f._key, { required: e.target.checked })} />
                Required
              </label>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', color: 'var(--red)' }} onClick={() => removeField(f._key)}>
                Remove field
              </button>
            </div>
            {OPTION_TYPES.has(f.fieldType) && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Options
                </div>
                {f.options.map(o => (
                  <div key={o._key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      value={o.label}
                      onChange={e => updateOption(f._key, o._key, { label: e.target.value })}
                      placeholder="Label"
                      style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.875rem' }}
                    />
                    <input
                      value={o.value}
                      onChange={e => updateOption(f._key, o._key, { value: e.target.value })}
                      placeholder="Value"
                      style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.875rem' }}
                    />
                    <button className="btn btn-ghost btn-sm" onClick={() => removeOption(f._key, o._key)}>×</button>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={() => addOption(f._key)}>+ Add option</button>
              </div>
            )}
          </div>
        ))}
        <button className="btn btn-ghost" onClick={addField} style={{ marginBottom: 20 }}>+ Add field</button>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>Create Form</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Submit Ticket Dialog ────────────────────────────────────────────────────

function SubmitTicketDialog({ formId, userId, token, onClose, onSubmitted }) {
  const [form, setForm] = useState(null)
  const [values, setValues] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    getForm(formId, token).then(f => {
      setForm(f)
      const init = {}
      ;(f.fields || []).forEach(field => {
        init[field.fieldKey] = field.fieldType === 'checkbox' ? [] : ''
      })
      setValues(init)
    })
  }, [formId, token])

  function setValue(key, val) {
    setValues(prev => ({ ...prev, [key]: val }))
  }

  function toggleCheckbox(key, val) {
    setValues(prev => {
      const arr = prev[key] || []
      return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  async function handleSubmit() {
    await createTicket({ formId, submittedBy: userId, data: values }, token)
    setSubmitted(true)
    onSubmitted()
  }

  if (!form) return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Loading form...</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card">
        <p className="modal-title">Ticket Submitted</p>
        <p className="modal-subtitle">Your response has been recorded successfully.</p>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <p className="modal-title">{form.title}</p>
        {form.description && <p className="modal-subtitle">{form.description}</p>}

        {(form.fields || []).map(field => (
          <div key={field.id} className="form-group" style={{ marginBottom: 16 }}>
            <label>
              {field.label}
              {field.required && <span style={{ color: 'var(--red)', marginLeft: 4 }}>*</span>}
            </label>
            {field.fieldType === 'textarea' && (
              <textarea
                value={values[field.fieldKey] || ''}
                onChange={e => setValue(field.fieldKey, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
              />
            )}
            {['text', 'email', 'number', 'date'].includes(field.fieldType) && (
              <input
                type={field.fieldType}
                value={values[field.fieldKey] || ''}
                onChange={e => setValue(field.fieldKey, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
            {field.fieldType === 'dropdown' && (
              <select value={values[field.fieldKey] || ''} onChange={e => setValue(field.fieldKey, e.target.value)}>
                <option value="">Select...</option>
                {(field.options || []).map(o => (
                  <option key={o.id} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
            {field.fieldType === 'radio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {(field.options || []).map(o => (
                  <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400, fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input type="radio" name={field.fieldKey} value={o.value}
                      checked={values[field.fieldKey] === o.value}
                      onChange={() => setValue(field.fieldKey, o.value)} />
                    {o.label}
                  </label>
                ))}
              </div>
            )}
            {field.fieldType === 'checkbox' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {(field.options || []).map(o => (
                  <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400, fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input type="checkbox" value={o.value}
                      checked={(values[field.fieldKey] || []).includes(o.value)}
                      onChange={() => toggleCheckbox(field.fieldKey, o.value)} />
                    {o.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>Submit Ticket</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Ticket Detail Dialog ────────────────────────────────────────────────────

function TicketDetailDialog({ ticketId, token, onClose }) {
  const [ticket, setTicket] = useState(null)
  const [form, setForm] = useState(null)

  useEffect(() => {
    getTicket(ticketId, token).then(t => {
      setTicket(t)
      if (t.formId) {
        getForm(t.formId, token).then(setForm).catch(() => {})
      }
    })
  }, [ticketId, token])

  if (!ticket) return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Loading ticket...</p>
      </div>
    </div>
  )

  const fieldLabels = {}
  ;(form?.fields || []).forEach(f => { fieldLabels[f.fieldKey] = f.label })

  const answers = ticket.data || {}

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <p className="modal-title">Ticket #{ticket.id}</p>
          {statusBadge(ticket.status)}
        </div>
        {form && <p className="modal-subtitle" style={{ marginBottom: 16 }}>{form.title}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', marginBottom: 20, fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--muted)' }}>Form ID</div>
          <div>{ticket.formId}</div>
          <div style={{ color: 'var(--muted)' }}>Submitted By</div>
          <div>{ticket.submittedBy ?? '—'}</div>
          <div style={{ color: 'var(--muted)' }}>Created</div>
          <div>{formatDate(ticket.createdAt)}</div>
          <div style={{ color: 'var(--muted)' }}>Updated</div>
          <div>{formatDate(ticket.updatedAt)}</div>
        </div>

        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.9rem' }}>Answers</div>
        {Object.keys(answers).length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>No answers recorded.</p>
        )}
        {Object.entries(answers).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
              {fieldLabels[key] || key}
            </div>
            <div style={{ fontSize: '0.9rem', padding: '6px 10px', background: 'var(--bg)', borderRadius: 6 }}>
              {Array.isArray(val) ? val.join(', ') || '—' : String(val) || '—'}
            </div>
          </div>
        ))}

        <div className="form-actions" style={{ marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ─── Forms Page ──────────────────────────────────────────────────────────────

export default function Forms() {
  const { auth } = useAuth()
  const { userId } = useParams()
  const { state } = useLocation()
  const user = state?.user

  const [forms, setForms] = useState([])
  const [tickets, setTickets] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState(null)
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  useEffect(() => {
    fetchForms()
    fetchTickets()
  }, [])

  async function fetchForms() {
    const res = await getForms(auth.token)
    if (Array.isArray(res)) setForms(res)
  }

  async function fetchTickets() {
    const res = await getTickets(auth.token)
    if (Array.isArray(res)) setTickets(res)
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="page-title">Forms</h2>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>User: {user?.name}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Create Form</button>
        </div>
      </div>

      {showCreate && (
        <CreateFormDialog
          userId={user?.id}
          token={auth.token}
          onClose={() => setShowCreate(false)}
          onCreated={fetchForms}
        />
      )}

      {selectedFormId !== null && (
        <SubmitTicketDialog
          formId={selectedFormId}
          userId={user?.id}
          token={auth.token}
          onClose={() => setSelectedFormId(null)}
          onSubmitted={fetchTickets}
        />
      )}

      {selectedTicketId !== null && (
        <TicketDetailDialog
          ticketId={selectedTicketId}
          token={auth.token}
          onClose={() => setSelectedTicketId(null)}
        />
      )}

      <div className="card">
        <h3 className="section-title">Available Forms</h3>
        {forms.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No forms yet. Create one to get started.</p>
        )}
        {forms.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {forms.map(f => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.title}</td>
                    <td style={{ color: 'var(--muted)' }}>{f.description || '—'}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedFormId(f.id)}>
                        Submit Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="section-title">Tickets</h3>
        {tickets.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No tickets submitted yet.</p>
        )}
        {tickets.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Form ID</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.formId}</td>
                    <td>{t.submittedBy ?? '—'}</td>
                    <td>{statusBadge(t.status)}</td>
                    <td style={{ color: 'var(--muted)' }}>{formatDate(t.createdAt)}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTicketId(t.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

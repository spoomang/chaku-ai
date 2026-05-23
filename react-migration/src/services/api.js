const BASE_URL = 'http://localhost:8080'

async function request(path, options = {}) {
  const { token, headers = {}, ...rest } = options
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(`${BASE_URL}${path}`, {
    mode: 'cors',
    headers: { 'Content-Type': 'application/json', ...authHeader, ...headers },
    ...rest,
  })
  const json = await res.json()
  return json.data !== undefined ? json.data : json
}

export function authenticate(userId, password) {
  return request('/user/authenticate', {
    method: 'POST',
    body: JSON.stringify({ userId, password, type: 'email' }),
  })
}

export function createUser(data) {
  return request('/user', { method: 'POST', body: JSON.stringify(data) })
}

export function getUsers(token) {
  return request('/users', { token })
}

export function getMyGroups(userId, token) {
  return request(`/member/group?memberId=${userId}`, { token })
}

export function getAllGroups(token) {
  return request('/groups', { token })
}

export function createGroup(data, token) {
  return request('/group', { method: 'POST', token, body: JSON.stringify(data) })
}

export function joinGroup(groupId, memberId, token) {
  return request('/group/members', {
    method: 'POST',
    token,
    body: JSON.stringify({ groupId, members: [{ memberId }] }),
  })
}

export function getGroupEvents(groupId, token) {
  return request(`/group/events?groupId=${groupId}`, { token })
}

export function createEvent(data, token) {
  return request('/events', { method: 'POST', token, body: JSON.stringify(data) })
}

export function getVenues(token) {
  return request('/venues', { method: 'POST', token, body: JSON.stringify({}) })
}

export function getEventMembers(eventId, token) {
  return request(`/events/members?eventId=${eventId}`, { token })
}

export function joinEvent(data, token) {
  return request('/events/members', { method: 'POST', token, body: JSON.stringify(data) })
}

export function getMessages(eventId, offset, token) {
  return request(`/groups/events/messages?eventId=${eventId}&offset=${offset}`, { token })
}

export function sendMessage(data, token) {
  return request('/groups/events/messages', { method: 'POST', token, body: JSON.stringify(data) })
}

export function getForms(token) {
  return request('/forms', { token })
}

export function getForm(id, token) {
  return request(`/forms/${id}`, { token })
}

export function createForm(data, token) {
  return request('/forms', { method: 'POST', token, body: JSON.stringify(data) })
}

export function createTicket(data, token) {
  return request('/tickets', { method: 'POST', token, body: JSON.stringify(data) })
}

export function getTickets(token) {
  return request('/tickets', { token })
}

export function getTicket(id, token) {
  return request(`/tickets/${id}`, { token })
}

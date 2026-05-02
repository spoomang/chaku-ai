const BASE_URL = 'http://localhost:8080'

async function request(path, options = {}) {
  const { headers = {}, ...rest } = options
  const res = await fetch(`${BASE_URL}${path}`, {
    mode: 'cors',
    headers: { 'Content-Type': 'application/json', ...headers },
    ...rest,
  })
  return res.json()
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
  return request('/users', { headers: { 'x-auth': token } })
}

export function getMyGroups(userId, token) {
  return request(`/member/group?memberId=${userId}`, { headers: { 'x-auth': token } })
}

export function getAllGroups(token) {
  return request('/groups', { headers: { 'x-auth': token } })
}

export function createGroup(data, token) {
  return request('/group', {
    method: 'POST',
    headers: { 'x-auth': token },
    body: JSON.stringify(data),
  })
}

export function joinGroup(groupId, memberId, token) {
  return request('/group/members', {
    method: 'POST',
    headers: { 'x-auth': token },
    body: JSON.stringify({ groupId, members: [{ memberId }] }),
  })
}

export function getGroupEvents(groupId, token) {
  return request(`/group/events?groupId=${groupId}`, { headers: { 'x-auth': token } })
}

export function createEvent(data, token) {
  return request('/events', {
    method: 'POST',
    headers: { 'x-auth': token },
    body: JSON.stringify(data),
  })
}

export function getVenues(token) {
  return request('/venues', {
    method: 'POST',
    headers: { 'x-auth': token },
    body: JSON.stringify({}),
  })
}

export function getEventMembers(eventId, token) {
  return request(`/events/members?eventId=${eventId}`, { headers: { 'x-auth': token } })
}

export function joinEvent(data, token) {
  return request('/events/members', {
    method: 'POST',
    headers: { 'x-auth': token },
    body: JSON.stringify(data),
  })
}

export function getMessages(eventId, offset, token) {
  return request(`/groups/events/messages?eventId=${eventId}&offset=${offset}`, {
    headers: { 'x-auth': token },
  })
}

export function sendMessage(data, token) {
  return request('/groups/events/messages', {
    method: 'POST',
    headers: { 'x-auth': token },
    body: JSON.stringify(data),
  })
}

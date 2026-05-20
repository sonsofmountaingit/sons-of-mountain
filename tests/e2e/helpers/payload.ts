const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL ?? 'admin@test.com'
const ADMIN_PASS = process.env.PAYLOAD_ADMIN_PASSWORD ?? 'admin'

let _token: string | null = null

async function getToken(): Promise<string> {
  if (_token) return _token
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  const data = await res.json()
  _token = data.token
  return _token!
}

export async function create(collection: string, data: Record<string, unknown>) {
  const token = await getToken()
  const res = await fetch(`${BASE}/api/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function remove(collection: string, id: string) {
  const token = await getToken()
  await fetch(`${BASE}/api/${collection}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${token}` },
  })
}

export async function findOne(collection: string, where: Record<string, unknown>) {
  const token = await getToken()
  const params = new URLSearchParams({ 'where[and][0][id][equals]': '' })
  const res = await fetch(`${BASE}/api/${collection}?limit=1&${new URLSearchParams({ where: JSON.stringify(where) })}`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json()
  return data.docs?.[0] ?? null
}

export async function getById(collection: string, id: string) {
  const token = await getToken()
  const res = await fetch(`${BASE}/api/${collection}/${id}`, {
    headers: { Authorization: `JWT ${token}` },
  })
  return res.json()
}

export async function update(collection: string, id: string, data: Record<string, unknown>) {
  const token = await getToken()
  const res = await fetch(`${BASE}/api/${collection}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

import crypto from 'node:crypto'

const SECRET = process.env.SESSION_SECRET || 'rw13-super-secret-key-change-in-production-2026'

export function hashPassword(password: string): string {
  const salt = 'rw13-salt'
  return crypto.createHash('sha256').update(password + ':' + salt).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export interface SessionPayload {
  id: string
  email: string
  role?: string
  exp: number
}

export function createSessionToken(user: { id: string; email: string; role?: string }): string {
  const payload: SessionPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 hari
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sigHex = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('hex')
  return `${payloadB64}.${sigHex}`
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadB64, sigHex] = token.split('.')
    if (!payloadB64 || !sigHex) return null

    const expectedSig = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('hex')
    if (expectedSig !== sigHex) return null

    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

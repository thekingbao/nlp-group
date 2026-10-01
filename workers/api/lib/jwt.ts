/**
 * JWT utilities — sign / verify using Web Crypto (native Workers API)
 * HS256 algorithm, no external library needed.
 */

export type JWTPayload = {
  sub:   string   // user id
  email: string
  role:  string
  iat:   number
  exp:   number
}

const ALG = { name: 'HMAC', hash: 'SHA-256' }

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function str2ab(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', str2ab(secret), ALG, false, ['sign', 'verify'])
}

export async function signToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInSeconds = 3600,   // 1 hour default
): Promise<string> {
  const header  = b64url(str2ab(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const body    = b64url(str2ab(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  })))
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign(ALG, key, str2ab(`${header}.${body}`))
  return `${header}.${body}.${b64url(sig)}`
}

export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, body, sigB64] = parts

    // Verify signature
    const key  = await importKey(secret)
    const sigBuf = Uint8Array.from(atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    const valid  = await crypto.subtle.verify(ALG, key, sigBuf, str2ab(`${header}.${body}`))
    if (!valid) return null

    // Decode payload
    const json = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/'))) as JWTPayload
    if (json.exp < Math.floor(Date.now() / 1000)) return null  // expired

    return json
  } catch {
    return null
  }
}

export async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', str2ab(token))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

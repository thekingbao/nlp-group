/**
 * bcrypt-compatible password hashing using Web Crypto (PBKDF2)
 * Cloudflare Workers does not support bcrypt natively —
 * we use PBKDF2-SHA256 with 210,000 iterations (OWASP recommendation).
 *
 * Format: `pbkdf2$<iterations>$<salt_hex>$<hash_hex>`
 */

const ITERATIONS = 210_000
const KEY_LEN    = 32   // 256 bits

function buf2hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function hex2buf(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  return arr
}

export async function hashPassword(password: string): Promise<string> {
  const salt    = crypto.getRandomValues(new Uint8Array(16))
  const keyMat  = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMat, KEY_LEN * 8,
  )
  return `pbkdf2$${ITERATIONS}$${buf2hex(salt.buffer)}$${buf2hex(derived)}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false
  const [, iterStr, saltHex, hashHex] = parts
  const salt    = hex2buf(saltHex)
  const keyMat  = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: Number(iterStr), hash: 'SHA-256' },
    keyMat, KEY_LEN * 8,
  )
  // Constant-time comparison
  const a = new Uint8Array(derived)
  const b = hex2buf(hashHex)
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

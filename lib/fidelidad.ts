import { randomBytes } from 'crypto'

// Sin caracteres ambiguos (0/O, 1/I/L) para que sea legible si hay que
// introducirlo a mano como respaldo del escaneo QR.
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generarCodigoTarjeta(): string {
  const bytes = randomBytes(6)
  let out = ''
  for (let i = 0; i < bytes.length; i++) out += ALFABETO[bytes[i] % ALFABETO.length]
  return out
}

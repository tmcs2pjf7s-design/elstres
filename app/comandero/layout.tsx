import type { Metadata } from 'next'

// Hace instalable el comandero como app (PWA) en los móviles del personal.
// Solo afecta a /comandero: la carta del cliente no lleva manifest.
export const metadata: Metadata = {
  title: 'Comandero · Els Tr3s',
  manifest: '/pwa/comandero.webmanifest',
  appleWebApp: { capable: true, title: 'Comandero', statusBarStyle: 'default' },
  icons: { apple: '/pwa/apple-touch-icon.png' },
}

export default function ComanderoLayout({ children }: { children: React.ReactNode }) {
  return children
}

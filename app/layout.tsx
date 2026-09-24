import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Frankfurt Els Tr3s · Terrassa',
  description: 'Frankfurts, bocadillos y hamburguesas al momento. Tapas, torradas y postres en Terrassa. Pide desde tu mesa o para llevar.',
  keywords: 'frankfurt, bocadillos, hamburguesas, tapas, terrassa, para llevar',
  openGraph: {
    title: 'Frankfurt Els Tr3s · Terrassa',
    description: 'Frankfurts, bocadillos y hamburguesas al momento en Terrassa.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Frankfurt Els Tr3s',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e85d04',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter, Baloo_2 } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'

const inter = Inter({ subsets: ['latin'] })
const baloo = Baloo_2({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-baloo' })

export const metadata: Metadata = {
  title: 'Frankfurt Els Tr3s · Terrassa',
  description: 'Frankfurts, bocadillos y tapas al momento. Torradas y postres en Terrassa. Pide desde tu mesa o para llevar.',
  keywords: 'frankfurt, bocadillos, hamburguesas, tapas, terrassa, para llevar',
  openGraph: {
    title: 'Frankfurt Els Tr3s · Terrassa',
    description: 'Frankfurts, bocadillos y tapas al momento en Terrassa.',
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
      <body className={`${inter.className} ${baloo.variable} bg-gray-50 text-gray-900 antialiased`}>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight">Frankfurt Els Tr3s</span>
          <div className="flex items-center gap-1">
            <Link href="/menu" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              Menú
            </Link>
            <Link href="/llevar" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors hidden sm:block">
              Para llevar
            </Link>
            <Link href="/admin/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-700 transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-14 min-h-screen flex items-center relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/70 via-white to-white" />
        <div className="relative max-w-6xl mx-auto px-5 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          <div>
            <p className="text-accent text-xs sm:text-sm font-bold tracking-widest uppercase mb-3">
              Bienvenidos
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-5 leading-[1.05]">
              Frankfurt<br />
              <span className="text-accent">Els Tr3s.</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-500 mb-2 max-w-md leading-relaxed">
              Frankfurts, bocadillos y hamburguesas al momento.
            </p>
            <p className="text-sm sm:text-base text-gray-400 mb-8 max-w-md leading-relaxed">
              Disfruta de nuestras tapas, torradas y una selección de los mejores postres de Terrassa.
              Pide desde tu mesa o llévate tu pedido.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/llevar"
                className="bg-accent text-white px-7 py-4 rounded-2xl font-bold text-base hover:bg-accent-dark transition-colors shadow-lg shadow-orange-200 text-center active:scale-95"
              >
                🛵 Pedir para llevar
              </Link>
              <Link
                href="/menu"
                className="bg-gray-100 text-gray-900 px-7 py-4 rounded-2xl font-bold text-base hover:bg-gray-200 transition-colors text-center active:scale-95"
              >
                Ver menú
              </Link>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=300&q=80',
              'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&q=80',
              'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=300&q=80',
              'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80',
            ].map((src, i) => (
              <img key={i} src={src} alt="" className={`rounded-2xl object-cover w-full h-48 shadow-md ${i === 1 ? 'mt-8' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-3">Una nueva forma de pedir</h2>
          <p className="text-gray-500 text-center mb-10 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            Sin esperas, sin confusiones. Tecnología al servicio de la buena mesa.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '📱', title: 'Escanea el QR', desc: 'Escanea el QR de tu mesa, elige lo que quieres y pide directamente desde tu móvil.' },
              { icon: '⚡', title: 'Tiempo real', desc: 'La cocina recibe tu pedido al instante. Sigue su estado en vivo desde tu pantalla.' },
              { icon: '🛵', title: 'Para llevar', desc: 'Haz tu pedido online antes de llegar. Estará listo cuando aparezcas.' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-base sm:text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <section className="py-10 bg-accent sm:hidden">
        <div className="px-5 text-center">
          <p className="text-white/80 text-sm font-medium mb-3">¿Listo para pedir?</p>
          <Link href="/llevar"
            className="inline-block bg-white text-accent px-8 py-4 rounded-2xl font-black text-base w-full active:scale-95 transition-transform">
            🛵 Pedir para llevar
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 py-10 text-gray-500 text-sm">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Marca */}
            <div>
              <p className="text-white font-black text-lg mb-2">Frankfurt Els Tr3s</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Frankfurts, bocadillos y hamburguesas al momento.<br />
                Tapas, torradas y postres de Terrassa.
              </p>
              <a href="tel:930042165" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors">
                <span>📞</span> 930 042 165
              </a>
            </div>
            {/* Dirección */}
            <div>
              <p className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Dónde estamos</p>
              <address className="not-italic text-gray-400 text-xs leading-relaxed">
                Passeig de Lluís Muncunill, 9, local 6<br />
                08225 Terrassa, Barcelona
              </address>
              <a
                href="https://maps.google.com/?q=Passeig+de+Lluís+Muncunill+9+Terrassa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-accent hover:underline"
              >
                Ver en Google Maps →
              </a>
            </div>
            {/* Legal */}
            <div>
              <p className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Legal</p>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/privacidad" className="text-gray-400 text-xs hover:text-white transition-colors">
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 text-xs hover:text-white transition-colors">
                    Política de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-600 text-xs space-y-2">
            <p>© 2026 Frankfurt Els Tr3s · Passeig de Lluís Muncunill, 9, local 6 · 08225 Terrassa · Todos los derechos reservados</p>
            <p>
              Web creada por{' '}
              <span className="text-gray-400 font-semibold">RushSystems</span>
              {' · '}Patrocinado por{' '}
              <a
                href="https://nomecreo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 font-semibold hover:text-white transition-colors"
              >
                nomecreo.com
              </a>
              {' '}— Servicios TI y Ciberseguridad para empresas
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

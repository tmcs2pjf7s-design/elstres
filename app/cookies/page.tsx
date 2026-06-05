import Link from 'next/link'

export const metadata = {
  title: 'Política de Cookies · Frankfurt Els Tr3s',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-3">
          <Link href="/" className="text-gray-400 text-sm font-medium hover:text-gray-700">← Inicio</Link>
          <span className="font-black text-lg">Frankfurt Els Tr3s</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-black mb-2">Política de Cookies</h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: junio de 2026</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que un sitio web almacena en tu navegador o dispositivo. Permiten que el sitio recuerde tus preferencias y mejoran tu experiencia de uso.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Cookies que utilizamos</h2>
            <p className="mb-4">Esta web utiliza únicamente <strong>cookies técnicas estrictamente necesarias</strong> para su funcionamiento. No usamos cookies de publicidad ni de rastreo de terceros.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 border border-gray-100 font-semibold text-gray-600">Nombre</th>
                    <th className="text-left p-3 border border-gray-100 font-semibold text-gray-600">Tipo</th>
                    <th className="text-left p-3 border border-gray-100 font-semibold text-gray-600">Finalidad</th>
                    <th className="text-left p-3 border border-gray-100 font-semibold text-gray-600">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-100 font-mono">clienteSession</td>
                    <td className="p-3 border border-gray-100">Local Storage</td>
                    <td className="p-3 border border-gray-100">Mantiene la sesión del cliente para agilizar futuros pedidos</td>
                    <td className="p-3 border border-gray-100">Sesión / hasta cierre manual</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border border-gray-100 font-mono">adminSession</td>
                    <td className="p-3 border border-gray-100">Local Storage</td>
                    <td className="p-3 border border-gray-100">Mantiene la sesión del administrador del local</td>
                    <td className="p-3 border border-gray-100">Sesión / hasta cierre manual</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-100 font-mono">__next_*</td>
                    <td className="p-3 border border-gray-100">Cookie técnica</td>
                    <td className="p-3 border border-gray-100">Necesaria para el funcionamiento del framework Next.js</td>
                    <td className="p-3 border border-gray-100">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Base jurídica</h2>
            <p>Las cookies técnicas están exentas del requisito de consentimiento según el artículo 22.2 de la LSSI-CE, ya que son estrictamente necesarias para la prestación del servicio solicitado.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">¿Cómo gestionar o eliminar las cookies?</h2>
            <p className="mb-3">Puedes borrar los datos almacenados en tu navegador en cualquier momento desde los ajustes:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Borrar datos de navegación</li>
              <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web</li>
              <li><strong>Firefox:</strong> Configuración → Privacidad y seguridad → Cookies y datos del sitio</li>
            </ul>
            <p className="mt-3 text-gray-500">Ten en cuenta que eliminar estos datos puede implicar tener que volver a iniciar sesión.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Cookies de terceros</h2>
            <p>No instalamos ninguna cookie de análisis, publicidad o redes sociales de terceros. Las imágenes del menú pueden cargarse desde <strong>Unsplash</strong> (solo en la página de inicio), que tiene su propia política de privacidad.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Contacto</h2>
            <p>
              Para cualquier consulta sobre esta política:<br />
              <strong>Frankfurt Els Tr3s</strong> · Passeig de Lluís Muncunill, 9, local 6, 08225 Terrassa<br />
              <a href="mailto:elstresmuncunil@gmail.com" className="text-accent hover:underline">elstresmuncunil@gmail.com</a>
            </p>
          </section>

        </div>
      </main>

      <footer className="py-6 text-center text-gray-400 text-xs">
        <Link href="/privacidad" className="hover:text-gray-600">Política de Privacidad</Link>
        {' · '}
        <Link href="/" className="hover:text-gray-600">Frankfurt Els Tr3s</Link>
      </footer>
    </div>
  )
}

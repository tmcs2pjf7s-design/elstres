import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad · Frankfurt Els Tr3s',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-3">
          <Link href="/" className="text-gray-400 text-sm font-medium hover:text-gray-700">← Inicio</Link>
          <span className="font-black text-lg">Frankfurt Els Tr3s</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-black mb-2">Política de Privacidad</h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: junio de 2026</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. Responsable del tratamiento</h2>
            <p>
              <strong>Frankfurt Els Tr3s</strong><br />
              Passeig de Lluís Muncunill, 9, local 6<br />
              08225 Terrassa, Barcelona<br />
              Contacto: <a href="mailto:elstresmuncunil@gmail.com" className="text-accent hover:underline">elstresmuncunil@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. Datos que recogemos</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>Datos de cuenta:</strong> nombre, dirección de correo electrónico y contraseña (almacenada de forma cifrada) cuando te registras.</li>
              <li><strong>Datos de contacto:</strong> número de teléfono, facilitado voluntariamente para avisar cuando tu pedido esté listo.</li>
              <li><strong>Datos del pedido:</strong> productos solicitados, mesa o modalidad de recogida, importe total y notas del pedido.</li>
              <li><strong>Datos técnicos:</strong> dirección IP y datos de navegación necesarios para el correcto funcionamiento del servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. Finalidad y base jurídica</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Gestión de pedidos</p>
                <p className="text-gray-500">Tramitar, preparar y servir los pedidos realizados a través de la plataforma. Base jurídica: ejecución de un contrato (art. 6.1.b RGPD).</p>
              </div>
              <div>
                <p className="font-semibold">Cuenta de usuario</p>
                <p className="text-gray-500">Permitirte acceder a tu historial de pedidos y agilizar futuras compras. Base jurídica: consentimiento (art. 6.1.a RGPD).</p>
              </div>
              <div>
                <p className="font-semibold">Comunicaciones operativas</p>
                <p className="text-gray-500">Informarte del estado de tu pedido. Base jurídica: ejecución de un contrato.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. Conservación de los datos</h2>
            <p>Los datos de pedido se conservan durante <strong>5 años</strong> a efectos contables y fiscales conforme a la legislación española. Los datos de cuenta se conservan mientras la cuenta esté activa; tras su eliminación, se borran en un plazo máximo de 30 días salvo obligación legal.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. Tus derechos</h2>
            <p className="mb-3">De acuerdo con el RGPD y la LOPDGDD, tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti.</li>
              <li><strong>Rectificación:</strong> corregir datos incorrectos o incompletos.</li>
              <li><strong>Supresión:</strong> solicitar el borrado de tus datos ("derecho al olvido").</li>
              <li><strong>Limitación:</strong> solicitar que se restrinja el tratamiento.</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos.</li>
            </ul>
            <p className="mt-3">Para ejercer estos derechos, escríbenos a <a href="mailto:elstresmuncunil@gmail.com" className="text-accent hover:underline">elstresmuncunil@gmail.com</a>. También puedes reclamar ante la <strong>Agencia Española de Protección de Datos</strong> (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">aepd.es</a>).</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">6. Seguridad</h2>
            <p>Las contraseñas se almacenan cifradas mediante PBKDF2-SHA512. Aplicamos medidas técnicas y organizativas para proteger los datos frente a accesos no autorizados, pérdida o destrucción.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">7. Comunicación a terceros</h2>
            <p>No cedemos tus datos personales a terceros salvo obligación legal. Los datos se alojan en servidores dentro de la Unión Europea.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">8. Modificaciones</h2>
            <p>Podemos actualizar esta política en cualquier momento. Los cambios relevantes se notificarán a través de la plataforma. La fecha de "última actualización" refleja siempre la versión vigente.</p>
          </section>

        </div>
      </main>

      <footer className="py-6 text-center text-gray-400 text-xs">
        <Link href="/cookies" className="hover:text-gray-600">Política de Cookies</Link>
        {' · '}
        <Link href="/" className="hover:text-gray-600">Frankfurt Els Tr3s</Link>
      </footer>
    </div>
  )
}

'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function PrivacidadContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-ink font-sans">
      <header className="bg-surface border-b border-line">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-3">
          <Link href="/" className="text-sand text-sm font-medium hover:text-parchment">{t('legal.backHome')}</Link>
          <span className="font-display uppercase font-normal text-lg text-parchment">Frankfurt Els Tr3s</span>
          <LanguageSwitcher className="ml-auto" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-black mb-2 text-parchment">{t('privacidad.title')}</h1>
        <p className="text-sand/70 text-sm mb-8">{t('legal.lastUpdated')}</p>

        <div className="bg-surface rounded-2xl border border-line p-8 space-y-8 text-sm leading-relaxed text-sand">

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('privacidad.s1.title')}</h2>
            <p>
              <strong>Frankfurt Els Tr3s</strong><br />
              Passeig de Lluís Muncunill, 9, local 6<br />
              08225 Terrassa, Barcelona<br />
              {t('privacidad.s1.contact')} <a href="mailto:elstresmuncunil@gmail.com" className="text-amber hover:underline">elstresmuncunil@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('privacidad.s2.title')}</h2>
            <ul className="list-disc list-inside space-y-1 text-sand">
              <li><strong>{t('privacidad.s2.account.label')}</strong> {t('privacidad.s2.account.desc')}</li>
              <li><strong>{t('privacidad.s2.contact.label')}</strong> {t('privacidad.s2.contact.desc')}</li>
              <li><strong>{t('privacidad.s2.order.label')}</strong> {t('privacidad.s2.order.desc')}</li>
              <li><strong>{t('privacidad.s2.tech.label')}</strong> {t('privacidad.s2.tech.desc')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('privacidad.s3.title')}</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">{t('privacidad.s3.orders.label')}</p>
                <p className="text-sand">{t('privacidad.s3.orders.desc')}</p>
              </div>
              <div>
                <p className="font-semibold">{t('privacidad.s3.account.label')}</p>
                <p className="text-sand">{t('privacidad.s3.account.desc')}</p>
              </div>
              <div>
                <p className="font-semibold">{t('privacidad.s3.comms.label')}</p>
                <p className="text-sand">{t('privacidad.s3.comms.desc')}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('privacidad.s4.title')}</h2>
            <p>{t('privacidad.s4.pre')} <strong>{t('privacidad.s4.bold')}</strong> {t('privacidad.s4.post')}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('privacidad.s5.title')}</h2>
            <p className="mb-3">{t('privacidad.s5.intro')}</p>
            <ul className="list-disc list-inside space-y-1 text-sand">
              <li><strong>{t('privacidad.s5.access.label')}</strong> {t('privacidad.s5.access.desc')}</li>
              <li><strong>{t('privacidad.s5.rectification.label')}</strong> {t('privacidad.s5.rectification.desc')}</li>
              <li><strong>{t('privacidad.s5.deletion.label')}</strong> {t('privacidad.s5.deletion.desc')}</li>
              <li><strong>{t('privacidad.s5.limitation.label')}</strong> {t('privacidad.s5.limitation.desc')}</li>
              <li><strong>{t('privacidad.s5.portability.label')}</strong> {t('privacidad.s5.portability.desc')}</li>
              <li><strong>{t('privacidad.s5.objection.label')}</strong> {t('privacidad.s5.objection.desc')}</li>
            </ul>
            <p className="mt-3">
              {t('privacidad.s5.outro.pre')} <a href="mailto:elstresmuncunil@gmail.com" className="text-amber hover:underline">elstresmuncunil@gmail.com</a>{t('privacidad.s5.outro.mid')} <strong>{t('privacidad.s5.outro.bold')}</strong> (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">aepd.es</a>){t('privacidad.s5.outro.post')}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('privacidad.s6.title')}</h2>
            <p>{t('privacidad.s6.body')}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('privacidad.s7.title')}</h2>
            <p>{t('privacidad.s7.body')}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('privacidad.s8.title')}</h2>
            <p>{t('privacidad.s8.body')}</p>
          </section>

        </div>
      </main>

      <footer className="py-6 text-center text-sand/70 text-xs">
        <Link href="/cookies" className="hover:text-sand">{t('privacidad.footerLink')}</Link>
        {' · '}
        <Link href="/" className="hover:text-sand">Frankfurt Els Tr3s</Link>
      </footer>
    </div>
  )
}

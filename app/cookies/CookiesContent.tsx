'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function CookiesContent() {
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
        <h1 className="text-3xl font-black mb-2 text-parchment">{t('cookies.title')}</h1>
        <p className="text-sand/70 text-sm mb-8">{t('legal.lastUpdated')}</p>

        <div className="bg-surface rounded-2xl border border-line p-8 space-y-8 text-sm leading-relaxed text-sand">

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('cookies.s1.title')}</h2>
            <p>{t('cookies.s1.body')}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('cookies.s2.title')}</h2>
            <p className="mb-4">{t('cookies.s2.pre')} <strong>{t('cookies.s2.bold')}</strong> {t('cookies.s2.post')}</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-ink">
                    <th className="text-left p-3 border border-line font-semibold text-sand">{t('cookies.table.name')}</th>
                    <th className="text-left p-3 border border-line font-semibold text-sand">{t('cookies.table.type')}</th>
                    <th className="text-left p-3 border border-line font-semibold text-sand">{t('cookies.table.purpose')}</th>
                    <th className="text-left p-3 border border-line font-semibold text-sand">{t('cookies.table.duration')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-line font-mono">clienteSession</td>
                    <td className="p-3 border border-line">{t('cookies.table.localStorage')}</td>
                    <td className="p-3 border border-line">{t('cookies.table.clienteSessionPurpose')}</td>
                    <td className="p-3 border border-line">{t('cookies.table.sessionUntilClose')}</td>
                  </tr>
                  <tr className="bg-ink">
                    <td className="p-3 border border-line font-mono">adminSession</td>
                    <td className="p-3 border border-line">{t('cookies.table.localStorage')}</td>
                    <td className="p-3 border border-line">{t('cookies.table.adminSessionPurpose')}</td>
                    <td className="p-3 border border-line">{t('cookies.table.sessionUntilClose')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-line font-mono">__next_*</td>
                    <td className="p-3 border border-line">{t('cookies.table.technicalCookie')}</td>
                    <td className="p-3 border border-line">{t('cookies.table.nextPurpose')}</td>
                    <td className="p-3 border border-line">{t('cookies.table.session')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('cookies.s3.title')}</h2>
            <p>{t('cookies.s3.body')}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('cookies.s4.title')}</h2>
            <p className="mb-3">{t('cookies.s4.intro')}</p>
            <ul className="list-disc list-inside space-y-1 text-sand">
              <li><strong>Chrome:</strong> {t('cookies.s4.chromeDesc')}</li>
              <li><strong>Safari:</strong> {t('cookies.s4.safariDesc')}</li>
              <li><strong>Firefox:</strong> {t('cookies.s4.firefoxDesc')}</li>
            </ul>
            <p className="mt-3 text-sand">{t('cookies.s4.note')}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('cookies.s5.title')}</h2>
            <p>{t('cookies.s5.pre')} <strong>{t('cookies.s5.bold')}</strong> {t('cookies.s5.post')}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-parchment mb-3">{t('cookies.s6.title')}</h2>
            <p>
              {t('cookies.s6.intro')}<br />
              <strong>Frankfurt Els Tr3s</strong> · Passeig de Lluís Muncunill, 9, local 6, 08225 Terrassa<br />
              <a href="mailto:elstresmuncunil@gmail.com" className="text-amber hover:underline">elstresmuncunil@gmail.com</a>
            </p>
          </section>

        </div>
      </main>

      <footer className="py-6 text-center text-sand/70 text-xs">
        <Link href="/privacidad" className="hover:text-sand">{t('cookies.footerLink')}</Link>
        {' · '}
        <Link href="/" className="hover:text-sand">Frankfurt Els Tr3s</Link>
      </footer>
    </div>
  )
}

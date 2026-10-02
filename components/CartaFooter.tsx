'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function CartaFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-line mt-8 pt-6 text-sand text-xs">
      {/* Dirección */}
      <div>
        <p className="text-parchment font-semibold uppercase tracking-wider mb-2">{t('home.footer.whereTitle')}</p>
        <a href="tel:930042165" className="block mb-2 text-amber font-semibold">📞 930 042 165</a>
        <address className="not-italic leading-relaxed">
          Passeig de Lluís Muncunill, 9, local 6<br />
          08225 Terrassa, Barcelona
        </address>
        <p className="text-sand/70 text-[11px] mt-1">{t('menu.openLabel')} · {t('menu.hours')}</p>
        <a
          href="https://maps.google.com/?q=Passeig+de+Lluís+Muncunill+9+Terrassa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-amber hover:underline"
        >
          {t('home.footer.mapsLink')}
        </a>

        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-parchment/90 font-semibold mb-1 flex items-center gap-1.5">
            {t('home.footer.location2Name')}
            <span className="bg-amber/15 text-amber text-[10px] font-semibold px-1.5 py-0.5 rounded-full normal-case tracking-normal">
              {t('home.footer.comingSoon')}
            </span>
          </p>
          <address className="not-italic leading-relaxed">
            Parc de les Nacions Unides, 18, local<br />
            08225 Terrassa, Barcelona
          </address>
          <p className="text-sand/70 text-[11px] mt-1">{t('menu.plannedHoursLabel')} · {t('menu.hours')}</p>
          <a
            href="https://maps.google.com/?q=Parc+de+les+Nacions+Unides+18+Terrassa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-amber hover:underline"
          >
            {t('home.footer.mapsLink')}
          </a>
        </div>
      </div>

      {/* Legal */}
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-line">
        <Link href="/privacidad" className="hover:text-parchment transition-colors">{t('home.footer.privacy')}</Link>
        <span className="text-line">·</span>
        <Link href="/cookies" className="hover:text-parchment transition-colors">{t('home.footer.cookies')}</Link>
      </div>

      {/* Créditos + acceso de personal */}
      <div className="mt-5 pt-5 border-t border-line text-center space-y-2">
        <p>
          {t('home.footer.madeBy')}{' '}
          <a
            href="https://rushsystems.es"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-parchment transition-colors"
          >
            RushSystems
          </a>
          {' · '}{t('home.footer.sponsorDesc')}{', '}{t('home.footer.sponsoredBy')}{' '}
          <a
            href="https://nomecreo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-parchment transition-colors"
          >
            nomecreo.com
          </a>
        </p>
        <p>
          <Link href="/admin/login" className="text-sand/70 hover:text-parchment transition-colors">
            {t('home.footer.adminLink')}
          </Link>
        </p>
      </div>
    </footer>
  )
}

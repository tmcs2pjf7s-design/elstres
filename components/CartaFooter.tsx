'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function CartaFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-line mt-8 pt-5 text-center text-sand text-xs space-y-2">
      <p>
        <Link href="/privacidad" className="hover:text-parchment transition-colors">{t('home.footer.privacy')}</Link>
        {' · '}
        <Link href="/cookies" className="hover:text-parchment transition-colors">{t('home.footer.cookies')}</Link>
      </p>
      <p>
        {t('home.footer.madeBy')}{' '}
        <a
          href="https://rushsystems.es"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sand font-semibold hover:text-parchment transition-colors"
        >
          RushSystems
        </a>
        {' · '}{t('home.footer.sponsorDesc')}{', '}{t('home.footer.sponsoredBy')}{' '}
        <a
          href="https://nomecreo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sand font-semibold hover:text-parchment transition-colors"
        >
          nomecreo.com
        </a>
      </p>
    </footer>
  )
}

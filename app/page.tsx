'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const HERO_IMAGES = [
  { src: '/hero/hero-bocadillo.jpg', alt: 'Bocadillo de calamares con mayonesa' },
  { src: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400&q=80', alt: 'Tarta de queso' },
  { src: '/hero/hero-tinto-verano.jpg', alt: 'Tinto de verano' },
  { src: '/hero/hero-patatas-bravas.jpg', alt: 'Patatas bravas' },
]

export default function Home() {
  const { t } = useLanguage()

  const FEATURES = [
    { icon: '📱', title: t('home.features.qr.title'), desc: t('home.features.qr.desc') },
    { icon: '⚡', title: t('home.features.realtime.title'), desc: t('home.features.realtime.desc') },
    { icon: '🛵', title: t('home.features.llevar.title'), desc: t('home.features.llevar.desc') },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-ink font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-ink/95 backdrop-blur-md border-b border-line z-40">
        <div className="max-w-6xl mx-auto px-4 min-h-14 py-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
          <span className="font-bold text-sm sm:text-xl text-parchment tracking-tight truncate">Frankfurt Els Tr3s</span>
          <div className="flex flex-wrap items-center justify-end gap-0.5 sm:gap-2">
            <LanguageSwitcher />
            <Link
              href="/menu"
              className="text-xs sm:text-sm text-sand hover:text-parchment font-medium px-1.5 sm:px-3 py-2 rounded-xl hover:bg-surface transition-colors"
            >
              {t('home.nav.menu')}
            </Link>
            <Link
              href="/sorteos"
              className="text-xs sm:text-sm text-sand hover:text-parchment font-medium px-1.5 sm:px-3 py-2 rounded-xl hover:bg-surface transition-colors"
            >
              {t('home.nav.sorteos')}
            </Link>
            <Link
              href="/promociones"
              className="text-xs sm:text-sm text-sand hover:text-parchment font-medium px-1.5 sm:px-3 py-2 rounded-xl hover:bg-surface transition-colors"
            >
              {t('home.nav.promociones')}
            </Link>
            <span
              className="hidden sm:inline-block text-sm bg-surface border border-line text-sand px-4 py-2 rounded-xl font-semibold cursor-not-allowed select-none"
              title={t('home.llevarBadge')}
            >
              {t('home.llevarBadge')}
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-14 lg:min-h-screen flex items-center relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-gradient-to-br from-surface/40 via-ink to-ink" />
        <div className="relative max-w-6xl mx-auto px-5 py-10 sm:py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          <div>
            <p className="text-amber text-xs sm:text-sm font-bold tracking-widest uppercase mb-3">
              {t('home.hero.badge')}
            </p>
            <h1 className="font-display uppercase font-normal text-4xl sm:text-5xl lg:text-6xl tracking-tight text-parchment mb-5 leading-[1.05]">
              Frankfurt<br />
              <span className="text-amber">Els Tr3s.</span>
            </h1>
            <p className="text-base sm:text-xl text-sand mb-2 max-w-md leading-relaxed">
              {t('home.hero.subtitle1')}
            </p>
            <p className="text-sm sm:text-base text-sand/70 mb-8 max-w-md leading-relaxed">
              {t('home.hero.subtitle2')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <span
                className="bg-surface border border-line text-sand px-7 py-4 rounded-2xl font-bold text-base text-center cursor-not-allowed select-none"
                title={t('home.llevarBadge')}
              >
                {t('home.llevarBadge')}
              </span>
              <Link
                href="/menu"
                className="bg-amber text-amber-ink px-7 py-4 rounded-2xl font-bold text-base hover:bg-amber-dark transition-colors text-center active:scale-95"
              >
                {t('home.hero.ctaMenu')}
              </Link>
            </div>
          </div>

          <img
            src={HERO_IMAGES[0].src}
            alt={HERO_IMAGES[0].alt}
            className="lg:hidden rounded-2xl object-cover w-full h-48 shadow-md border border-line"
          />

          <div className="hidden lg:grid grid-cols-2 gap-4">
            {HERO_IMAGES.map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className={`rounded-2xl object-cover w-full h-48 shadow-md border border-line${i === 1 ? ' mt-8' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-display uppercase font-normal text-2xl sm:text-3xl text-parchment text-center mb-3">{t('home.features.title')}</h2>
          <p className="text-sand text-center mb-10 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            {t('home.features.subtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="bg-ink rounded-3xl p-6 sm:p-8 border border-line hover:border-amber/40 transition-colors"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-base sm:text-lg font-bold mb-2 text-parchment">{f.title}</h3>
                <p className="text-sand text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cervecería — sección ambiental de escritorio */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <img
          src="/hero/bg-tirador.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/70 to-ink/20" />
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <p className="text-amber text-xs sm:text-sm font-bold tracking-widest uppercase mb-3">
            {t('home.cerveceria.badge')}
          </p>
          <h2 className="font-display uppercase font-normal text-3xl sm:text-4xl text-parchment mb-4">
            {t('home.cerveceria.title')}
          </h2>
          <p className="text-sand text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t('home.cerveceria.desc')}
          </p>
        </div>
      </section>

      {/* Mobile CTA */}
      <section className="relative py-16 sm:hidden overflow-hidden">
        <img
          src="/hero/bg-cerveza.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/10" />
        <div className="relative px-5 text-center">
          <p className="text-parchment/90 text-sm font-medium mb-3">{t('home.mobileCta.question')}</p>
          <span
            className="inline-block bg-surface/90 border border-line text-sand px-8 py-4 rounded-2xl font-black text-base w-full cursor-not-allowed select-none backdrop-blur-sm"
            title={t('home.llevarBadge')}
          >
            {t('home.llevarBadge')}
          </span>
        </div>
      </section>

      <footer className="bg-surface py-10 text-sand text-sm border-t border-line">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Marca */}
            <div>
              <p className="font-display uppercase font-normal text-parchment text-lg mb-2">Frankfurt Els Tr3s</p>
              <p className="text-sand text-xs leading-relaxed mb-3">
                {t('home.footer.tagline1')}<br />
                {t('home.footer.tagline2')}
              </p>
              <a
                href="tel:930042165"
                className="inline-flex items-center gap-1.5 text-sand hover:text-amber text-xs transition-colors"
              >
                <span>📞</span> 930 042 165
              </a>
            </div>
            {/* Dirección */}
            <div>
              <p className="text-parchment font-semibold text-xs uppercase tracking-wider mb-2">{t('home.footer.whereTitle')}</p>
              <address className="not-italic text-sand text-xs leading-relaxed">
                Passeig de Lluís Muncunill, 9, local 6<br />
                08225 Terrassa, Barcelona
              </address>
              <div className="flex items-center gap-3 mt-2">
                <a
                  href="https://maps.google.com/?q=Passeig+de+Lluís+Muncunill+9+Terrassa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber hover:underline"
                >
                  {t('home.footer.mapsLink')}
                </a>
                <a
                  href="https://www.instagram.com/frankfurt_els_tr3s/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber hover:underline"
                >
                  {t('home.footer.instagramLink')}
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-line">
                <p className="text-parchment/90 text-xs font-semibold mb-1">
                  {t('home.footer.location2Name')}
                </p>
                <address className="not-italic text-sand text-xs leading-relaxed">
                  Parc de les Nacions Unides, 18, local<br />
                  08225 Terrassa, Barcelona
                </address>
                <div className="flex items-center gap-3 mt-2">
                  <a
                    href="https://maps.google.com/?q=Parc+de+les+Nacions+Unides+18+Terrassa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber hover:underline"
                  >
                    {t('home.footer.mapsLink')}
                  </a>
                  <a
                    href="https://www.instagram.com/elstr3scanroca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber hover:underline"
                  >
                    {t('home.footer.instagramLink')}
                  </a>
                </div>
              </div>
            </div>
            {/* Legal */}
            <div>
              <p className="text-parchment font-semibold text-xs uppercase tracking-wider mb-2">{t('home.footer.legalTitle')}</p>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/privacidad" className="text-sand text-xs hover:text-parchment transition-colors">
                    {t('home.footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sand text-xs hover:text-parchment transition-colors">
                    {t('home.footer.cookies')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-line pt-6 text-center text-sand/80 text-xs space-y-2">
            <p>{t('home.footer.copyright')}</p>
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
            <p>
              <Link href="/admin/login" className="text-sand/70 hover:text-parchment transition-colors">
                {t('home.footer.adminLink')}
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

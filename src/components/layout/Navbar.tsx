'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.solutions'), href: '/solutions' },
    { label: t('nav.demo'), href: '/demo' },
    { label: t('nav.technology'), href: '/technology' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Engine Status */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative h-10 w-36 sm:w-44 flex items-center">
              <Image
                src="/visitra.png"
                alt="VISITRA Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>
          <div className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high/60 border border-outline-variant/30 text-secondary font-code-sm text-xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span>{t('nav.status_engine')}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors text-sm font-medium whitespace-nowrap pb-0.5 ${
                  active
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA, Language Toggle & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-surface-container rounded-lg p-0.5 border border-outline-variant/40 flex-shrink-0">
            <button
              onClick={() => setLang('vi')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                lang === 'vi'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Tiếng Việt"
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                lang === 'en'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="English"
            >
              🇬🇧 EN
            </button>
          </div>

          <div className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high/40 border border-outline-variant/20 text-on-surface-variant font-code-sm text-xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>{t('nav.latency')}: 4.2ms</span>
          </div>

          <Link
            href="/demo"
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider hover:bg-surface-tint hover:text-on-primary transition-all shadow-[0_0_12px_rgba(138,206,255,0.15)] whitespace-nowrap flex-shrink-0"
          >
            {t('nav.explore_demo')}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded text-on-surface-variant hover:text-on-surface focus:outline-none flex-shrink-0"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest/95 backdrop-blur-2xl border-b border-outline-variant/40 px-margin-lg py-space-lg flex flex-col gap-space-md">
          <nav className="flex flex-col gap-space-sm">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-space-md py-space-sm rounded-lg text-body-lg transition-all ${
                    active
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

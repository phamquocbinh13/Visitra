'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-lg flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-lg">
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col gap-space-md">
            <Link href="/" className="flex items-center">
              <div className="relative h-11 w-44 flex items-center">
                <Image
                  src="/visitra.png"
                  alt="VISITRA Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="inline-flex items-center gap-space-xs text-secondary font-code-sm text-code-sm pt-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>SOVEREIGN ARCHITECTURE // v2.4</span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-gutter-lg">
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
                {t('footer.solutions')}
              </span>
              <Link href="/solutions/visitor-management" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.sol_visitor')}
              </Link>
              <Link href="/solutions/access-control" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.sol_access')}
              </Link>
              <Link href="/solutions/student-attendance" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.sol_student')}
              </Link>
              <Link href="/solutions/workforce-attendance" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.sol_workforce')}
              </Link>
              <Link href="/solutions/restricted-area" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.sol_restricted')}
              </Link>
              <Link href="/solutions/event-check-in" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.sol_event')}
              </Link>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
                {t('footer.technology')}
              </span>
              <Link href="/technology" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.tech_engine')}
              </Link>
              <Link href="/technology#pipeline" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.tech_vector')}
              </Link>
              <Link href="/technology#privacy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.tech_privacy')}
              </Link>
              <Link href="/demo" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.tech_api')}
              </Link>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
                {t('footer.platform')}
              </span>
              <Link href="/demo" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.plat_demo')}
              </Link>
              <Link href="/contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.plat_contact')}
              </Link>
              <Link href="/solutions" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {t('footer.plat_overview')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-space-md border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-code-sm text-code-sm">
          <span>© {new Date().getFullYear()} {t('footer.copyright')}</span>
          <div className="flex items-center gap-space-md">
            <span>{t('footer.terms')}</span>
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.standards')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

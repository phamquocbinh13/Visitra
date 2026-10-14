'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SOLUTIONS } from '@/data/solutions';

export default function SolutionsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredSolutions = SOLUTIONS.filter((sol) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'access') return sol.category === 'access';
    if (activeFilter === 'attendance') return sol.category === 'attendance';
    if (activeFilter === 'smart-building') return sol.category === 'smart-building' || sol.slug === 'access-control';
    if (activeFilter === 'events') return sol.category === 'events';
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* 01 HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest py-space-xl md:py-margin-lg border-b border-outline-variant/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-margin-lg relative z-10 flex flex-col gap-space-lg">
          <div className="flex flex-wrap items-center justify-between gap-space-md">
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface-container border border-primary/20 text-primary font-code-sm text-code-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>ECOSYSTEM & ARCHITECTURE // v2.4</span>
            </div>
            <div className="hidden sm:flex items-center gap-space-md text-on-surface-variant font-code-sm text-code-sm">
              <span className="flex items-center gap-space-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                DECOUPLED EDGE ENGINE
              </span>
              <span className="text-outline-variant">|</span>
              <span>LATENCY: 4.2ms OVERLAY</span>
            </div>
          </div>

          <div className="max-w-4xl flex flex-col gap-space-md">
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight">
              ONE CORE TECHNOLOGY.<br />
              <span className="text-primary">MANY REAL-WORLD APPLICATIONS.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Recognition becomes powerful when it connects to the environments around us. High-throughput edge inference engineered for mission-critical physical spaces, continuous auditability, and sovereign telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
            <a
              href="#solutions-catalog"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-all shadow-md"
            >
              <span>Explore All Solutions</span>
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-variant transition-colors border border-outline-variant/30"
            >
              <span>Open Live Demo</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low text-on-surface-variant font-code-sm text-code-sm">
              <span className="material-symbols-outlined text-primary text-[14px]">bolt</span>
              <span>6 Active Deployment Profiles</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 CATALOG FILTER & CARDS */}
      <section className="w-full bg-surface py-space-xl" id="solutions-catalog">
        <div className="max-w-7xl mx-auto px-margin-lg flex flex-col gap-space-xl">
          {/* Topology Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20">
            <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[16px]">filter_alt</span>
              <span className="uppercase tracking-wider font-semibold text-on-surface">Topology Filter</span>
            </div>
            <div className="flex flex-wrap items-center gap-space-xs">
              {[
                { key: 'all', label: 'ALL (6)' },
                { key: 'access', label: 'ACCESS & SECURITY (3)' },
                { key: 'attendance', label: 'ATTENDANCE (2)' },
                { key: 'events', label: 'EVENTS (1)' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-space-md py-space-xs rounded font-label-md text-label-md uppercase tracking-wider transition-all ${
                    activeFilter === filter.key
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solution Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
            {filteredSolutions.map((sol) => (
              <div
                key={sol.id}
                className="flex flex-col justify-between bg-surface-container rounded-lg p-space-lg border border-outline-variant/20 hover:border-primary/40 transition-all group"
              >
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-code-sm text-code-sm text-primary tracking-widest uppercase bg-surface-container-high px-space-sm py-space-xs rounded border border-primary/20">
                      {sol.pillar}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded bg-surface-container-lowest h-36 relative">
                    <img
                      src={sol.imageUrl}
                      alt={sol.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/30 to-transparent" />
                    <div className="absolute bottom-space-sm left-space-sm flex items-center gap-space-xs px-space-xs py-0.5 rounded bg-surface-container-lowest/80 text-secondary font-code-sm text-code-sm border border-secondary/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span>{sol.badgeText}</span>
                    </div>
                  </div>

                  <h2 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    {sol.title}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {sol.shortDescription}
                  </p>
                </div>

                <div className="pt-space-lg flex flex-col gap-space-sm border-t border-outline-variant/20 mt-space-md">
                  <div className="inline-flex items-center gap-space-xs font-code-sm text-code-sm text-secondary bg-surface-container-high/60 px-space-sm py-space-xs rounded">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span>&lt; {sol.latencyText} verification • {sol.accuracyText} accuracy</span>
                  </div>
                  <Link
                    href={`/solutions/${sol.slug}`}
                    className="inline-flex items-center justify-between text-on-surface group-hover:text-primary font-label-md text-label-md uppercase tracking-wider pt-space-xs transition-colors"
                  >
                    <span>Explore Solution Architecture</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

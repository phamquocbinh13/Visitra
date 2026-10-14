import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { SOLUTIONS } from '@/data/solutions';

export const metadata: Metadata = {
  title: 'VISITRA — Intelligent Recognition & Automation',
  description: 'VISITRA builds intelligent recognition and automation solutions that connect people, spaces, and enterprise technology across sub-second mission thresholds.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 01 HERO SECTION */}
      <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden bg-surface pt-12 pb-16">
        {/* Ambient Depth Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-32 -left-20 w-[600px] h-[600px] rounded-full bg-secondary-container/20 blur-[130px]" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-surface-container-high/40 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-margin-lg w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Telemetry Status Ribbon */}
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container text-secondary font-code-sm text-code-sm uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                SYS: STABLE // COGNITIVE FABRIC v2.4
              </span>
              <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low text-tertiary font-code-sm text-code-sm">
                <span className="material-symbols-outlined text-[13px]">speed</span>
                &lt;18ms INFERENCE
              </span>
              <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low text-primary font-code-sm text-code-sm">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                99.4% PRECISION
              </span>
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary">
                Spatial Autonomy & Vision
              </span>
              <h1 className="font-display-lg text-display-lg md:text-[46px] md:leading-[52px] tracking-tight font-bold text-on-surface uppercase max-w-2xl">
                Intelligence that moves with you.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                VISITRA builds intelligent recognition and automation solutions that connect people, spaces, and enterprise technology across sub-second mission thresholds.
              </p>
            </div>

            {/* Action Matrix CTAs */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-all shadow-md"
              >
                <span>Explore Solutions</span>
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-highest transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
                <span>Live Technology Demo</span>
              </Link>
            </div>

            {/* Micro Readout Stats */}
            <div className="grid grid-cols-3 gap-gutter pt-space-md max-w-lg">
              <div className="flex flex-col">
                <span className="font-code-sm text-code-sm text-outline">EDGE FPS</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">120 fps</span>
              </div>
              <div className="flex flex-col">
                <span className="font-code-sm text-code-sm text-outline">VECTOR DIM</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">512-D</span>
              </div>
              <div className="flex flex-col">
                <span className="font-code-sm text-code-sm text-outline">MATCH LOCK</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">0.08 sec</span>
              </div>
            </div>
          </div>

          {/* Right Visual Reticle Display */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full aspect-square max-w-[460px] rounded-xl bg-surface-container p-space-md flex flex-col justify-between overflow-hidden shadow-xl border border-outline-variant/30">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-code-sm text-code-sm text-secondary tracking-widest uppercase">
                    OPTICAL STREAM 01
                  </span>
                </div>
                <div className="font-code-sm text-code-sm text-outline">LIVE: LATENCY 14.1ms</div>
              </div>

              {/* Vector Reticle Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-full h-full text-secondary-container/40" fill="none" viewBox="0 0 400 400">
                  <line opacity="0.3" stroke="currentColor" strokeDasharray="2 4" strokeWidth="0.8" x1="40" x2="360" y1="40" y2="40" />
                  <line opacity="0.3" stroke="currentColor" strokeDasharray="2 4" strokeWidth="0.8" x1="40" x2="360" y1="360" y2="360" />
                  <circle cx="200" cy="200" opacity="0.4" r="120" stroke="currentColor" strokeDasharray="4 6" strokeWidth="0.8" />
                  <circle cx="200" cy="200" opacity="0.2" r="160" stroke="currentColor" strokeWidth="0.5" />
                  <g className="text-secondary" opacity="0.85">
                    <circle cx="200" cy="140" fill="currentColor" r="3" />
                    <circle cx="170" cy="170" fill="currentColor" r="2.5" />
                    <circle cx="230" cy="170" fill="currentColor" r="2.5" />
                    <circle cx="200" cy="205" fill="currentColor" r="3" />
                    <path d="M200 140 L170 170 L200 205 L230 170 Z" fill="rgba(131, 207, 255, 0.05)" stroke="currentColor" strokeWidth="0.8" />
                  </g>
                </svg>
              </div>

              <div className="z-10 bg-surface-container-lowest/80 backdrop-blur-md p-space-sm rounded border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span className="font-code-sm text-code-sm text-on-surface">FACE LANDMARK LOCK // 512-D</span>
                </div>
                <span className="font-code-sm text-code-sm text-secondary font-bold">99.4% MATCH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 CORE ARCHITECTURE HIGHLIGHTS */}
      <section className="w-full bg-surface-container-lowest py-16 px-4 md:px-margin-lg border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <span className="font-code-sm text-code-sm uppercase tracking-widest text-primary font-semibold">
              SOVEREIGN RECOGNITION PLATFORM
            </span>
            <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">
              Engineered For Mission-Critical Spaces
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            <div className="bg-surface-container p-space-lg rounded-lg border border-outline-variant/20 flex flex-col gap-space-sm">
              <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Sub-20ms Inference</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                High-throughput optical feature extraction engineered for instant door clearance and high-volume pedestrian corridors.
              </p>
            </div>

            <div className="bg-surface-container p-space-lg rounded-lg border border-outline-variant/20 flex flex-col gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-3xl">lock</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Privacy By Design</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Raw face images are instantly transformed into unreadable 512-D mathematical vectors. No photo databases exposed.
              </p>
            </div>

            <div className="bg-surface-container p-space-lg rounded-lg border border-outline-variant/20 flex flex-col gap-space-sm">
              <span className="material-symbols-outlined text-primary text-3xl">settings_ethernet</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Hardware Bridged</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Native OSDP v2.2 and dry contact relay support directly connecting to physical turnstiles, locks, and barriers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 SOLUTIONS CATALOG GRID */}
      <section className="w-full bg-surface py-16 px-4 md:px-margin-lg">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <span className="font-code-sm text-code-sm uppercase tracking-widest text-primary font-semibold">
                ENTERPRISE DEPLOYMENTS
              </span>
              <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">
                Featured Solutions
              </h2>
            </div>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md uppercase tracking-wider hover:underline"
            >
              <span>View All 6 Solutions</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
            {SOLUTIONS.map((sol) => (
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

                  <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    {sol.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {sol.shortDescription}
                  </p>
                </div>

                <div className="pt-space-lg flex flex-col gap-space-sm border-t border-outline-variant/20 mt-space-md">
                  <Link
                    href={`/solutions/${sol.slug}`}
                    className="inline-flex items-center justify-between text-on-surface group-hover:text-primary font-label-md text-label-md uppercase tracking-wider transition-colors"
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

      {/* 04 TECHNOLOGY & PIPELINE CALLOUT */}
      <section className="w-full bg-surface-container-low py-16 px-4 md:px-margin-lg border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <span className="font-code-sm text-code-sm uppercase tracking-widest text-secondary font-semibold">
              VISITRA RECOGNITION ENGINE
            </span>
            <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface">
              High-Precision Biometric Telemetry
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Every identity vector processed by VISITRA goes through affine alignment, Passive 3D Liveness scoring, and 512-float32 vector extraction in under 20 milliseconds.
            </p>
            <div className="pt-space-xs">
              <Link
                href="/technology"
                className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-all shadow-md"
              >
                <span>Explore Technology Pipeline</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-container p-space-md rounded-xl border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pb-space-xs border-b border-outline-variant/20">
              <span>PIPELINE TELEMETRY</span>
              <span className="text-secondary font-bold">STATUS: ONLINE</span>
            </div>
            <div className="flex justify-between items-center text-body-sm text-on-surface">
              <span>SCRFD Alignment</span>
              <span className="text-primary font-mono">3.4ms</span>
            </div>
            <div className="flex justify-between items-center text-body-sm text-on-surface">
              <span>512-D Vector Extraction</span>
              <span className="text-primary font-mono">11.2ms</span>
            </div>
            <div className="flex justify-between items-center text-body-sm text-on-surface">
              <span>Cosine Index Search</span>
              <span className="text-primary font-mono">1.8ms</span>
            </div>
            <div className="flex justify-between items-center text-body-sm text-on-surface">
              <span>OSDP Relay Dispatch</span>
              <span className="text-secondary font-mono">&lt; 1.0ms</span>
            </div>
          </div>
        </div>
      </section>

      {/* 05 ENTERPRISE CONTACT CTA */}
      <section className="w-full bg-surface py-20 px-4 md:px-margin-lg text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-space-md">
          <span className="font-code-sm text-code-sm uppercase tracking-widest text-primary font-semibold">
            GET STARTED WITH VISITRA
          </span>
          <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface">
            Ready to Connect Your Physical Spaces?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Test the live telemetry demo laboratory or connect with our enterprise architecture team for custom hardware integration specs.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-space-md pt-space-sm">
            <Link
              href="/demo"
              className="inline-flex items-center gap-space-xs px-space-xl py-3 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-all shadow-md"
            >
              <span>Launch Live Demo</span>
              <span className="material-symbols-outlined text-[16px]">radar</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-space-xs px-space-xl py-3 rounded bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-highest transition-all shadow-sm"
            >
              <span>Contact VISITRA</span>
              <span className="material-symbols-outlined text-[16px]">mail</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VISITRA Technology — Recognition Engine & Spatial Pipeline',
  description: 'Fast, accurate face recognition built for smart buildings—protecting privacy while making physical entry effortless and secure.',
};

export default function TechnologyPage() {
  const steps = [
    {
      step: 'STEP 01',
      title: 'Camera Senses',
      badge: 'Sensors On',
      icon: 'videocam',
      desc: 'The entry camera quietly notices when an authorized person approaches the door, adjusting automatically for dim or bright lighting.',
      state: 'Motion Detected',
    },
    {
      step: 'STEP 02',
      title: 'Face Detection',
      badge: 'Real-Time',
      icon: 'crop_free',
      desc: 'The system instantly locates the face, filtering out busy background movements like waving hands, bags, or passing vehicles.',
      state: 'Face Locked',
    },
    {
      step: 'STEP 03',
      title: 'Vector Extraction',
      badge: '512-D Spatial',
      icon: 'fingerprint',
      desc: 'Facial geometry is converted into 512-float32 spatial numbers in under 12 milliseconds without storing raw photos.',
      state: 'Vector Extracted',
    },
    {
      step: 'STEP 04',
      title: 'Database Search',
      badge: 'Cosine Index',
      icon: 'search',
      desc: 'Fast cosine similarity search compares vectors against stored identity profiles in milliseconds.',
      state: 'Similarity Matched',
    },
    {
      step: 'STEP 05',
      title: 'Hardware Release',
      badge: 'OSDP Relay',
      icon: 'door_sliding',
      desc: 'OSDP v2 protocol signals physical turnstiles or door maglocks to release instantly.',
      state: 'Door Opened',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* 01 HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest border-b border-outline-variant/30 py-space-xl md:py-margin-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-margin-lg relative z-10 flex flex-col gap-space-lg">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-high text-primary font-code-sm text-code-sm shadow-sm w-fit border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="tracking-widest uppercase font-semibold">SMART BUILDING ACCESS // EXPLAINED SIMPLY</span>
          </div>

          <div className="max-w-4xl flex flex-col gap-space-md">
            <h1 className="font-display-lg text-display-lg text-on-surface uppercase tracking-tight">
              THE TECHNOLOGY BEHIND VISITRA
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
              Fast, accurate face recognition built for smart buildings—protecting privacy while making entry effortless. Instead of saving raw photos, VISITRA converts face shapes into unreadable mathematical numbers in milliseconds so people can walk straight through doors without keys, badges, or delays.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
            <Link
              href="/demo"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-all shadow-md"
            >
              <span>Try Interactive Demo</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <a
              href="#pipeline"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-variant transition-all shadow-sm border border-outline-variant/30"
            >
              <span>See Integration API</span>
              <span className="material-symbols-outlined text-[16px]">code</span>
            </a>
          </div>

          {/* 3 Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-margin-lg pt-space-md bg-surface-container-low p-space-md rounded-lg shadow-sm border border-outline-variant/20">
            <div className="flex flex-col gap-space-xs p-space-sm bg-surface-container rounded border border-outline-variant/20">
              <div className="flex items-center gap-space-xs text-primary font-code-sm text-code-sm">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span className="uppercase tracking-wider font-semibold">Lightning Fast</span>
              </div>
              <span className="font-headline-md text-headline-md text-on-surface">&lt; 20ms Verification Speed</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Instant recognition before you even reach the gate.
              </span>
            </div>

            <div className="flex flex-col gap-space-xs p-space-sm bg-surface-container rounded border border-outline-variant/20">
              <div className="flex items-center gap-space-xs text-secondary font-code-sm text-code-sm">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span className="uppercase tracking-wider font-semibold">Privacy First</span>
              </div>
              <span className="font-headline-md text-headline-md text-on-surface">100% No Raw Photos Stored</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Only private mathematical codes that cannot be reversed.
              </span>
            </div>

            <div className="flex flex-col gap-space-xs p-space-sm bg-surface-container rounded border border-outline-variant/20">
              <div className="flex items-center gap-space-xs text-primary font-code-sm text-code-sm">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="uppercase tracking-wider font-semibold">Consistent Accuracy</span>
              </div>
              <span className="font-headline-md text-headline-md text-on-surface">99.9% Recognition Accuracy</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Works in dim corridors, bright sun, or with glasses.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 5-STEP PROCESSING PIPELINE */}
      <section className="w-full bg-surface py-margin-lg border-b border-outline-variant/30" id="pipeline">
        <div className="max-w-7xl mx-auto px-margin-lg flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-primary font-code-sm text-code-sm uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              <span>Step-by-Step Flow</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight uppercase">
              How Entry Works in 5 Simple Steps
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Everything happens locally on the building gate in less than a blink of an eye. Here is what happens from the moment you step forward to the moment the door opens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-gutter">
            {steps.map((st) => (
              <div
                key={st.step}
                className="flex flex-col p-space-lg rounded-lg bg-surface-container shadow-sm border border-outline-variant/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low px-space-sm py-space-xs rounded">
                  <span className="font-code-sm text-code-sm text-secondary font-bold">{st.step}</span>
                  <span className="font-code-sm text-code-sm text-outline">{st.badge}</span>
                </div>
                <div className="flex items-center gap-space-sm mb-space-xs">
                  <span className="material-symbols-outlined text-primary text-[22px]">{st.icon}</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{st.title}</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                  {st.desc}
                </p>
                <div className="mt-auto pt-space-xs flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm bg-surface-container-lowest p-space-xs rounded border border-outline-variant/20">
                  <span>STATE</span>
                  <span className="text-secondary font-semibold">{st.state}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 PRIVACY & ARCHITECTURE DEEP DIVE */}
      <section className="w-full bg-surface-container-low py-16 px-4 md:px-margin-lg" id="privacy">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <span className="font-code-sm text-code-sm uppercase tracking-widest text-primary font-semibold">
              PRIVACY ARCHITECTURE & COMPLIANCE
            </span>
            <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface">
              Sovereign Ephemeral Telemetry
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              VISITRA is built from the ground up for strict European GDPR and CCPA privacy compliance. Facial embeddings are one-way hash transformations that cannot be reversed back into visual photos.
            </p>
          </div>

          <div className="lg:col-span-5 bg-surface-container p-space-lg rounded-xl border border-outline-variant/30 flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Security Specifications</h3>
            <ul className="flex flex-col gap-space-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span>One-way 512-D Floating Point Embeddings</span>
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span>Passive 3D Liveness Anti-Spoofing</span>
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span>AES-256 Vector Vault Database Encryption</span>
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span>Direct OSDP v2.2 Hardware Interlock</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

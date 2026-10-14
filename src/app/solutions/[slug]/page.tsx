import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SOLUTIONS } from '@/data/solutions';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return SOLUTIONS.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const solution = SOLUTIONS.find((s) => s.slug === params.slug);
  if (!solution) {
    return {
      title: 'Solution Not Found — VISITRA',
    };
  }
  return {
    title: `${solution.title} — VISITRA Solutions`,
    description: solution.description,
  };
}

export default function SolutionDetailPage({ params }: PageProps) {
  const solution = SOLUTIONS.find((s) => s.slug === params.slug);

  if (!solution) {
    notFound();
  }

  const relatedSolutions = SOLUTIONS.filter((s) => solution.relatedSlugs.includes(s.slug));

  return (
    <div className="flex flex-col w-full">
      {/* 01 HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface py-12 md:py-20 px-4 md:px-margin-lg border-b border-outline-variant/30">
        {/* Ambient grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(138,206,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(138,206,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center relative z-10">
          {/* Left Column Content */}
          <div className="lg:col-span-6 flex flex-col gap-space-lg">
            <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded bg-surface-container-high/80 text-secondary w-fit shadow-sm border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-code-sm text-code-sm tracking-widest uppercase">{solution.pillar}</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant/50">|</span>
              <span className="font-code-sm text-code-sm text-primary">DEPLOYMENT READY</span>
            </div>

            <div className="flex flex-col gap-space-sm">
              <h1 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface">
                {solution.title}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                {solution.description}
              </p>
            </div>

            {/* Telemetry Indicators */}
            <div className="grid grid-cols-3 gap-space-sm py-space-xs max-w-lg">
              <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant/20">
                <div className="font-code-sm text-code-sm text-on-surface-variant">INFERENCE SPEED</div>
                <div className="font-headline-sm text-headline-sm text-primary mt-space-xs">
                  {solution.latencyText}
                </div>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant/20">
                <div className="font-code-sm text-code-sm text-on-surface-variant">PRECISION ACCURACY</div>
                <div className="font-headline-sm text-headline-sm text-secondary mt-space-xs">
                  {solution.accuracyText}
                </div>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant/20">
                <div className="font-code-sm text-code-sm text-on-surface-variant">PASS THROUGHPUT</div>
                <div className="font-headline-sm text-headline-sm text-on-surface mt-space-xs">
                  {solution.throughputText}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <Link
                href="/demo"
                className="inline-flex items-center gap-space-sm px-space-xl py-space-md rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-all shadow-md"
              >
                <span>Try Live Demo</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-space-sm px-space-xl py-space-md rounded bg-surface-container-high text-on-surface hover:text-primary font-label-md text-label-md uppercase tracking-wider transition-colors shadow-sm border border-outline-variant/30"
              >
                <span>Contact VISITRA</span>
              </Link>
            </div>
          </div>

          {/* Right Column Camera / Visual Viewport */}
          <div className="lg:col-span-6 relative">
            <div className="w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl relative border border-outline-variant/30">
              <div className="bg-surface-container-high px-space-md py-space-xs flex items-center justify-between font-code-sm text-code-sm">
                <div className="flex items-center gap-space-sm text-secondary">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>CAM_01 // {solution.slug.toUpperCase()}</span>
                </div>
                <div className="text-on-surface-variant">1080p @ 60fps // RTSP://SEC_NET</div>
              </div>

              <div className="relative w-full aspect-[4/3] bg-surface-container-low overflow-hidden">
                <img
                  src={solution.imageUrl}
                  alt={solution.imageAlt}
                  className="w-full h-full object-cover opacity-70 filter contrast-125"
                />
                {/* Bounding Box Overlay */}
                <div className="absolute top-[22%] left-[34%] w-[32%] h-[48%] rounded-sm border-2 border-primary bg-primary/10">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary" />

                  <div className="absolute -top-7 left-0 bg-primary text-on-primary font-code-sm text-code-sm px-space-xs py-0.5 rounded uppercase font-bold tracking-wider">
                    SCRFD_TENSOR // {solution.accuracyText}
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-surface-container/90 backdrop-blur-md p-space-sm rounded shadow-lg flex items-center justify-between gap-space-sm border border-outline-variant/30">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface uppercase">{solution.title}</span>
                      <span className="font-code-sm text-code-sm text-primary">CLEARANCE: AUTHORIZED</span>
                    </div>
                  </div>
                  <span className="px-space-xs py-0.5 rounded bg-primary text-on-primary font-code-sm text-code-sm font-bold">
                    {solution.badgeText}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container px-space-md py-space-sm grid grid-cols-4 gap-space-xs text-center font-code-sm text-code-sm border-t border-outline-variant/20">
                <div>
                  <span className="text-on-surface-variant block">VECTOR-D</span>
                  <span className="text-secondary font-bold">512 FLOAT32</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">AFFINE NORM</span>
                  <span className="text-primary font-bold">L2 CONVERGED</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">RELAY STATUS</span>
                  <span className="text-on-surface font-bold">OSDP v2.2</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">INGRESS GATE</span>
                  <span className="text-primary font-bold">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 WORKFLOW JOURNEY */}
      <section className="w-full bg-surface-container-lowest py-16 px-4 md:px-margin-lg border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <span className="font-code-sm text-code-sm uppercase tracking-widest text-primary font-semibold">
              WORKFLOW & INGRESS SEQUENCE
            </span>
            <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">
              The {solution.title} Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {solution.workflow.map((step) => (
              <div
                key={step.stepNumber}
                className="flex flex-col p-space-lg rounded-lg bg-surface-container shadow-sm border border-outline-variant/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low px-space-sm py-space-xs rounded">
                  <span className="font-code-sm text-code-sm text-secondary font-bold">{step.stepNumber}</span>
                  <span className="font-code-sm text-code-sm text-outline">{step.subtitle}</span>
                </div>
                <div className="flex items-center gap-space-sm mb-space-xs">
                  <span className="material-symbols-outlined text-primary text-[22px]">{step.icon}</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{step.title}</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                  {step.description}
                </p>
                <div className="mt-auto pt-space-xs flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm bg-surface-container-lowest p-space-xs rounded border border-outline-variant/20">
                  <span>STATE</span>
                  <span className="text-secondary font-semibold">{step.triggerLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 KEY CAPABILITIES GRID */}
      <section className="w-full bg-surface py-16 px-4 md:px-margin-lg border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <span className="font-code-sm text-code-sm uppercase tracking-widest text-primary font-semibold">
              SOLUTION CAPABILITIES
            </span>
            <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">
              Core Technical Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg">
            {solution.capabilities.map((cap) => (
              <div
                key={cap.title}
                className="flex items-start gap-space-md p-space-lg rounded-lg bg-surface-container border border-outline-variant/20"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary border border-primary/30 shrink-0">
                  <span className="material-symbols-outlined text-xl">{cap.icon}</span>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-sm">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{cap.title}</h3>
                    {cap.badge && (
                      <span className="px-space-xs py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm">
                        {cap.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 RELATED SOLUTIONS */}
      {relatedSolutions.length > 0 && (
        <section className="w-full bg-surface-container-lowest py-16 px-4 md:px-margin-lg">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col gap-space-xs">
              <span className="font-code-sm text-code-sm uppercase tracking-widest text-primary font-semibold">
                RELATED ARCHITECTURES
              </span>
              <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">
                Explore Connected Deployment Profiles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
              {relatedSolutions.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/solutions/${rel.slug}`}
                  className="p-space-lg rounded-lg bg-surface-container border border-outline-variant/20 hover:border-primary/40 transition-all flex flex-col gap-space-sm group"
                >
                  <span className="font-code-sm text-code-sm text-primary uppercase">{rel.pillar}</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    {rel.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {rel.shortDescription}
                  </p>
                  <span className="text-secondary font-label-md text-label-md uppercase tracking-wider pt-space-xs group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View Solution →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

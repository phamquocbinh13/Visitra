import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-margin-lg text-center bg-surface">
      <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface-container border border-error/30 text-error font-code-sm text-code-sm mb-space-md">
        <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
        <span>404 // ROUTE NOT FOUND</span>
      </div>

      <h1 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface mb-space-xs">
        Telematics Signal Lost
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-space-lg">
        The requested spatial vector route or solution profile does not exist in the active VISITRA registry.
      </p>

      <div className="flex items-center gap-space-md">
        <Link
          href="/"
          className="px-space-lg py-space-sm rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-all"
        >
          Return to Portal Overview
        </Link>
        <Link
          href="/solutions"
          className="px-space-lg py-space-sm rounded bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-variant transition-all border border-outline-variant/30"
        >
          Explore Solutions
        </Link>
      </div>
    </div>
  );
}

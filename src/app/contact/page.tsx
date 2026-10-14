'use client';

import React, { useState } from 'react';
import { ContactService } from '@/services/contact';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [solutionOfInterest, setSolutionOfInterest] = useState('Smart Visitor Management');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName || !organization || !email || !message) {
      setErrorMsg('Please fill in all required fields marked with *.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await ContactService.submitContactRequest({
        fullName,
        organization,
        email,
        phone,
        solutionOfInterest,
        message,
      });

      setSuccessMsg(res.message);
      setFullName('');
      setOrganization('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred while submitting.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-[calc(100vh-16rem)]">
      <section className="relative w-full overflow-hidden bg-surface-container-lowest border-b border-outline-variant/30 py-space-xl md:py-margin-lg">
        <div className="max-w-7xl mx-auto px-margin-lg flex flex-col gap-space-md">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-high text-primary font-code-sm text-code-sm shadow-sm w-fit border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="tracking-widest uppercase font-semibold">ENTERPRISE SOLUTIONS // CONSOLE CONNECT</span>
          </div>

          <h1 className="font-display-lg text-display-lg text-on-surface uppercase tracking-tight">
            CONNECT WITH VISITRA
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Discuss your physical access architecture, request deployment specifications, or schedule an architecture consultation with our engineering team.
          </p>
        </div>
      </section>

      <section className="w-full bg-surface py-margin-lg px-4 md:px-margin-lg">
        <div className="max-w-4xl mx-auto bg-surface-container-low p-space-xl rounded-xl border border-outline-variant/30 shadow-xl">
          {successMsg ? (
            <div className="p-space-lg rounded-lg bg-primary-container/30 border border-primary/40 text-on-primary-container flex flex-col gap-space-sm text-center">
              <span className="material-symbols-outlined text-4xl text-primary mx-auto">task_alt</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Submission Received</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
                {successMsg}
              </p>
              <button
                onClick={() => setSuccessMsg('')}
                className="mt-space-md px-space-lg py-space-sm rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider mx-auto"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
              {errorMsg && (
                <div className="p-space-md rounded bg-error-container/40 border border-error/50 text-error font-body-sm text-body-sm flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-lg">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Dr. Elena Rossi"
                    className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g., Nexus Robotics Corp"
                    className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., elena@nexusrobotics.io"
                    className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +1 (555) 019-2834"
                    className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Solution of Interest *
                </label>
                <select
                  value={solutionOfInterest}
                  onChange={(e) => setSolutionOfInterest(e.target.value)}
                  className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
                >
                  <option value="Smart Visitor Management">Smart Visitor Management</option>
                  <option value="Smart Building Access">Smart Building Access</option>
                  <option value="Automated Student Attendance">Automated Student Attendance</option>
                  <option value="Workforce Attendance">Workforce Attendance</option>
                  <option value="Secure Restricted Area">Secure Restricted Area</option>
                  <option value="Smart Event Check-in">Smart Event Check-in</option>
                  <option value="Other / General Query">Other / General Query</option>
                </select>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Message / Project Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your facility layout, number of access turnstiles, or hardware integration target..."
                  className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="py-space-md px-space-xl rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm uppercase tracking-wider hover:bg-surface-tint transition-all shadow-md flex items-center justify-center gap-space-sm self-start"
              >
                <span className="material-symbols-outlined">send</span>
                <span>{submitting ? 'Transmitting Request...' : 'Submit Contact Request'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

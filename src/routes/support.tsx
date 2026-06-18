import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { calLink } from '@/lib/shared';
import { useEffect, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import {
  CalendarIcon,
  ClockIcon,
  MessageCircleIcon,
  ArrowRightIcon,
  Loader2Icon,
} from 'lucide-react';

export const Route = createFileRoute('/support')({
  head: () => ({
    meta: [
      { title: 'Support · Unify Docs' },
      {
        name: 'description',
        content:
          'Book a one-on-one support session for Unify, Paper/Spigot plugins, and Kotlin development.',
      },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCalApi()
      .then((cal) => {
        if (!mounted) return;
        cal('ui', {
          theme: 'auto',
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
        setReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
            <MessageCircleIcon className="size-3.5" />
            One-on-one help
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Book a support session
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-fd-muted-foreground">
            Stuck on a plugin issue, need architecture advice, or want a walkthrough
            of Unify? Pick a time below and we&apos;ll jump on a call.
          </p>
        </div>

        {/* Info cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon={<ClockIcon className="size-5 text-fd-primary" />}
            title="30–60 minutes"
            description="Enough time to dig into your code or design questions."
          />
          <InfoCard
            icon={<CalendarIcon className="size-5 text-fd-primary" />}
            title="Calendar sync"
            description="Bookings are handled by Cal.com with automatic invites."
          />
          <InfoCard
            icon={<MessageCircleIcon className="size-5 text-fd-primary" />}
            title="Minecraft & Kotlin"
            description="Help with Unify, Paper/Spigot plugins, and tooling."
          />
        </div>

        {/* Booking widget */}
        <div className="overflow-hidden rounded-2xl border bg-fd-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Select a time</h2>
            <p className="text-sm text-fd-muted-foreground">
              Times are shown in your local timezone.
            </p>
          </div>

          <div className="relative min-h-[700px]">
            {!ready && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-fd-card">
                <Loader2Icon className="size-6 animate-spin text-fd-muted-foreground" />
                <p className="text-sm text-fd-muted-foreground">
                  Loading booking calendar…
                </p>
              </div>
            )}

            <Cal
              calLink={calLink}
              style={{ width: '100%', minHeight: '700px' }}
              config={{ layout: 'month_view' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t pt-6 text-center">
          <p className="text-xs text-fd-muted-foreground">
            Booking powered by{' '}
            <a
              href={`https://cal.com/${calLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-fd-foreground"
            >
              Cal.com
            </a>
            .
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-fd-primary hover:underline"
          >
            Back to docs
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      </main>
    </HomeLayout>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-fd-card/50 p-4">
      <div className="mb-2">{icon}</div>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}

import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { calLink } from '@/lib/shared';
import { useEffect, useRef, useState } from 'react';
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

interface CalApi {
  (command: 'init', options: Record<string, unknown>): void;
  (command: 'inline', options: Record<string, unknown>): void;
  q?: unknown[];
  loaded?: boolean;
  ns?: Record<string, CalApi>;
}

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

function SupportPage() {
  const embedRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = embedRef.current;
    if (!container) return;

    // Observe the container so we can hide the spinner once Cal renders its iframe.
    const observer = new MutationObserver((mutations) => {
      const hasIframe = mutations.some((m) =>
        Array.from(m.addedNodes).some(
          (n) => n.nodeName === 'IFRAME' || (n instanceof Element && n.querySelector('iframe')),
        ),
      );
      if (hasIframe) {
        setLoading(false);
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    const scriptId = 'cal-inline-snippet';
    if (document.getElementById(scriptId)) {
      // Snippet already injected (e.g. hot reload); clear and (re)render inline.
      container.innerHTML = '';
      if (window.Cal) {
        window.Cal('init', { origin: 'https://cal.com' });
        window.Cal('inline', {
          elementOrSelector: '#cal-inline-container',
          calLink,
          layout: 'month_view',
        });
      }
      return () => observer.disconnect();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.innerHTML = `
      (function (C, A, L) {
        let p = function (a, ar) { a.q.push(ar); };
        let d = C.document;
        C.Cal = C.Cal || function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") { cal.ns[namespace] = api; }
            else { cal.q.push(ar); }
            return api;
          } else {
            p(cal, ar);
          }
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");
      Cal("init", { origin: "https://cal.com" });
      Cal("inline", {
        elementOrSelector: "#cal-inline-container",
        calLink: "${calLink}",
        layout: "month_view"
      });
    `;

    script.onerror = () => {
      setError('Failed to load the Cal.com booking widget.');
      setLoading(false);
      observer.disconnect();
    };

    // Fallback: hide spinner after a generous timeout even if the iframe isn't detected.
    const timeout = setTimeout(() => {
      setLoading(false);
      observer.disconnect();
    }, 4000);

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
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
        <div className="overflow-hidden rounded-2xl border bg-fd-card">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Select a time</h2>
            <p className="text-sm text-fd-muted-foreground">
              Times are shown in your local timezone.
            </p>
          </div>

          <div className="relative min-h-[700px] p-1">
            {loading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-fd-card">
                <Loader2Icon className="size-6 animate-spin text-fd-muted-foreground" />
                <p className="text-sm text-fd-muted-foreground">
                  Loading booking calendar…
                </p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-fd-card px-6 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <a
                  href={`https://cal.com/${calLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fd-primary hover:underline"
                >
                  Open Cal.com directly
                </a>
              </div>
            )}

            <div
              ref={embedRef}
              id="cal-inline-container"
              className="min-h-[700px] w-full"
              aria-label="Booking calendar"
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

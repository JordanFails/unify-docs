import { Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { HomeIcon, ArrowRightIcon, BookOpenIcon, BoxIcon, ZapIcon, LayersIcon } from 'lucide-react';

const suggestions = [
  {
    title: 'Getting Started',
    description: 'Installation & setup guide',
    href: '/docs/getting-started',
    icon: BookOpenIcon,
  },
  {
    title: 'Core Features',
    description: 'ItemBuilder, CC, Config & more',
    href: '/docs/core-features',
    icon: ZapIcon,
  },
  {
    title: 'Menu System',
    description: 'Build GUIs & paginated menus',
    href: '/docs/menu-system',
    icon: LayersIcon,
  },
];

export function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-1 flex-col">
        {/* Main 404 area */}
        <div className="flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
          {/* Geometric illustration */}
          <div className="relative mb-10 h-48 w-48 animate-scale-in">
            {/* Floating cubes */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="h-20 w-20 rounded-xl border-2 border-fd-primary/20 bg-fd-primary/5 shadow-lg shadow-fd-primary/10 animate-[float_6s_ease-in-out_infinite]" />
                <div className="absolute -right-6 -top-6 h-14 w-14 rounded-lg border-2 border-fd-primary/15 bg-fd-primary/[0.03] shadow-md animate-[float_6s_ease-in-out_infinite_1s]" />
                <div className="absolute -bottom-4 -left-8 h-10 w-10 rounded-lg border-2 border-fd-primary/10 bg-fd-primary/[0.02] animate-[float_6s_ease-in-out_infinite_2s]" />
                <BoxIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-fd-primary/40" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="max-w-lg">
            <h1 className="animate-fade-in-up text-sm font-medium uppercase tracking-widest text-fd-primary mb-3">
              404 Error
            </h1>
            <h2 className="animate-fade-in-up delay-100 text-3xl font-semibold tracking-tight sm:text-4xl">
              Page not found
            </h2>
            <p className="animate-fade-in-up delay-200 mt-4 text-fd-muted-foreground leading-relaxed">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* CTA */}
          <Link
            to="/"
            className="animate-scale-in delay-300 hover-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-lg shadow-fd-primary/20 transition-all hover:brightness-110"
          >
            <HomeIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Suggested pages */}
        <div className="mx-auto w-full max-w-2xl px-6 pb-24">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-fd-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-fd-muted-foreground">
              You might be looking for
            </span>
            <div className="h-px flex-1 bg-fd-border" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {suggestions.map((s, i) => (
              <Link
                key={s.href}
                to={s.href}
                className={`animate-fade-in-up delay-${(i + 1) * 100} group flex flex-col gap-3 rounded-xl border bg-fd-card p-4 transition-all hover:border-fd-primary/30 hover:bg-fd-accent/50 hover-lift`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fd-primary/10">
                    <s.icon className="h-4 w-4 text-fd-primary" />
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-fd-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-fd-foreground">{s.title}</h3>
                  <p className="mt-0.5 text-xs text-fd-muted-foreground">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

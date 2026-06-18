import { createFileRoute, Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRightIcon, MenuIcon, SearchIcon, XIcon } from 'lucide-react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/differentstyles')({
  head: () => ({
    meta: [
      { title: 'Different Styles · Unify Docs' },
      {
        name: 'description',
        content: 'A Vercel-like docs layout variant for Unify.',
      },
    ],
  }),
  component: DifferentStyles,
});

type NavGroup = {
  label: string;
  items: Array<{ label: string; href: string }>;
};

const sidebar: NavGroup[] = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', href: '#introduction' },
      { label: 'Installation', href: '#installation' },
      { label: 'First command', href: '#first-command' },
    ],
  },
  {
    label: 'Core Concepts',
    items: [
      { label: 'Menus', href: '#menus' },
      { label: 'Scheduling', href: '#scheduling' },
      { label: 'Config', href: '#config' },
    ],
  },
  {
    label: 'Links',
    items: [
      { label: 'Full docs (default layout)', href: '/docs/getting-started' },
      { label: 'Status', href: '/status' },
      { label: 'Support', href: '/support' },
    ],
  },
];

const toc = [
  { label: 'Introduction', href: '#introduction' },
  { label: 'Installation', href: '#installation' },
  { label: 'First command', href: '#first-command' },
  { label: 'Menus', href: '#menus' },
  { label: 'Scheduling', href: '#scheduling' },
  { label: 'Config', href: '#config' },
];

function DifferentStyles() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('#introduction');

  const headingIds = useMemo(() => toc.map((t) => t.href.replace('#', '')), []);

  useEffect(() => {
    const headings = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));

        const first = visible[0]?.target as HTMLElement | undefined;
        if (first?.id) setActiveHeading(`#${first.id}`);
      },
      {
        root: null,
        rootMargin: '-96px 0px -70% 0px',
        threshold: [0.1, 0.2, 0.4],
      },
    );

    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  }, [headingIds]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Ambient + grid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background: [
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.10), transparent 60%)',
            'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent 24rem)',
          ].join(','),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 0%, black 35%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10 md:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <MenuIcon className="size-4" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <img src="/logo.svg" alt="" width={22} height={22} className="rounded-md invert" />
            <span>Unify</span>
          </Link>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="relative w-full max-w-md">
              <SearchIcon className="pointer-events-none absolute left-3 top-2.5 size-4 text-white/40" />
              <input
                placeholder="Search docs…"
                className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white/90 placeholder:text-white/40 outline-none ring-white/20 focus:ring-2"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/docs/getting-started"
              className="hidden rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 sm:inline-flex"
            >
              Default docs
            </Link>
            <Link
              to="/docs/getting-started"
              className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black hover:opacity-90"
            >
              Get started
              <ChevronRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation overlay"
          />
          <aside className="absolute inset-y-0 left-0 w-[82vw] max-w-sm border-r border-white/10 bg-black p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-white/90">Navigation</span>
              <button
                type="button"
                className="rounded-md border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation"
              >
                <XIcon className="size-4" />
              </button>
            </div>
            <SidebarNav activeHeading={activeHeading} onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      {/* Page */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)_240px]">
        <aside className="sticky top-20 hidden h-[calc(100dvh-5rem)] overflow-auto pr-4 md:block">
          <SidebarNav activeHeading={activeHeading} />
        </aside>

        <main className="min-w-0">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Docs layout variant
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Vercel-style docs shell
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
              This route is a WIP “alternate docs theme” with a dark header, left nav, and a
              lightweight on-page TOC. It doesn’t replace your main docs at{' '}
              <span className="font-medium text-white/80">/docs</span>; it’s just a style
              playground.
            </p>
          </div>

          <Article />
        </main>

        <nav className="sticky top-20 hidden h-[calc(100dvh-5rem)] overflow-auto pl-4 lg:block">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/50">
            On this page
          </div>
          <ul className="mt-4 space-y-2">
            {toc.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    'block rounded-md px-2 py-1 text-sm transition-colors',
                    activeHeading === item.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 text-sm text-white/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Unify</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/docs/getting-started" className="hover:text-white">
              Docs
            </Link>
            <Link to="/status" className="hover:text-white">
              Status
            </Link>
            <Link to="/support" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SidebarNav({
  activeHeading,
  onNavigate,
}: {
  activeHeading: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-6">
      {sidebar.map((group) => (
        <div key={group.label}>
          <div className="text-xs font-semibold uppercase tracking-widest text-white/50">
            {group.label}
          </div>
          <ul className="mt-3 space-y-1.5">
            {group.items.map((item) => {
              const isHash = item.href.startsWith('#');
              const isActive = isHash && activeHeading === item.href;
              const cls = cn(
                'block rounded-md px-2 py-1 text-sm transition-colors',
                isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white',
              );

              if (isHash) {
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={cls}
                      onClick={() => {
                        onNavigate?.();
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link to={item.href} className={cls} onClick={() => onNavigate?.()}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Article() {
  return (
    <article className="space-y-10">
      <Section
        id="introduction"
        title="Introduction"
        description="Unify is a Kotlin-first toolkit for Paper/Spigot plugin development. This page is sample content to validate the layout."
      >
        <Callout>
          If you want this layout to render your real docs pages, we can convert this route into a
          nested router (e.g. `/differentstyles/$`) and reuse your MDX loader.
        </Callout>
      </Section>

      <Section id="installation" title="Installation" description="Add Unify to your plugin project.">
        <p className="text-sm leading-relaxed text-white/70">
          Use your preferred build tool. The example below is intentionally short and styled like
          Vercel’s docs blocks.
        </p>
        <CodeBlockDark
          filename="build.gradle.kts"
          code={`repositories {
    mavenCentral()
}

dependencies {
    implementation("com.yourorg:unify:VERSION")
}`}
        />
      </Section>

      <Section
        id="first-command"
        title="First command"
        description="A minimal command that opens a menu."
      >
        <CodeBlockDark
          filename="ShopCommand.kt"
          code={`@CommandAlias("shop")
@CommandPermission("myplugin.shop")
class ShopCommand : BaseCommand() {

    @Default
    fun onShop(player: Player) {
        ShopMenu().openMenu(player)
    }
}`}
        />
      </Section>

      <Section
        id="menus"
        title="Menus"
        description="Composable, paginated inventories with sane defaults."
      >
        <p className="text-sm leading-relaxed text-white/70">
          A key part of the Vercel-docs vibe is consistent spacing, subtle borders, and content that
          stays readable at wide widths.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureTile title="Paginated layouts" description="Bordered + paginated menus out of the box." />
          <FeatureTile title="Back navigation" description="Built-in back button patterns for UX consistency." />
          <FeatureTile title="Placeholders" description="Use filler items without repeating boilerplate." />
          <FeatureTile title="Chainable buttons" description="Small helpers that keep click handlers tidy." />
        </div>
      </Section>

      <Section
        id="scheduling"
        title="Scheduling"
        description="Quickly run tasks sync/async without ceremony."
      >
        <CodeBlockDark
          filename="Tasks.kt"
          code={`// Run later
Tasks.runLater(20L) {
    player.sendMessage(CC.translate("&aHello in 1 second"))
}

// Run async
Tasks.runAsync {
    val data = fetchSomething()
    Tasks.run {
        player.sendMessage("Loaded: $data")
    }
}`}
        />
      </Section>

      <Section
        id="config"
        title="Config"
        description="Type-safe patterns to keep YAML from becoming stringly-typed."
      >
        <p className="text-sm leading-relaxed text-white/70">
          If you want, we can wire this layout to your real docs source and keep the sidebar in
          sync with the actual page tree.
        </p>
      </Section>
    </article>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-2 text-sm text-white/60">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/70">
      {children}
    </div>
  );
}

function FeatureTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <div className="mt-1 text-sm text-white/60">{description}</div>
    </div>
  );
}

function CodeBlockDark({
  code,
  filename,
  lang = 'kotlin',
}: {
  code: string;
  filename?: string;
  lang?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-white/5">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="size-2.5 rounded-full bg-neutral-700" />
        <div className="size-2.5 rounded-full bg-neutral-700" />
        <div className="size-2.5 rounded-full bg-neutral-700" />
        {filename && <span className="ml-3 text-xs text-white/45">{filename}</span>}
      </div>
      <div className="text-sm leading-relaxed">
        <DynamicCodeBlock lang={lang} code={code.trimEnd()} />
      </div>
    </div>
  );
}

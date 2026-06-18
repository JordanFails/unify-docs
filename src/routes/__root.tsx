import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import appCss from '@/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { Banner } from 'fumadocs-ui/components/banner';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Unify Docs' },
      {
        name: 'description',
        content:
          'Documentation for Unify — a Kotlin library for Paper & Spigot plugins with cross-version NMS, menus, and utilities.',
      },
      { property: 'og:title', content: 'Unify Docs' },
      {
        property: 'og:description',
        content: 'Build Minecraft plugins faster with Unify.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider search={{ options: { api: '/api/search' } }}>
          <Banner id="unify-wip" height="2rem" className="bg-fd-background/80 text-fd-foreground border-b border-fd-border">
            <span className="text-fd-foreground/70">
              Documentation is a work in progress — some pages may be incomplete.
            </span>
          </Banner>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}

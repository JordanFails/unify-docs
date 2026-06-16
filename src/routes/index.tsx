import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { CodeBlock } from '@/components/code-block';
import { PaletteIcon, BoxIcon, LayersIcon, FileCodeIcon, ClockIcon, TerminalIcon } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-28 text-center md:py-36">
          {/* Subtle background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10">
            <div className="animate-hero inline-flex items-center gap-2 rounded-full border bg-fd-secondary px-4 py-1.5 text-xs font-medium text-fd-muted-foreground mb-8">
              🚀 Kotlin library for Paper & Spigot
            </div>
            <h1 className="animate-hero delay-100 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl max-w-4xl">
              Build Minecraft plugins{' '}
              <span className="bg-gradient-to-r from-fd-primary to-blue-400 bg-clip-text text-transparent">
                faster
              </span>
              , with less boilerplate
            </h1>
            <p className="animate-hero delay-200 mt-6 max-w-2xl text-lg text-fd-muted-foreground leading-relaxed">
              Unify provides cross-version NMS handling, a powerful menu system,
              color translation, fluid item builders, and scheduling shortcuts —
              so you can focus on gameplay, not infrastructure.
            </p>
            <div className="animate-hero delay-300 mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/docs/getting-started"
                className="hover-glow inline-flex items-center gap-2 rounded-xl bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-lg shadow-fd-primary/20 transition-all hover:brightness-110"
              >
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <Link
                to="/docs/core-features"
                className="hover-lift inline-flex items-center gap-2 rounded-xl border bg-fd-card px-6 py-3 text-sm font-medium text-fd-foreground transition-all hover:bg-fd-accent"
              >
                Browse Features
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-28">
          <div className="mb-14 text-center">
            <span className="animate-fade-in-up inline-block text-xs font-medium uppercase tracking-widest text-fd-primary">
              Features
            </span>
            <h2 className="animate-fade-in-up delay-100 mt-3 text-2xl font-bold">Everything you need, bundled</h2>
            <p className="animate-fade-in-up delay-200 mt-2 text-fd-muted-foreground">
              Unify ships with the utilities you reach for in every plugin.
            </p>
          </div>

          <Cards>
            <div className="animate-fade-in-up delay-100">
              <Card
                icon={<PaletteIcon className="h-4 w-4" />}
                title="Color Translation"
                description="Legacy &-codes, hex, gradients, and MiniMessage — all through one CC.translate() call."
                href="/docs/core-features#cc--color-translation"
              />
            </div>
            <div className="animate-fade-in-up delay-200">
              <Card
                icon={<BoxIcon className="h-4 w-4" />}
                title="Item Builder"
                description="Chainable ItemStack creation with name, lore, enchants, glow, and unbreakable — no boilerplate."
                href="/docs/core-features#itembuilder--fluid-itemstack-creation"
              />
            </div>
            <div className="animate-fade-in-up delay-300">
              <Card
                icon={<LayersIcon className="h-4 w-4" />}
                title="Menu System"
                description="Paginated, bordered GUIs with buttons, back navigation, and placeholders. Build shops, settings, and more."
                href="/docs/menu-system"
              />
            </div>
            <div className="animate-fade-in-up delay-400">
              <Card
                icon={<FileCodeIcon className="h-4 w-4" />}
                title="Config Wrapper"
                description="Type-safe YAML wrapper with an enum-based pattern for Voyage-style configuration."
                href="/docs/core-features#config--yaml-wrapper"
              />
            </div>
            <div className="animate-fade-in-up delay-500">
              <Card
                icon={<ClockIcon className="h-4 w-4" />}
                title="Scheduling"
                description="Tasks.run(), Tasks.runAsync(), Tasks.runTimer() — Bukkit scheduler without the ceremony."
                href="/docs/core-features#tasks--scheduling-shortcuts"
              />
            </div>
            <div className="animate-fade-in-up delay-600">
              <Card
                icon={<TerminalIcon className="h-4 w-4" />}
                title="ACF Commands"
                description="Aikar Command Framework wrapper with automatic tab-completion, permissions, and context resolvers."
                href="/docs/core-features#acf-commands"
              />
            </div>
          </Cards>
        </section>

        {/* Code Preview */}
        <section className="border-t bg-fd-card/50 px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <span className="animate-fade-in-up inline-block text-xs font-medium uppercase tracking-widest text-fd-primary">
                Example
              </span>
              <h2 className="animate-fade-in-up delay-100 mt-3 text-2xl font-bold">See it in action</h2>
              <p className="animate-fade-in-up delay-200 mt-2 text-fd-muted-foreground">
                A complete menu + command in under 40 lines.
              </p>
            </div>

            <div className="animate-scale-in delay-300">
              <CodeBlock code={`@CommandAlias("shop")
@CommandPermission("myplugin.shop")
class ShopCommand : BaseCommand() {

    @Default
    fun onShop(player: Player) {
        ShopMenu().openMenu(player)
    }
}

class ShopMenu : PaginatedBorderedMenu() {

    override fun getPrePaginatedTitle(player: Player): String =
        CC.translate("&6&lShop")

    override fun getAllPagesButtons(player: Player): MutableMap<Int, Button> {
        val buttons = mutableMapOf<Int, Button>()
        for ((index, mat) in items.withIndex()) {
            buttons[index] = object : Button() {
                override fun getName(...) = CC.translate("&e\${mat.name}")
                override fun getMaterial(...) = mat
                override fun clicked(...) { /* handle purchase */ }
            }
        }
        return buttons
    }
}`} />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-5 px-6 py-24 text-center">
          <h2 className="animate-fade-in-up text-2xl font-bold">Ready to build?</h2>
          <p className="animate-fade-in-up delay-100 max-w-md text-fd-muted-foreground leading-relaxed">
            Head over to the getting started guide to add Unify to your project
            and write your first plugin.
          </p>
          <Link
            to="/docs/getting-started"
            className="animate-scale-in delay-200 hover-glow inline-flex items-center gap-2 rounded-xl bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-lg shadow-fd-primary/20 transition-all hover:brightness-110"
          >
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t px-6 py-8 text-center text-sm text-fd-muted-foreground">
          <p>Unify is open source on{' '}
            <a href="https://github.com/JordanFails/Unify" className="hover-underline underline underline-offset-2 hover:text-fd-foreground" target="_blank" rel="noreferrer">
              GitHub
            </a>.
          </p>
        </footer>
      </main>
    </HomeLayout>
  );
}

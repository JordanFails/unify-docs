import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { CodeBlock } from '@/components/code-block';
import {
  PaletteIcon,
  BoxIcon,
  LayersIcon,
  FileCodeIcon,
  ClockIcon,
  TerminalIcon,
  ArrowRightIcon,
} from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Hero */}
        <section className="relative border-b px-6 py-24 text-center md:py-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.08,transparent_60%)]"
          />
          <div className="mx-auto max-w-3xl">
            <div className="animate-hero mb-6 inline-flex items-center gap-2 rounded-full border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
              Kotlin library for Paper & Spigot
            </div>
            <h1 className="animate-hero delay-100 text-4xl font-bold tracking-tight sm:text-5xl">
              Build Minecraft plugins with{' '}
              <span className="text-fd-primary">Unify</span>
            </h1>
            <p className="animate-hero delay-200 mx-auto mt-5 max-w-2xl text-lg text-fd-muted-foreground leading-relaxed">
              Cross-version NMS handling, menus, color translation, item builders,
              and scheduling — bundled so you can focus on gameplay.
            </p>
            <div className="animate-hero delay-300 mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/docs/getting-started"
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                Get Started
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                to="/docs/core-features"
                className="inline-flex items-center gap-2 rounded-lg border bg-fd-card px-5 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
              >
                Browse Features
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto w-full max-w-5xl px-6 py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Everything you need, bundled</h2>
            <p className="mt-2 text-fd-muted-foreground">
              Utilities you reach for in every plugin, ready out of the box.
            </p>
          </div>

          <Cards>
            <Card
              icon={<PaletteIcon className="size-4" />}
              title="Color Translation"
              description="Legacy &-codes, hex, gradients, and MiniMessage through CC.translate()."
              href="/docs/core-features#cc--color-translation"
            />
            <Card
              icon={<BoxIcon className="size-4" />}
              title="Item Builder"
              description="Chainable ItemStack creation with name, lore, enchants, and glow."
              href="/docs/core-features#itembuilder--fluid-itemstack-creation"
            />
            <Card
              icon={<LayersIcon className="size-4" />}
              title="Menu System"
              description="Paginated, bordered GUIs with buttons, back navigation, and placeholders."
              href="/docs/menu-system"
            />
            <Card
              icon={<FileCodeIcon className="size-4" />}
              title="Config Wrapper"
              description="Type-safe YAML wrapper with an enum-based configuration pattern."
              href="/docs/core-features#config--yaml-wrapper"
            />
            <Card
              icon={<ClockIcon className="size-4" />}
              title="Scheduling"
              description="Tasks.run(), Tasks.runAsync(), Tasks.runTimer() without the ceremony."
              href="/docs/core-features#tasks--scheduling-shortcuts"
            />
            <Card
              icon={<TerminalIcon className="size-4" />}
              title="ACF Commands"
              description="Command framework wrapper with tab-completion, permissions, and resolvers."
              href="/docs/core-features#acf-commands"
            />
          </Cards>
        </section>

        {/* Code Preview */}
        <section className="border-t bg-fd-card/40 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">See it in action</h2>
              <p className="mt-2 text-fd-muted-foreground">
                A complete menu and command in under 40 lines.
              </p>
            </div>

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
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 border-t px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to build?</h2>
          <p className="max-w-md text-fd-muted-foreground">
            Add Unify to your project and write your first plugin in minutes.
          </p>
          <Link
            to="/docs/getting-started"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
            <ArrowRightIcon className="size-4" />
          </Link>
        </section>
      </main>
    </HomeLayout>
  );
}

import { createFileRoute, Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
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
  SparklesIcon,
  ShieldCheckIcon,
  Wand2Icon,
} from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Hero */}
        <section className="relative border-b px-6 py-20 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.10,transparent_60%)]"
          />
          <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
                <SparklesIcon className="size-3.5 text-fd-primary" />
                Docs & guides
              </div>

              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Build plugins faster with <span className="text-fd-primary">Unify</span>.
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-fd-muted-foreground">
                A focused toolkit and documentation set — designed to help you ship features quickly
                without getting lost in setup details.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/docs/getting-started"
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
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

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Hint
                  icon={<ShieldCheckIcon className="size-4 text-fd-primary" />}
                  title="Stable defaults"
                  body="Sane patterns you can rely on."
                />
                <Hint
                  icon={<Wand2Icon className="size-4 text-fd-primary" />}
                  title="Fast to adopt"
                  body="Small surface area, easy to learn."
                />
                <Hint
                  icon={<TerminalIcon className="size-4 text-fd-primary" />}
                  title="Built for DX"
                  body="Clear primitives that compose well."
                />
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.18,transparent_60%)]"
              />
              <CodeBlock
                code={`@CommandAlias("hello")
class HelloCommand : BaseCommand() {

    @Default
    fun run(player: Player) {
        player.sendMessage(CC.translate("&9Hello from &fUnify&9."))
        Tasks.runLater(20L) {
            player.sendMessage(CC.translate("&7Tip: open &f/shop &7to see menus."))
        }
    }
}`}
              />
              <p className="mt-3 text-center text-xs text-fd-muted-foreground">
                Small examples, real patterns.
              </p>
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
              description="Format and transform text output with consistent styling."
              href="/docs/core-features#cc--color-translation"
            />
            <Card
              icon={<BoxIcon className="size-4" />}
              title="Item Builder"
              description="Create structured objects with a fluent, ergonomic API."
              href="/docs/core-features#itembuilder--fluid-itemstack-creation"
            />
            <Card
              icon={<LayersIcon className="size-4" />}
              title="Menu System"
              description="Composable UI patterns for common interactive flows."
              href="/docs/menu-system"
            />
            <Card
              icon={<FileCodeIcon className="size-4" />}
              title="Config Wrapper"
              description="Keep configuration predictable and easy to validate."
              href="/docs/core-features#config--yaml-wrapper"
            />
            <Card
              icon={<ClockIcon className="size-4" />}
              title="Scheduling"
              description="Run work when you need it, without extra boilerplate."
              href="/docs/core-features#tasks--scheduling-shortcuts"
            />
            <Card
              icon={<TerminalIcon className="size-4" />}
              title="ACF Commands"
              description="Organize user actions with a clean command surface."
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
                A minimal example you can adapt quickly.
              </p>
            </div>

            <CodeBlock code={`@CommandAlias("shop")
class ShopCommand : BaseCommand() {

    @Default
    fun open(player: Player) {
        ShopMenu().openMenu(player)
    }
}

class ShopMenu : PaginatedBorderedMenu() {

    override fun getPrePaginatedTitle(player: Player): String =
        CC.translate("&9&lShop")

    override fun getAllPagesButtons(player: Player): MutableMap<Int, Button> {
        val buttons = mutableMapOf<Int, Button>()
        for ((i, item) in items.withIndex()) {
            buttons[i] = object : Button() {
                override fun getButtonItem(player: Player): ItemStack =
                    ItemBuilder(item)
                        .name(CC.translate("&fItem &9#${'$'}i"))
                        .build()

                override fun clicked(player: Player, slot: Int, clickType: ClickType, hotbarButton: Int) {
                    player.sendMessage(CC.translate("&7Clicked item &f#${'$'}i"))
                }
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
            className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            Get Started
            <ArrowRightIcon className="size-4" />
          </Link>
        </section>
      </main>
    </HomeLayout>
  );
}

function Hint({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border bg-fd-card/60 p-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-xs text-fd-muted-foreground">{body}</p>
    </div>
  );
}

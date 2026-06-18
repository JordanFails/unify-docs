'use client';

import { Link } from '@tanstack/react-router';
import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { isLinkItemActive, type LinkItemType } from 'fumadocs-ui/layouts/shared';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { SidebarIcon } from 'lucide-react';
import { usePathname } from 'fumadocs-core/framework';

function isSecondary(item: LinkItemType) {
  return 'secondary' in item && item.secondary === true;
}

function NavLink({ item, className }: { item: LinkItemType; className?: string }) {
  const pathname = usePathname();
  const active = isLinkItemActive(item, pathname);

  if (item.type === 'custom') return <>{item.children}</>;
  if (item.type === 'menu') {
    // keep it simple for now; your baseOptions only uses main items
    return null;
  }

  const shared = cn(
    'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
    active ? 'text-white' : 'text-white/70 hover:text-white',
    className,
  );

  if (item.external) {
    return (
      <a href={item.url} className={shared} rel="noreferrer" target="_blank">
        {'icon' in item && item.icon}
        {item.text}
      </a>
    );
  }

  return (
    <Link to={item.url} className={shared}>
      {'icon' in item && item.icon}
      {item.text}
    </Link>
  );
}

export function DocsNavbar(props: ComponentProps<'header'>) {
  const { props: layoutProps, slots, navItems, isNavTransparent } = useDocsLayout();

  const main = navItems.filter((i) => !isSecondary(i) && i.type !== 'icon' && i.type !== 'button');
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    lastYRef.current = window.scrollY ?? 0;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY ?? 0;
        const delta = y - lastYRef.current;

        // Always show at the very top.
        if (y < 8) {
          setHidden(false);
        } else if (delta > 8) {
          // scrolling down
          setHidden(true);
        } else if (delta < -8) {
          // scrolling up
          setHidden(false);
        }

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent}
      data-hidden={hidden}
      {...props}
      className={cn(
        // Stick beneath the optional `Banner` (sets --fd-banner-height)
        '[grid-area:header] sticky top-(--fd-banner-height,0px) z-30 flex h-14 items-center gap-3 border-b border-fd-border backdrop-blur-md will-change-transform',
        isNavTransparent ? 'bg-fd-background/40' : 'bg-fd-background/70',
        'px-4 md:px-6',
        'transition-[transform,opacity,filter] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
        hidden && '-translate-y-full opacity-0 pointer-events-none blur-[1px]',
        props.className,
      )}
    >
      <nav className="hidden items-center gap-1.5 md:flex">
        {main.map((item) => (
          <NavLink key={`${item.type}-${item.url ?? ''}-${String(item.text)}`} item={item} />
        ))}
      </nav>

      <div className="flex-1" />

      <div className="ml-auto flex items-center gap-1.5 md:hidden">
        {slots.sidebar && (
          <slots.sidebar.trigger
            className={cn(
              buttonVariants({
                color: 'ghost',
                size: 'icon-sm',
                className: 'p-2 text-fd-muted-foreground hover:text-fd-foreground',
              }),
            )}
          >
            <SidebarIcon />
          </slots.sidebar.trigger>
        )}
      </div>
    </header>
  );
}


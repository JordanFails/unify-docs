'use client';

import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = ComponentProps<'button'>;

export function ThemeToggle({ className, ...props }: Props) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const next = useMemo(() => (isDark ? 'light' : 'dark'), [isDark]);
  const label = useMemo(() => (isDark ? 'Switch to light mode' : 'Switch to dark mode'), [isDark]);

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-fd-border bg-fd-secondary/50 p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent/60 hover:text-fd-foreground',
        className,
      )}
      onClick={() => setTheme(next)}
      {...props}
    >
      {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </button>
  );
}


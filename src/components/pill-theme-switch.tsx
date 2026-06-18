'use client';

import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

// Matches fumadocs `ThemeSwitchProps` shape (div props), but renders a single toggle button.
export function PillThemeSwitch({ className, ...props }: ComponentProps<'div'>) {
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
        'size-6.5 p-1.5 text-fd-muted-foreground rounded-md transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
      onClick={() => setTheme(next)}
      {...props}
    >
      {isDark ? <SunIcon className="size-full" /> : <MoonIcon className="size-full" />}
    </button>
  );
}


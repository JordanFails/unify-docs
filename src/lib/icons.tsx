import { createElement } from 'react';
import { icons } from 'lucide-react';

/**
 * Resolve an icon name or raw SVG string into a React node.
 *
 * - If `icon` starts with `<svg`, it's rendered as-is (raw SVG).
 * - Otherwise, it's looked up in `lucide-react`.
 */
export function resolveIcon(icon?: string): React.ReactNode {
  if (!icon) return undefined;

  // Raw SVG string — render directly
  if (icon.trim().startsWith('<svg')) {
    return (
      <span
        className="size-4 shrink-0"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  }

  // Lucide icon lookup
  const Icon = (icons as Record<string, React.FC<{ className?: string }>>)[icon];
  if (!Icon) {
    console.warn(`[icon-plugin] Unknown icon: ${icon}`);
    return undefined;
  }

  return createElement(Icon, { className: 'size-4 shrink-0' });
}

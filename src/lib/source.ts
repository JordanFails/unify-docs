import { createElement } from 'react';
import { loader } from 'fumadocs-core/source';
import { docs } from 'collections/server';
import { customIconsPlugin } from './icon-plugin.tsx';
import { docsRoute } from './shared';

const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  plugins: [customIconsPlugin()],
});

// ── Dual-icon support: gray inactive + brand active for storage backends ──
const dualIconMap = new Map<string, { inactive: string; active: string }>();
for (const page of source.getPages()) {
  const data = page.data as Record<string, unknown>;
  if (data?.activeIcon && data?.icon) {
    dualIconMap.set(page.url, {
      inactive: data.icon as string,
      active: data.activeIcon as string,
    });
  }
}

function walkTree(nodes: any[] | any) {
  const arr = Array.isArray(nodes) ? nodes : [nodes];
  for (const node of arr) {
    if (!node) continue;
    if (node.type === 'page' && dualIconMap.has(node.url)) {
      const { inactive, active } = dualIconMap.get(node.url)!;
      node.icon = createElement(
        'span',
        { className: 'relative block size-4 shrink-0' },
        createElement('span', {
          className:
            'fd-sidebar-icon-inactive absolute inset-0 flex items-center justify-center',
          dangerouslySetInnerHTML: { __html: inactive },
        }),
        createElement('span', {
          className:
            'fd-sidebar-icon-active absolute inset-0 flex items-center justify-center hidden',
          dangerouslySetInnerHTML: { __html: active },
        })
      );
    }
    if (node.children && Array.isArray(node.children)) walkTree(node.children);
  }
}

walkTree(source.pageTree);

export { source };

export function markdownPathToSlugs(segs: string[]) {
  if (segs.length === 0) return [];

  const out = [...segs];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, '');
  if (out.length === 1 && out[0] === 'index') out.pop();
  return out;
}

export function slugsToMarkdownPath(slugs: string[]) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push('index.md');
  } else {
    segments[segments.length - 1] += '.md';
  }

  return {
    segments,
    url: `${docsRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

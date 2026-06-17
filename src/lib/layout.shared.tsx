import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, docsRoute, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2.5 font-semibold">
          <img src="/logo.svg" alt="" width={24} height={24} className="rounded-md" />
          {appName}
        </span>
      ),
      transparentMode: 'top',
    },
    links: [
      {
        text: 'Documentation',
        url: `${docsRoute}/getting-started`,
        active: 'nested-url',
      },
      {
        text: 'Status',
        url: '/status',
        active: 'url',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

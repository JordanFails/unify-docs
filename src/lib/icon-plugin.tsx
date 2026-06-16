import { resolveIcon } from './icons';

export function customIconsPlugin() {
  function replaceIcon(node: { icon?: string | React.ReactNode }) {
    if (node.icon === undefined || typeof node.icon === 'string') {
      node.icon = resolveIcon(node.icon as string | undefined);
    }
    return node;
  }

  return {
    name: 'fumadocs:custom-icons',
    transformPageTree: {
      file: replaceIcon,
      folder: replaceIcon,
      separator: replaceIcon,
    },
  };
}

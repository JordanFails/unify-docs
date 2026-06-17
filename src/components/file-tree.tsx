import { createContext, useContext, useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import { Icon } from '@/lib/vscode-icons';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  code?: string;
  loader?: () => Promise<string>;
  lang?: string;
  note?: string;
  children?: FileTreeNode[];
}

interface FileTreeContextValue {
  selectedPath: string | null;
  setSelectedPath: (path: string | null) => void;
}

const FileTreeContext = createContext<FileTreeContextValue>({
  selectedPath: null,
  setSelectedPath: () => {},
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function countChildren(node: FileTreeNode): number {
  if (!node.children) return 0;
  return node.children.reduce(
    (acc, child) => acc + (child.type === 'file' ? 1 : countChildren(child)),
    0,
  );
}

function getFileColor(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'kt':
    case 'kts':
      return '#A97BFF';
    case 'java':
      return '#F76D57';
    case 'json':
      return '#F8C555';
    case 'gradle':
      return '#00D9A5';
    case 'yml':
    case 'yaml':
      return '#EFB35A';
    case 'md':
    case 'mdx':
      return '#6CB6FF';
    case 'xml':
    case 'html':
      return '#E44D26';
    case 'sh':
    case 'bat':
    case 'ps1':
      return '#4EAA25';
    default:
      return '';
  }
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'kt':
    case 'kts':
      return <Icon icon="vscode-icons:file-type-kotlin" width={16} height={16} className="shrink-0" />;
    case 'java':
      return <Icon icon="vscode-icons:file-type-java" width={16} height={16} className="shrink-0" />;
    case 'json':
      return <Icon icon="vscode-icons:file-type-json" width={16} height={16} className="shrink-0" />;
    case 'gradle':
      return <Icon icon="vscode-icons:file-type-gradle" width={16} height={16} className="shrink-0" />;
    case 'yml':
    case 'yaml':
      return <Icon icon="vscode-icons:file-type-yaml" width={16} height={16} className="shrink-0" />;
    case 'md':
    case 'mdx':
      return <Icon icon="vscode-icons:file-type-markdown" width={16} height={16} className="shrink-0" />;
    case 'xml':
      return <Icon icon="vscode-icons:file-type-xml" width={16} height={16} className="shrink-0" />;
    case 'html':
      return <Icon icon="vscode-icons:file-type-html" width={16} height={16} className="shrink-0" />;
    case 'sh':
      return <Icon icon="vscode-icons:file-type-shell" width={16} height={16} className="shrink-0" />;
    case 'ps1':
      return <Icon icon="vscode-icons:file-type-powershell" width={16} height={16} className="shrink-0" />;
    default:
      return <Icon icon="vscode-icons:default-file" width={16} height={16} className="shrink-0" />;
  }
}

function folderIcon(_name: string, open: boolean) {
  return open ? (
    <FolderOpenIcon className="h-[15px] w-[15px] shrink-0 text-[#dcb67a]" />
  ) : (
    <FolderIcon className="h-[15px] w-[15px] shrink-0 text-[#dcb67a]" />
  );
}

function langFromName(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'kt':
    case 'kts':
      return 'kotlin';
    case 'java':
      return 'java';
    case 'gradle':
      return 'groovy';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'json':
      return 'json';
    case 'md':
    case 'mdx':
      return 'markdown';
    case 'xml':
      return 'xml';
    case 'html':
      return 'html';
    case 'sh':
      return 'bash';
    case 'ps1':
      return 'powershell';
    case 'bat':
      return 'batch';
    default:
      return 'text';
  }
}

/* ------------------------------------------------------------------ */
/*  FileName component                                                 */
/* ------------------------------------------------------------------ */

function FileName({ name, color }: { name: string; color?: string }) {
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex <= 0 || name.startsWith('.')) {
    return <span style={color ? { color } : undefined}>{name}</span>;
  }
  const base = name.slice(0, dotIndex);
  const ext = name.slice(dotIndex);
  return (
    <span>
      <span style={color ? { color } : undefined}>{base}</span>
      <span
        style={color ? { color, opacity: 0.6 } : undefined}
        className={!color ? 'text-fd-muted-foreground/50' : undefined}
      >
        {ext}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Node component                                                     */
/* ------------------------------------------------------------------ */

function Node({
  node,
  depth = 0,
  path = '',
}: {
  node: FileTreeNode;
  depth?: number;
  path?: string;
}) {
  const { selectedPath, setSelectedPath } = useContext(FileTreeContext);
  const [open, setOpen] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [loadedCode, setLoadedCode] = useState(node.code);
  const [isLoading, setIsLoading] = useState(false);

  const currentPath = path ? `${path}/${node.name}` : node.name;
  const isFolder = node.type === 'folder';
  const isSelected = selectedPath === currentPath;
  const hasCode = Boolean(loadedCode || node.loader);
  const fileColor = getFileColor(node.name);
  const indent = depth * 20;

  const handleClick = async () => {
    setSelectedPath(currentPath);

    if (isFolder) {
      setOpen(!open);
      return;
    }

    if (!hasCode) return;

    if (!showCode) {
      if (!loadedCode && node.loader) {
        setIsLoading(true);
        try {
          const code = await node.loader();
          setLoadedCode(code);
        } finally {
          setIsLoading(false);
        }
      }
      setShowCode(true);
    } else {
      setShowCode(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'group relative flex w-full items-center gap-1.5 rounded-md py-[3px] pr-2 text-left text-[13px] leading-5 select-none transition-all duration-150',
          (isFolder || hasCode) && 'cursor-pointer',
          !isFolder && !hasCode && 'cursor-default',
          'hover:bg-fd-accent/20',
          isSelected && 'bg-blue-500/10',
        )}
        style={{
          paddingLeft: isSelected ? `${indent + 4}px` : `${indent + 6}px`,
        }}
      >
        {/* Selected indicator */}
        {isSelected && (
          <span className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-blue-400" />
        )}

        {/* Expand chevron */}
        {isFolder ? (
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center text-fd-muted-foreground/60 transition-transform duration-150',
              !open && 'rotate-[-90deg]',
            )}
          >
            <ChevronRightIcon className="h-3 w-3" />
          </span>
        ) : (
          <span className="h-4 w-4" />
        )}

        {/* Icon */}
        <span className="flex h-4 w-4 items-center justify-center shrink-0">
          {isFolder ? folderIcon(node.name, open) : fileIcon(node.name)}
        </span>

        {/* Name */}
        <span
          className={cn(
            'font-normal',
            isFolder ? 'text-fd-foreground' : 'text-fd-muted-foreground',
          )}
        >
          <FileName name={node.name} color={fileColor} />
        </span>

        {/* File count on folders */}
        {isFolder && (
          <span className="ml-1 text-[11px] text-fd-muted-foreground/40">
            {countChildren(node)}
          </span>
        )}

        {/* Note */}
        {node.note && (
          <span className="ml-1.5 text-[11px] text-fd-muted-foreground/40">
            {node.note}
          </span>
        )}

        {/* Show/hide hint */}
        {!isFolder && hasCode && (
          <span className="ml-auto text-[10px] text-fd-muted-foreground/30 opacity-0 transition-opacity group-hover:opacity-100">
            {isLoading ? 'loading…' : showCode ? 'hide' : 'show'}
          </span>
        )}
      </button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isFolder && open && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative overflow-hidden"
          >
            {/* Indentation guide */}
            <div
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-fd-border/70 via-fd-border/30 to-transparent"
              style={{ left: `${indent + 14}px` }}
            />
            {node.children.map((child, i) => (
              <Node
                key={`${child.name}-${i}`}
                node={child}
                depth={depth + 1}
                path={currentPath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline code preview */}
      <AnimatePresence initial={false}>
        {!isFolder && showCode && loadedCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-md border border-fd-border/60 bg-fd-background"
            style={{
              marginLeft: `${indent + 32}px`,
              marginRight: '8px',
              marginTop: '2px',
              marginBottom: '6px',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-fd-border/40 bg-fd-muted/20 px-3 py-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center">
                  {fileIcon(node.name)}
                </span>
                <span className="text-[11px] text-fd-foreground/80">{node.name}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-fd-muted-foreground/50">
                {node.lang ?? langFromName(node.name)}
              </span>
            </div>

            {/* Code */}
            <div className="text-[12px]">
              <Suspense
                fallback={
                  <pre className="overflow-x-auto p-3 text-[11px] leading-[1.6] font-mono">
                    <code className="text-fd-foreground/80">{loadedCode}</code>
                  </pre>
                }
              >
                <DynamicCodeBlock
                  lang={node.lang ?? langFromName(node.name)}
                  code={loadedCode.trimEnd()}
                />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FileTree export                                                    */
/* ------------------------------------------------------------------ */

export function FileTree({ tree }: { tree: FileTreeNode[] }) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <FileTreeContext.Provider value={{ selectedPath, setSelectedPath }}>
      <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-card">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-fd-border/60 px-3 py-2">
          <div className="h-[7px] w-[7px] rounded-full bg-red-400/80" />
          <div className="h-[7px] w-[7px] rounded-full bg-yellow-400/80" />
          <div className="h-[7px] w-[7px] rounded-full bg-green-400/80" />
          <span className="ml-1.5 text-[11px] font-medium text-fd-muted-foreground/50">
            Project
          </span>
        </div>

        <div className="py-1">
          {tree.map((node, i) => (
            <Node key={`${node.name}-${i}`} node={node} />
          ))}
        </div>
      </div>
    </FileTreeContext.Provider>
  );
}

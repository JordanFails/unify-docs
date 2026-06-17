import { createElement, useState, Suspense } from 'react';
import { cn } from '@/lib/cn';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import {
  FileCodeIcon,
  FileJsonIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  ChevronRightIcon,
} from 'lucide-react';

interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  code?: string;
  lang?: string;
  note?: string;
  children?: FileTreeNode[];
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'kt':
      return <span className="text-purple-400"><CoffeeIcon /></span>;
    case 'kts':
    case 'gradle':
      return <span className="text-emerald-400"><BracesIcon /></span>;
    case 'yml':
    case 'yaml':
      return <span className="text-amber-400"><FileTextIcon /></span>;
    case 'json':
      return <span className="text-yellow-400"><FileJsonIcon /></span>;
    case 'java':
      return <span className="text-red-400"><CoffeeIcon /></span>;
    case 'md':
    case 'mdx':
      return <span className="text-blue-400"><FileTextIcon /></span>;
    case 'xml':
    case 'html':
      return <span className="text-orange-400"><CodeIcon /></span>;
    case 'sh':
    case 'bat':
    case 'ps1':
      return <span className="text-green-400"><TerminalIcon /></span>;
    default:
      return <span className="text-fd-muted-foreground"><FileCodeIcon /></span>;
  }
}

function FileName({ name }: { name: string }) {
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex <= 0 || name.startsWith('.')) {
    return <span>{name}</span>;
  }
  const base = name.slice(0, dotIndex);
  const ext = name.slice(dotIndex);
  return (
    <span>
      {base}
      <span className="text-fd-muted-foreground/50">{ext}</span>
    </span>
  );
}

function Node({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) {
  const [open, setOpen] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const isFolder = node.type === 'folder';

  const indent = depth * 20;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (isFolder) setOpen(!open);
          else if (node.code) setShowCode(!showCode);
        }}
        className={cn(
          'group flex w-full items-center gap-1.5 rounded-md py-[3px] pr-2 text-left text-[13px] leading-5 transition-colors select-none',
          (isFolder || node.code) && 'cursor-pointer hover:bg-fd-accent/40',
          !isFolder && !node.code && 'cursor-default',
          showCode && 'bg-fd-accent/30',
        )}
        style={{ paddingLeft: `${indent + 6}px` }}
      >
        {/* Expand chevron */}
        {isFolder ? (
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center text-fd-muted-foreground/60 transition-transform',
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
          {isFolder ? (
            open ? (
              <FolderOpenIcon className="h-[15px] w-[15px] text-[#dcb67a]" />
            ) : (
              <FolderIcon className="h-[15px] w-[15px] text-[#dcb67a]" />
            )
          ) : (
            fileIcon(node.name)
          )}
        </span>

        {/* Name */}
        <span className={cn(
          'font-normal',
          isFolder ? 'text-fd-foreground' : 'text-fd-muted-foreground',
        )}>
          <FileName name={node.name} />
        </span>

        {node.note && (
          <span className="ml-1.5 text-[11px] text-fd-muted-foreground/40">
            {node.note}
          </span>
        )}

        {!isFolder && node.code && (
          <span className="ml-auto text-[10px] text-fd-muted-foreground/30 opacity-0 transition-opacity group-hover:opacity-100">
            {showCode ? 'hide' : 'show'}
          </span>
        )}
      </button>

      {/* Children */}
      {isFolder && open && node.children && (
        <div className="relative">
          {/* Guide line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-fd-border/40"
            style={{ left: `${indent + 14}px` }}
          />
          {node.children.map((child, i) => (
            <Node key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}

      {/* Inline code */}
      {!isFolder && showCode && node.code && (
        <div
          className="overflow-hidden rounded-md border border-fd-border/60 bg-fd-background"
          style={{ marginLeft: `${indent + 32}px`, marginRight: '8px', marginTop: '2px', marginBottom: '6px' }}
        >
          <div className="flex items-center gap-1.5 border-b border-fd-border/40 bg-fd-muted/20 px-3 py-1">
            <div className="h-[7px] w-[7px] rounded-full bg-red-400/80" />
            <div className="h-[7px] w-[7px] rounded-full bg-yellow-400/80" />
            <div className="h-[7px] w-[7px] rounded-full bg-green-400/80" />
            <span className="ml-2 text-[11px] text-fd-muted-foreground/60">{node.name}</span>
          </div>
          <div className="text-[12px]">
            <Suspense fallback={
              <pre className="overflow-x-auto p-3 text-[11px] leading-[1.6] font-mono">
                <code className="text-fd-foreground/80">{node.code}</code>
              </pre>
            }>
              <DynamicCodeBlock
                lang={node.lang ?? langFromName(node.name)}
                code={node.code.trimEnd()}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon helpers (small inline components)
function CoffeeIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>; }
function BracesIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>; }
function CodeIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>; }
function TerminalIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>; }

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

export function FileTree({ tree }: { tree: FileTreeNode[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-card">
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
  );
}

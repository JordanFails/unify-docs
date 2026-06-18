import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

export function CodeBlock({ code, lang = 'kotlin' }: { code: string; lang?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-fd-background shadow-sm">
      <div className="flex items-center gap-2 border-b bg-fd-muted/50 px-4 py-2.5">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-yellow-400" />
        <div className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-fd-muted-foreground">ShopMenu.kt</span>
      </div>
      <div className="text-sm leading-relaxed">
        <DynamicCodeBlock lang={lang} code={code.trimEnd()} />
      </div>
    </div>
  );
}

import Prism from 'prismjs';
import 'prismjs/components/prism-kotlin';

// Load the theme CSS
const themeCss = `
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata { color: #6e7681; }
.token.punctuation { color: #e1e4e8; }
.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted { color: #79c0ff; }
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted { color: #a5d6ff; }
.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string { color: #e1e4e8; }
.token.atrule,
.token.attr-value,
.token.keyword { color: #ff7b72; }
.token.function,
.token.class-name { color: #d2a8ff; }
.token.regex,
.token.important,
.token.variable { color: #ffa657; }
.token.important,
.token.bold { font-weight: bold; }
.token.italic { font-style: italic; }
.token.entity { cursor: help; }
`;

export function CodeBlock({ code, lang = 'kotlin' }: { code: string; lang?: string }) {
  const langObj = Prism.languages[lang] || Prism.languages.kotlin;
  const highlighted = Prism.highlight(code, langObj, lang);

  return (
    <div className="overflow-hidden rounded-xl border bg-fd-background shadow-sm">
      <div className="flex items-center gap-2 border-b bg-fd-muted/50 px-4 py-2.5">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-yellow-400" />
        <div className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-fd-muted-foreground">ShopMenu.kt</span>
      </div>
      <style>{themeCss}</style>
      <pre
        className="overflow-x-auto p-5 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}

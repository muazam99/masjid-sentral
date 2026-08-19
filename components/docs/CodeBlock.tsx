import { cn } from "@/lib/utils"

type Token = { text: string; className: string }

const JSON_TOKEN_REGEX =
  /("(\\u[a-fA-F0-9]{4}|\\.|[^\\"])*"(\s*:)?)|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

function tokenizeJson(code: string): Token[] {
  const tokens: Token[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  JSON_TOKEN_REGEX.lastIndex = 0
  while ((match = JSON_TOKEN_REGEX.exec(code))) {
    if (match.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, match.index), className: "" })
    }

    const value = match[0]
    let className = "text-amber-300"
    if (value.startsWith('"')) {
      className = value.trimEnd().endsWith(":") ? "text-sky-300" : "text-emerald-300"
    } else if (value === "true" || value === "false") {
      className = "text-purple-300"
    } else if (value === "null") {
      className = "text-rose-300"
    }

    tokens.push({ text: value, className })
    lastIndex = match.index + value.length
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), className: "" })
  }

  return tokens
}

const BASH_TOKEN_REGEX = /'[^']*'|(-{1,2}[\w-]+)|\b(curl)\b/g

function tokenizeBash(code: string): Token[] {
  const tokens: Token[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  BASH_TOKEN_REGEX.lastIndex = 0
  while ((match = BASH_TOKEN_REGEX.exec(code))) {
    if (match.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, match.index), className: "" })
    }

    const value = match[0]
    let className = "text-emerald-300"
    if (value.startsWith("-")) className = "text-sky-300"
    else if (value === "curl") className = "text-purple-300 font-semibold"

    tokens.push({ text: value, className })
    lastIndex = match.index + value.length
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), className: "" })
  }

  return tokens
}

export function CodeBlock({
  code,
  lang = "json",
  className,
}: {
  code: string
  lang?: "json" | "bash"
  className?: string
}) {
  const tokens = lang === "json" ? tokenizeJson(code) : tokenizeBash(code)

  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg bg-ms-code p-4 text-xs leading-relaxed text-ms-sage dark:bg-ms-code-dark",
        className
      )}
    >
      <code>
        {tokens.map((token, i) => (
          <span key={i} className={token.className}>
            {token.text}
          </span>
        ))}
      </code>
    </pre>
  )
}

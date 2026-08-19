import { Badge } from "@/components/ui/badge"
import { methodClassName } from "./methodStyles"
import type { DocEndpoint } from "@/lib/openapi"

export function EndpointHeader({ endpoint }: { endpoint: DocEndpoint }) {
  const { method, path, operation } = endpoint

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge className={`${methodClassName(method)} rounded-md px-2.5 py-1 text-xs font-mono`}>
          {method}
        </Badge>
        <code className="font-mono text-sm text-muted-foreground">{path}</code>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{operation.summary}</h1>
      {operation.description && (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {operation.description}
        </p>
      )}
      {operation.security && operation.security.length > 0 && (
        <p className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
          Requires a Bearer API key
        </p>
      )}
    </div>
  )
}

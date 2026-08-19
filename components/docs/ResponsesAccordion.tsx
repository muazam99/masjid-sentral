import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CodeBlock } from "./CodeBlock"
import { getResponseExample } from "@/lib/openapi"
import type { OpenApiOperation } from "@/lib/openapi"

function statusColor(status: string): string {
  if (status.startsWith("2")) return "text-emerald-600 dark:text-emerald-400"
  if (status.startsWith("4")) return "text-amber-600 dark:text-amber-400"
  if (status.startsWith("5")) return "text-rose-600 dark:text-rose-400"
  return "text-muted-foreground"
}

export function ResponsesAccordion({ operation }: { operation: OpenApiOperation }) {
  const entries = Object.entries(operation.responses)

  return (
    <Accordion type="single" collapsible defaultValue={entries[0]?.[0]} className="border-t border-border">
      {entries.map(([status, response]) => {
        const example = getResponseExample(operation, status)
        return (
          <AccordionItem key={status} value={status}>
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <span className={`font-mono text-sm font-bold ${statusColor(status)}`}>{status}</span>
                <span className="text-sm text-muted-foreground">{response.description}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {example !== undefined ? (
                <CodeBlock code={JSON.stringify(example, null, 2)} lang="json" />
              ) : (
                <p className="text-sm text-muted-foreground">No example available.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

import type { OpenApiOperation, OpenApiParamSchema } from "@/lib/openapi"

type BodySchema = {
  properties?: Record<string, { type?: string; description?: string; enum?: (string | number)[] }>
  required?: string[]
}

function schemaTypeLabel(schema?: OpenApiParamSchema | { type?: string; enum?: (string | number)[] }): string {
  if (!schema) return "string"
  if (schema.enum) return schema.enum.map(String).join(" | ")
  if (Array.isArray(schema.type)) return schema.type.join(" | ")
  return schema.type ?? "string"
}

function ParamRow({
  name,
  type,
  required,
  description,
  defaultValue,
}: {
  name: string
  type: string
  required?: boolean
  description?: string
  defaultValue?: unknown
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <code className="font-mono text-sm font-semibold text-foreground">{name}</code>
        <span className="text-xs text-muted-foreground">{type}</span>
        {required && (
          <span className="text-xs font-medium text-rose-600 dark:text-rose-400">required</span>
        )}
        {defaultValue !== undefined && (
          <span className="text-xs text-muted-foreground">default: {String(defaultValue)}</span>
        )}
      </div>
      {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}

export function ParamsTable({ operation }: { operation: OpenApiOperation }) {
  const pathParams = operation.parameters?.filter((p) => p.in === "path") ?? []
  const queryParams = operation.parameters?.filter((p) => p.in === "query") ?? []
  const bodySchema = operation.requestBody?.content?.["application/json"]?.schema as
    | BodySchema
    | undefined

  const hasBody = bodySchema?.properties && Object.keys(bodySchema.properties).length > 0

  if (pathParams.length === 0 && queryParams.length === 0 && !hasBody) return null

  return (
    <div className="space-y-8">
      {pathParams.length > 0 && (
        <section>
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Path parameters
          </h2>
          <div>
            {pathParams.map((p) => (
              <ParamRow
                key={p.name}
                name={p.name}
                type={schemaTypeLabel(p.schema)}
                required={p.required}
                description={p.description}
                defaultValue={p.schema?.default}
              />
            ))}
          </div>
        </section>
      )}

      {queryParams.length > 0 && (
        <section>
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Query parameters
          </h2>
          <div>
            {queryParams.map((p) => (
              <ParamRow
                key={p.name}
                name={p.name}
                type={schemaTypeLabel(p.schema)}
                required={p.required}
                description={p.description}
                defaultValue={p.schema?.default}
              />
            ))}
          </div>
        </section>
      )}

      {hasBody && bodySchema?.properties && (
        <section>
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Request body
          </h2>
          <div>
            {Object.entries(bodySchema.properties).map(([name, schema]) => (
              <ParamRow
                key={name}
                name={name}
                type={schemaTypeLabel(schema)}
                required={bodySchema.required?.includes(name)}
                description={schema.description}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

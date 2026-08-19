import { getApiBaseUrl } from "@/lib/api"

export type OpenApiParamSchema = {
  type?: string | string[]
  enum?: (string | number)[]
  default?: unknown
  example?: unknown
  minimum?: number
  maximum?: number
  maxLength?: number
}

export type OpenApiParameter = {
  name: string
  in: "query" | "path"
  required?: boolean
  description?: string
  schema?: OpenApiParamSchema
}

export type OpenApiMediaType = {
  schema?: unknown
  example?: unknown
  examples?: Record<string, { summary?: string; value: unknown }>
}

export type OpenApiRequestBody = {
  required?: boolean
  content?: Record<string, OpenApiMediaType>
}

export type OpenApiResponse = {
  description: string
  content?: Record<string, OpenApiMediaType>
}

export type OpenApiOperation = {
  summary: string
  description?: string
  operationId: string
  tags?: string[]
  parameters?: OpenApiParameter[]
  security?: Array<Record<string, string[]>>
  requestBody?: OpenApiRequestBody
  responses: Record<string, OpenApiResponse>
}

export type OpenApiSpec = {
  openapi: string
  info: { title: string; version: string; description?: string }
  servers?: Array<{ url: string; description?: string }>
  paths: Record<string, Record<string, OpenApiOperation>>
  components?: { schemas?: Record<string, unknown>; securitySchemes?: Record<string, unknown> }
}

export type DocEndpoint = {
  method: string
  path: string
  operation: OpenApiOperation
}

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"]

export async function getOpenApiSpec(): Promise<OpenApiSpec> {
  const baseUrl = getApiBaseUrl()
  const res = await fetch(`${baseUrl}/openapi.json`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Failed to load OpenAPI spec: ${res.status}`)
  }

  return res.json()
}

export function listEndpoints(spec: OpenApiSpec): DocEndpoint[] {
  const endpoints: DocEndpoint[] = []
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (!HTTP_METHODS.includes(method)) continue
      endpoints.push({ method: method.toUpperCase(), path, operation })
    }
  }
  return endpoints
}

const TAG_ORDER = ["Masjids", "Reference", "Meta"]

export function groupByTag(endpoints: DocEndpoint[]): Array<[string, DocEndpoint[]]> {
  const groups = new Map<string, DocEndpoint[]>()
  for (const endpoint of endpoints) {
    const tag = endpoint.operation.tags?.[0] ?? "Other"
    if (!groups.has(tag)) groups.set(tag, [])
    groups.get(tag)!.push(endpoint)
  }

  return Array.from(groups.entries()).sort(([a], [b]) => {
    const ai = TAG_ORDER.indexOf(a)
    const bi = TAG_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

export function findEndpointByOperationId(
  spec: OpenApiSpec,
  operationId: string
): DocEndpoint | undefined {
  return listEndpoints(spec).find((e) => e.operation.operationId === operationId)
}

export function resolveRequestPath(endpoint: DocEndpoint): string {
  let path = endpoint.path
  const query: string[] = []

  for (const param of endpoint.operation.parameters ?? []) {
    const example = param.schema?.example ?? param.schema?.default
    if (param.in === "path") {
      path = path.replace(`{${param.name}}`, String(example ?? "1"))
    } else if (param.in === "query" && example !== undefined) {
      query.push(`${param.name}=${encodeURIComponent(String(example))}`)
    }
  }

  return query.length > 0 ? `${path}?${query.join("&")}` : path
}

export function buildCurlExample(baseUrl: string, endpoint: DocEndpoint): string {
  const { method, operation } = endpoint
  const url = `${baseUrl}${resolveRequestPath(endpoint)}`
  const lines = [method === "GET" ? `curl '${url}'` : `curl -X ${method} '${url}'`]

  const requiresAuth = Boolean(operation.security?.length)
  const jsonBody = operation.requestBody?.content?.["application/json"]?.example

  if (requiresAuth) {
    lines.push(`  -H 'Authorization: Bearer YOUR_API_KEY'`)
  }
  if (jsonBody !== undefined) {
    lines.push(`  -H 'Content-Type: application/json'`)
    lines.push(`  -d '${JSON.stringify(jsonBody, null, 2)}'`)
  }

  return lines.join(" \\\n")
}

export function getResponseExample(operation: OpenApiOperation, status: string): unknown {
  const content = operation.responses[status]?.content?.["application/json"]
  if (!content) return undefined
  if (content.example !== undefined) return content.example
  if (content.examples) {
    const first = Object.values(content.examples)[0]
    return first?.value
  }
  return undefined
}

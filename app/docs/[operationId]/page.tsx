import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { EndpointHeader } from "@/components/docs/EndpointHeader"
import { ParamsTable } from "@/components/docs/ParamsTable"
import { ResponsesAccordion } from "@/components/docs/ResponsesAccordion"
import { TryItConsole } from "@/components/docs/TryItConsole"
import {
  buildCurlExample,
  findEndpointByOperationId,
  getOpenApiSpec,
  getResponseExample,
  resolveRequestPath,
} from "@/lib/openapi"
import { getApiBaseUrl } from "@/lib/api"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ operationId: string }>
}): Promise<Metadata> {
  const { operationId } = await params
  const spec = await getOpenApiSpec()
  const endpoint = findEndpointByOperationId(spec, operationId)

  if (!endpoint) {
    return { title: "API Reference | Masjid Sentral" }
  }

  return {
    title: `${endpoint.operation.summary} | Masjid Sentral API`,
    description: endpoint.operation.description ?? endpoint.operation.summary,
  }
}

export default async function DocsEndpointPage({
  params,
}: {
  params: Promise<{ operationId: string }>
}) {
  const { operationId } = await params
  const spec = await getOpenApiSpec()
  const endpoint = findEndpointByOperationId(spec, operationId)

  if (!endpoint) notFound()

  const baseUrl = getApiBaseUrl()
  const requestUrl = `${baseUrl}${resolveRequestPath(endpoint)}`
  const curl = buildCurlExample(baseUrl, endpoint)

  const responseExamples = Object.keys(endpoint.operation.responses)
    .map((status) => ({ status, example: getResponseExample(endpoint.operation, status) }))
    .filter((r): r is { status: string; example: unknown } => r.example !== undefined)

  return (
    <div className="grid gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="min-w-0 max-w-2xl space-y-10">
        <EndpointHeader endpoint={endpoint} />
        <ParamsTable operation={endpoint.operation} />
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Responses
          </h2>
          <ResponsesAccordion operation={endpoint.operation} />
        </section>
      </div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <TryItConsole
          endpoint={endpoint}
          requestUrl={requestUrl}
          curl={curl}
          responseExamples={responseExamples}
        />
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { getApiBaseUrl } from "@/lib/api"
import { getOpenApiSpec } from "@/lib/openapi"

export const metadata: Metadata = {
  title: "API Reference | Masjid Sentral",
  description: "Public REST API reference for the Masjid Sentral open mosque database.",
}

export default async function DocsOverviewPage() {
  const spec = await getOpenApiSpec()
  const baseUrl = getApiBaseUrl()

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-6 py-10">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">API Reference</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{spec.info.title}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">{spec.info.description}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Base URL</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every endpoint below is relative to a single base URL — there is no version prefix in the
          path. The current OpenAPI spec version is <code className="font-mono">{spec.info.version}</code>.
        </p>
        <CodeBlock code={baseUrl} lang="bash" />
      </section>

      <section id="authentication" className="scroll-mt-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Authentication</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Public read endpoints — listing and viewing masjids, states, and cities — require no
          authentication. Write endpoints (creating or updating a masjid) require a Bearer API key
          issued by the Masjid Sentral team, sent as a header on the request:
        </p>
        <CodeBlock code="Authorization: Bearer YOUR_API_KEY" lang="bash" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Contact the Masjid Sentral / Jejak Masjid team to request a key for write access.
        </p>
      </section>
    </div>
  )
}

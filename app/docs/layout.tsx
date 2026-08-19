import type { ReactNode } from "react"
import Layout from "@/components/Layout"
import { DocsSidebar } from "@/components/docs/DocsSidebar"
import { getOpenApiSpec, groupByTag, listEndpoints } from "@/lib/openapi"

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const spec = await getOpenApiSpec()
  const groups = groupByTag(listEndpoints(spec))

  return (
    <Layout>
      <div className="mx-auto flex max-w-[1600px] flex-col border-t border-border md:h-[calc(100vh-4rem)] md:flex-row">
        <details className="border-b border-border bg-card md:hidden">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-foreground">
            Browse endpoints
          </summary>
          <DocsSidebar groups={groups} />
        </details>
        <aside className="hidden w-[260px] shrink-0 overflow-y-auto border-r border-border bg-card md:block">
          <DocsSidebar groups={groups} />
        </aside>
        <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </Layout>
  )
}

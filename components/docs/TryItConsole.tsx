"use client"

import { useState } from "react"
import { Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "./CodeBlock"
import type { DocEndpoint } from "@/lib/openapi"

type ResponseExample = { status: string; example: unknown }

export function TryItConsole({
  endpoint,
  requestUrl,
  curl,
  responseExamples,
}: {
  endpoint: DocEndpoint
  requestUrl: string
  curl: string
  responseExamples: ResponseExample[]
}) {
  const [activeStatus, setActiveStatus] = useState(responseExamples[0]?.status ?? "200")
  const [liveResult, setLiveResult] = useState<{ status: number; body: unknown } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTestable = endpoint.method === "GET" && !endpoint.operation.security?.length

  async function handleTest() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(requestUrl)
      const body = await res.json().catch(() => null)
      setLiveResult({ status: res.status, body })
      setActiveStatus("live")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    } finally {
      setLoading(false)
    }
  }

  const tabs = liveResult
    ? [{ status: "live", label: `Live · ${liveResult.status}` }, ...responseExamples.map((r) => ({ status: r.status, label: r.status }))]
    : responseExamples.map((r) => ({ status: r.status, label: r.status }))

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-ms-border-dark bg-ms-code dark:bg-ms-code-dark">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <div className="flex items-center gap-2 text-xs font-mono text-ms-sage">
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-semibold">{endpoint.method}</span>
            <span className="truncate">{endpoint.path}</span>
          </div>
          <span className="text-[11px] uppercase tracking-wide text-ms-sage/70">Shell · cURL</span>
        </div>
        <CodeBlock code={curl} lang="bash" className="rounded-none border-0 bg-transparent" />
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
          <Button
            size="sm"
            onClick={handleTest}
            disabled={!isTestable || loading}
            className="gap-2 bg-ms-accent text-ms-code hover:bg-ms-accent-light disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Test Request
          </Button>
          {!isTestable && (
            <span className="text-[11px] text-ms-sage/60">
              Requires a Bearer API key — shown as example only
            </span>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Tabs value={activeStatus} onValueChange={setActiveStatus}>
          <TabsList variant="line" className="w-full justify-start rounded-none border-b border-border bg-transparent px-2">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.status} value={tab.status} className="font-mono text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => {
            const content =
              tab.status === "live"
                ? liveResult?.body
                : responseExamples.find((r) => r.status === tab.status)?.example
            return (
              <TabsContent key={tab.status} value={tab.status} className="m-0">
                <CodeBlock code={JSON.stringify(content, null, 2)} lang="json" className="rounded-none border-0" />
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
}

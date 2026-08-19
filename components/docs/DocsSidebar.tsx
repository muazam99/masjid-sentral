"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { methodClassName } from "./methodStyles"
import type { DocEndpoint } from "@/lib/openapi"

export function DocsSidebar({ groups }: { groups: Array<[string, DocEndpoint[]]> }) {
  const pathname = usePathname()
  const [query, setQuery] = useState("")

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return groups

    return groups
      .map(([tag, endpoints]): [string, DocEndpoint[]] => [
        tag,
        endpoints.filter(
          (e) =>
            e.operation.summary.toLowerCase().includes(q) ||
            e.path.toLowerCase().includes(q) ||
            e.operation.operationId.toLowerCase().includes(q)
        ),
      ])
      .filter(([, endpoints]) => endpoints.length > 0)
  }, [groups, query])

  return (
    <nav className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search endpoints"
          className="pl-8"
        />
      </div>

      <div className="space-y-1">
        <SidebarLink href="/docs" label="Overview" active={pathname === "/docs"} />
        <SidebarLink href="/docs#authentication" label="Authentication" active={false} />
      </div>

      {filteredGroups.map(([tag, endpoints]) => (
        <div key={tag} className="space-y-1">
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {tag}
          </p>
          {endpoints.map((endpoint) => {
            const href = `/docs/${endpoint.operation.operationId}`
            const active = pathname === href
            return (
              <Link
                key={endpoint.operation.operationId}
                href={href}
                className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground/80 hover:bg-muted"
                }`}
              >
                <span className="truncate font-mono text-xs">{endpoint.path}</span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold ${methodClassName(
                    endpoint.method
                  )}`}
                >
                  {endpoint.method}
                </span>
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function SidebarLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
        active ? "bg-primary/10 font-medium text-primary" : "text-foreground/80 hover:bg-muted"
      }`}
    >
      {label}
    </Link>
  )
}

export const METHOD_STYLES: Record<string, string> = {
  GET: "bg-emerald-600 text-white",
  POST: "bg-sky-600 text-white",
  PATCH: "bg-amber-600 text-white",
  PUT: "bg-amber-600 text-white",
  DELETE: "bg-rose-600 text-white",
}

export function methodClassName(method: string): string {
  return METHOD_STYLES[method] ?? "bg-muted text-foreground"
}

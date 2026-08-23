import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import Link from "next/link";
import { KeyRound, BarChart3, Shield } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();
  if (!user) {
    redirect("/login?next=/dashboard/api-keys");
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Dashboard Sidebar Navigation */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1">
                Developer Area
              </p>
              <nav className="space-y-1">
                <Link
                  href="/dashboard/api-keys"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>API Keys</span>
                </Link>
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                  title="Coming in Phase 5"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4" />
                    <span>Usage Metering</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded font-bold">
                    Soon
                  </span>
                </div>
              </nav>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Shield className="w-4 h-4" />
                <span>Security Notice</span>
              </div>
              <p>
                API keys carry full access rights to query public endpoints. Keep them secure in environment variables and never commit them to client-side repositories.
              </p>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

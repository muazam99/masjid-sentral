import { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "API Keys - Developer Dashboard | Masjid Sentral",
  description: "Manage your Masjid Sentral API keys for integrations and applications.",
};

export default function ApiKeysPage() {
  return <DashboardClient />;
}

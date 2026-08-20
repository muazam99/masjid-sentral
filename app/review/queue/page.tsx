import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import { SubmissionsQueueTable } from "@/components/submissions/SubmissionsQueueTable";

export default async function ReviewQueuePage() {
  const user = await getServerSession();
  if (!user) {
    redirect("/login?next=/review/queue");
  }
  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-9">
      <h1 className="mb-2 text-3xl font-extrabold">Review queue</h1>
      <p className="mb-7 text-muted-foreground">
        Approve or reject community-submitted masjids and edits.
      </p>
      <SubmissionsQueueTable />
    </div>
  );
}

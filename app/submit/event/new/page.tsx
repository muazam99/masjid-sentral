import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import { SubmitEventForm } from "@/components/submissions/SubmitEventForm";

export default async function SubmitNewEventPage() {
  const user = await getServerSession();
  if (!user) {
    redirect("/login?next=/submit/event/new");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Submit a Mosque Event</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Propose a new religious event, lecture, or community gathering. Submissions are reviewed by admins before appearing live.
      </p>
      <SubmitEventForm />
    </div>
  );
}

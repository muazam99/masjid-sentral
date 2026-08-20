import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import { MySubmissionsList } from "@/components/submissions/MySubmissionsList";

export default async function MySubmissionsPage() {
  const user = await getServerSession();
  if (!user) {
    redirect("/login?next=/submissions/mine");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-9">
      <h1 className="mb-2 text-3xl font-extrabold">My submissions</h1>
      <p className="mb-7 text-muted-foreground">Track the status of masjids and edits you&apos;ve submitted.</p>
      <MySubmissionsList />
    </div>
  );
}

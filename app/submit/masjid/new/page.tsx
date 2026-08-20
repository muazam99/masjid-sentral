import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import { SubmitMasjidForm } from "@/components/submissions/SubmitMasjidForm";

export default async function SubmitNewMasjidPage() {
  const user = await getServerSession();
  if (!user) {
    redirect("/login?next=/submit/masjid/new");
  }

  return <SubmitMasjidForm />;
}

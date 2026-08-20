import { notFound, redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import { fetchMasjidByIdFromApi } from "@/lib/api";
import { EditMasjidForm } from "@/components/submissions/EditMasjidForm";

export default async function EditMasjidPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const masjidId = Number(id);

  const user = await getServerSession();
  if (!user) {
    redirect(`/login?next=/submit/masjid/${id}/edit`);
  }

  if (isNaN(masjidId)) {
    notFound();
  }

  const mosque = await fetchMasjidByIdFromApi(masjidId);
  if (!mosque || mosque.id === null) {
    notFound();
  }

  return <EditMasjidForm mosque={{ ...mosque, id: mosque.id }} />;
}

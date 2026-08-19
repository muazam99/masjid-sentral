import { fetchMasjidByIdFromApi } from '@/lib/api'
import Layout from '@/components/Layout'
import MosqueDetail from '@/components/MosqueDetail'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function MosqueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mosqueDetails = await fetchMasjidByIdFromApi(parseInt(id));

  if (!mosqueDetails) {
    notFound();
  }

  return (
    <Layout>
      <MosqueDetail mosque={mosqueDetails} />
    </Layout>
  )
}

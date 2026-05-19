import { getMasjidById } from '@/app/db/queries'
import Layout from '@/components/Layout'
import MosqueDetail from '@/components/MosqueDetail'
import { notFound } from 'next/navigation'

export default async function MosqueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mosqueDetails = await getMasjidById(parseInt(id));

  if (!mosqueDetails) {
    notFound();
  }

  return (
    <Layout>
      <MosqueDetail mosque={mosqueDetails} />
    </Layout>
  )
}

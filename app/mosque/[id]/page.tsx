import { getMasjidById } from '@/app/db/queries'
import Layout from '@/components/Layout'
import MosqueDetail from '@/components/MosqueDetail'

export default async function MosqueDetailPage({ params }: { params: { id: string } }) {
  const mosqueDetails = await getMasjidById(parseInt(params.id));
  //
  return (
    <Layout>
      <MosqueDetail mosque={mosqueDetails} />
    </Layout>
  )
}


import { Metadata } from 'next'
import { fetchMasjidByIdFromApi } from '@/lib/api'
import Layout from '@/components/Layout'
import MosqueDetail from '@/components/MosqueDetail'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const mosque = await fetchMasjidByIdFromApi(parseInt(id))

  if (!mosque) {
    return {
      title: 'Masjid Not Found | Masjid Sentral',
    }
  }

  const locationContext = mosque.cityName
    ? `${mosque.cityName}, ${mosque.stateName}`
    : mosque.stateName || 'Malaysia'

  return {
    title: `${mosque.name} (${locationContext}) | Masjid Sentral`,
    description:
      mosque.description ||
      `Maklumat rasmi, kemudahan solat, waktu solat, lokasi dan infaq sedekah untuk ${mosque.name} di ${locationContext}.`,
    openGraph: {
      title: `${mosque.name} | Masjid Sentral`,
      description: `Maklumat rasmi, lokasi, dan kemudahan di ${mosque.name} (${locationContext}).`,
      images: mosque.thumbnailUrl ? [mosque.thumbnailUrl] : [],
    },
  }
}

export default async function MosqueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mosqueDetails = await fetchMasjidByIdFromApi(parseInt(id))

  if (!mosqueDetails) {
    notFound()
  }

  return (
    <Layout>
      <MosqueDetail mosque={mosqueDetails} />
    </Layout>
  )
}


import Layout from '@/components/Layout'
import MosqueDetail from '@/components/MosqueDetail'

export default function MosqueDetailPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the mosque data based on the ID
  const mosqueData = {
    id: parseInt(params.id),
    name: "Masjid Al-Huda Sungai Ara",
    location: "Sungai Ara, Bayan Lepas, Pulau Pinang",
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    activities: [
      { speaker: "Muhammad Amir", title: "Kuliah Agama", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { speaker: "Ahmad Faiz", title: "Ceramah Maghrib", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
      { speaker: "Nur Aisyah", title: "Kelas Tajwid", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
    ],
    contact: {
      phone1: "+60123456789",
      phone2: "+60198765432",
      email: "info@masjidhuda.com",
    },
    socialMedia: {
      tiktok: "https://www.tiktok.com/@masjidhuda",
      instagram: "https://www.instagram.com/masjidhuda",
      facebook: "https://www.facebook.com/masjidhuda",
      twitter: "https://twitter.com/masjidhuda",
      whatsapp: "https://wa.me/60123456789",
    },
    tiktokReview: {
      videoUrl: "https://www.tiktok.com/embed/v2/7106570363441971458",
      caption: "Masjid Al-Huda Sungai Ara - A beautiful place of worship",
    },
  }

  return (
    <Layout>
      <MosqueDetail mosque={mosqueData} />
    </Layout>
  )
}


import Layout from '@/components/Layout'
import SearchFilter from '@/components/SearchFilter'
import MosqueGrid from '@/components/MosqueGrid'

export default function Home() {
  return (
    <Layout>
      <SearchFilter />
      <MosqueGrid />
    </Layout>
  )
}


import MosqueCard from './MosqueCard'

const mosques = [
  { id: 1, name: 'Masjid Sultan Salahuddin Abdul Aziz Shah', location: 'Shah Alam, Selangor', imageUrl: '/placeholder.svg?height=200&width=300' },
  { id: 2, name: 'Masjid Putra', location: 'Putrajaya', imageUrl: '/placeholder.svg?height=200&width=300' },
  { id: 3, name: 'Masjid Jamek Sultan Abdul Samad', location: 'Kuala Lumpur', imageUrl: '/placeholder.svg?height=200&width=300' },
  { id: 4, name: 'Masjid Negara', location: 'Kuala Lumpur', imageUrl: '/placeholder.svg?height=200&width=300' },
  { id: 5, name: 'Masjid Tengku Ampuan Jemaah', location: 'Shah Alam, Selangor', imageUrl: '/placeholder.svg?height=200&width=300' },
  { id: 6, name: 'Masjid Kristal', location: 'Kuala Terengganu, Terengganu', imageUrl: '/placeholder.svg?height=200&width=300' },
]

export default function MosqueGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mosques.map((mosque) => (
        <MosqueCard key={mosque.id} {...mosque} />
      ))}
    </div>
  )
}


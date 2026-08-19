import { MosqueReview } from '@/types/Mosque'
import ReviewsOverviewCard from './ReviewsOverviewCard'
import RecentReviewsList from './RecentReviewsList'

interface ReviewsTabProps {
  reviews: MosqueReview[]
  avgRating: number | null
  reviewCount: number
  reviewsPerRating: Record<number, number> | null
  mosqueName: string | null
}

export default function ReviewsTab({
  reviews,
  avgRating,
  reviewCount,
  reviewsPerRating,
  mosqueName,
}: ReviewsTabProps) {
  return (
    <div className="space-y-6">
      <ReviewsOverviewCard
        avgRating={avgRating}
        reviewCount={reviewCount}
        reviewsPerRating={reviewsPerRating}
      />
      <RecentReviewsList
        reviews={reviews}
        mosqueName={mosqueName}
      />
    </div>
  )
}

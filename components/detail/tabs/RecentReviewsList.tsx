'use client'

import { useState } from 'react'
import { Star, PlusCircle, CheckCircle2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MosqueReview } from '@/types/Mosque'

interface RecentReviewsListProps {
  reviews: MosqueReview[]
  mosqueName: string | null
}

export default function RecentReviewsList({ reviews, mosqueName }: RecentReviewsListProps) {
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reviewerName, setReviewerName] = useState('')
  const [ratingScore, setRatingScore] = useState(5)
  const [reviewText, setReviewText] = useState('')

  const hasReviews = reviews && reviews.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowWriteModal(false)
      setReviewerName('')
      setReviewText('')
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-[#173524] dark:text-[#F7F5EF]">
          Ulasan Komuniti
        </h3>
        <Button
          size="sm"
          onClick={() => setShowWriteModal(true)}
          className="bg-[#1F5A3B] hover:bg-[#173524] text-white gap-1.5 text-xs font-bold shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tulis Ulasan</span>
        </Button>
      </div>

      {/* Reviews Cards List or Empty State */}
      {hasReviews ? (
        <div className="space-y-3">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-5 shadow-xs space-y-3 hover:border-[#1F5A3B] dark:hover:border-[#8BC99C] transition-all"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/20 text-[#1F5A3B] dark:text-[#8BC99C] font-bold text-sm">
                    {(item.user_name || 'J').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#173524] dark:text-[#F7F5EF]">
                      {item.user_name || 'Jemaah Komuniti'}
                    </h4>
                    <span className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString('en-MY', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Sumbangan Komuniti'}
                    </span>
                  </div>
                </div>

                {/* Rating Pill */}
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 text-xs font-black text-amber-700 dark:text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{Number(item.rating).toFixed(1)}</span>
                </div>
              </div>

              {/* Content */}
              {item.message && (
                <p className="text-xs sm:text-sm text-[#5A725F] dark:text-[#B8C8B9] leading-relaxed">
                  &ldquo;{item.message}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center space-y-3 bg-[#F7F5EF]/30 dark:bg-[#0F1F17]/20 rounded-xl border border-dashed border-[#D8D2C2] dark:border-[#355443]">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/20 text-[#1F5A3B] dark:text-[#8BC99C]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <p className="text-sm text-[#5A725F] dark:text-[#B8C8B9]">
            Belum ada ulasan untuk {mosqueName}. Jadilah yang pertama berkongsi maklum balas!
          </p>
          <Button
            size="sm"
            onClick={() => setShowWriteModal(true)}
            className="bg-[#1F5A3B] hover:bg-[#173524] text-white text-xs font-bold gap-1.5 shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            Tulis Ulasan Pertama
          </Button>
        </div>
      )}

      {/* Write Review Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-2xl text-[#173524] dark:text-[#F7F5EF]"
          >
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Ulasan Diterima!</h3>
                <p className="text-sm text-[#5A725F] dark:text-[#B8C8B9]">
                  Terima kasih atas perkongsian maklum balas anda untuk {mosqueName}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F5A3B] text-white">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Tulis Ulasan</h3>
                    <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">
                      Kongsi pengalaman anda melawat {mosqueName}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Nama Anda</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Contoh: Ahmad Faiz"
                    className="w-full rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-[#F7F5EF] dark:bg-[#0F1F17] p-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1F5A3B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Penilaian Bintang</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRatingScore(num)}
                        className={`p-2 rounded-lg border flex items-center gap-1 text-xs font-bold transition-all ${
                          ratingScore >= num
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300'
                            : 'border-[#D8D2C2] dark:border-[#355443] text-[#5A725F]'
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            ratingScore >= num ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                        <span>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Ulasan Anda</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Kebersihan tempat wuduk, ruang solat wanita, kemudahan tempat letak kenderaan..."
                    className="w-full rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-[#F7F5EF] dark:bg-[#0F1F17] p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1F5A3B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowWriteModal(false)}
                    className="border-[#D8D2C2] dark:border-[#355443]"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#1F5A3B] hover:bg-[#173524] text-white font-bold"
                  >
                    Hantar Ulasan
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


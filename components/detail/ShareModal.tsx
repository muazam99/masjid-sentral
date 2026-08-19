'use client'

import { useState } from 'react'
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  mosqueName: string | null
  url: string
}

export default function ShareModal({ isOpen, onClose, mosqueName, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Lihat maklumat ${mosqueName} di Masjid Sentral: ${url}`)
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const shareTwitter = () => {
    const text = encodeURIComponent(`Maklumat ${mosqueName} di @MasjidSentral: ${url}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-2xl text-[#173524] dark:text-[#F7F5EF] space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#5A725F] dark:text-[#B8C8B9] hover:bg-[#ECE7DA] dark:hover:bg-[#203829] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F5A3B] text-white">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Kongsi Masjid</h3>
            <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9] truncate max-w-[240px]">
              {mosqueName}
            </p>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#5A725F] dark:text-[#B8C8B9]">
            Pautan Halaman
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-[#F7F5EF] dark:bg-[#0F1F17] p-2 text-xs truncate focus:outline-hidden"
            />
            <Button
              size="sm"
              onClick={handleCopy}
              className="bg-[#1F5A3B] hover:bg-[#173524] text-white shrink-0 gap-1.5 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Ditiru
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Salin
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Social Share */}
        <div className="pt-2 border-t border-[#D8D2C2] dark:border-[#355443] flex items-center justify-between gap-2">
          <button
            onClick={shareWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#D8D2C2] dark:border-[#355443] hover:bg-[#F7F5EF] dark:hover:bg-[#0F1F17] text-xs font-semibold transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            WhatsApp
          </button>
          <button
            onClick={shareTwitter}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#D8D2C2] dark:border-[#355443] hover:bg-[#F7F5EF] dark:hover:bg-[#0F1F17] text-xs font-semibold transition-colors"
          >
            <Share2 className="h-4 w-4 text-sky-500" />
            X (Twitter)
          </button>
        </div>
      </div>
    </div>
  )
}

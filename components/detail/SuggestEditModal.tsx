'use client'

import { useState } from 'react'
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SuggestEditModalProps {
  isOpen: boolean
  onClose: () => void
  mosqueName: string | null
  mosqueId: number | null
}

export default function SuggestEditModal({
  isOpen,
  onClose,
  mosqueName,
  mosqueId,
}: SuggestEditModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [contactInfo, setContactInfo] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!suggestion.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setSuggestion('')
      setContactInfo('')
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-2xl text-[#173524] dark:text-[#F7F5EF]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#5A725F] dark:text-[#B8C8B9] hover:bg-[#ECE7DA] dark:hover:bg-[#203829] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Terima Kasih!</h3>
            <p className="text-sm text-[#5A725F] dark:text-[#B8C8B9]">
              Cadangan kemas kini anda untuk <span className="font-semibold text-foreground">{mosqueName}</span> telah diterima untuk semakan komuniti.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F5A3B] text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Cadang Kemas Kini</h3>
                <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">
                  Kemas kini maklumat untuk {mosqueName} (ID: #{mosqueId})
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#173524] dark:text-[#F7F5EF]">
                Butiran yang perlu dikemas kini / ditambah
              </label>
              <textarea
                required
                rows={4}
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Contoh: Tambah nombor telefon pejabat, kemas kini kemudahan mesra OKU, atau maklumat solat Jumaat..."
                className="w-full rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-[#F7F5EF] dark:bg-[#0F1F17] p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1F5A3B] dark:focus:ring-[#8BC99C] placeholder:text-[#5A725F]/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#173524] dark:text-[#F7F5EF]">
                Emel / Nombor Telefon Anda (Pilihan)
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Untuk rujukan pengesahan jika perlu"
                className="w-full rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-[#F7F5EF] dark:bg-[#0F1F17] p-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1F5A3B] dark:focus:ring-[#8BC99C] placeholder:text-[#5A725F]/60"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-[#D8D2C2] dark:border-[#355443]"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#1F5A3B] hover:bg-[#173524] text-white gap-2 font-bold shadow-xs"
              >
                <Send className="h-4 w-4" />
                Hantar Cadangan
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

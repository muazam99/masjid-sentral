import { ExternalLink, Globe, PlusCircle } from 'lucide-react'
import { MosqueContact } from '@/types/Mosque'
import { Button } from '@/components/ui/button'

interface SocialMediaCardProps {
  contacts: MosqueContact[]
  websiteUrl: string | null
  mosqueName: string | null
  onSuggestLinks?: () => void
}

export default function SocialMediaCard({
  contacts,
  websiteUrl,
  mosqueName,
  onSuggestLinks,
}: SocialMediaCardProps) {
  // Extract only real registered contacts from DB
  const validContacts = (contacts || []).filter((c) => c.value && c.value.trim().length > 0)
  const hasWebsite = Boolean(websiteUrl && websiteUrl.trim().length > 0)
  const hasAnyLink = validContacts.length > 0 || hasWebsite

  const getPlatformLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'facebook': return 'Facebook'
      case 'instagram': return 'Instagram'
      case 'twitter': return 'X (Twitter)'
      case 'youtube': return 'YouTube'
      case 'whatsapp': return 'WhatsApp'
      case 'website': return 'Laman Web'
      default: return type
    }
  }

  const getPlatformColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'facebook': return 'text-blue-600 dark:text-blue-400'
      case 'instagram': return 'text-pink-600 dark:text-pink-400'
      case 'twitter': return 'text-sky-500 dark:text-sky-400'
      case 'youtube': return 'text-red-600 dark:text-red-400'
      case 'whatsapp': return 'text-emerald-600 dark:text-emerald-400'
      default: return 'text-emerald-600 dark:text-emerald-400'
    }
  }

  return (
    <div className="rounded-2xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs space-y-4">
      <h3 className="text-lg font-bold text-[#173524] dark:text-[#F7F5EF]">
        Social Media & Links
      </h3>

      {hasAnyLink ? (
        <div className="space-y-2">
          {hasWebsite && (
            <a
              href={websiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl border border-[#D8D2C2]/40 dark:border-[#355443]/40 hover:bg-[#F7F5EF] dark:hover:bg-[#0F1F17] transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F5EF] dark:bg-[#0F1F17] border border-[#D8D2C2]/60 dark:border-[#355443]/60 group-hover:scale-105 transition-transform">
                  <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-[#173524] dark:text-[#F7F5EF] block">
                    Official Website
                  </span>
                  <span className="text-[11px] text-[#5A725F] dark:text-[#B8C8B9] truncate block">
                    {websiteUrl}
                  </span>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-[#5A725F] dark:text-[#B8C8B9] group-hover:text-[#1F5A3B] dark:group-hover:text-[#8BC99C] transition-colors shrink-0 ml-2" />
            </a>
          )}

          {validContacts.map((item, idx) => (
            <a
              key={idx}
              href={item.value.startsWith('http') ? item.value : `https://${item.value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl border border-[#D8D2C2]/40 dark:border-[#355443]/40 hover:bg-[#F7F5EF] dark:hover:bg-[#0F1F17] transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F5EF] dark:bg-[#0F1F17] border border-[#D8D2C2]/60 dark:border-[#355443]/60 group-hover:scale-105 transition-transform">
                  <Globe className={`h-4 w-4 ${getPlatformColor(item.type)}`} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-[#173524] dark:text-[#F7F5EF] block">
                    {getPlatformLabel(item.type)}
                  </span>
                  <span className="text-[11px] text-[#5A725F] dark:text-[#B8C8B9] truncate block">
                    {item.value}
                  </span>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-[#5A725F] dark:text-[#B8C8B9] group-hover:text-[#1F5A3B] dark:group-hover:text-[#8BC99C] transition-colors shrink-0 ml-2" />
            </a>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center space-y-3 bg-[#F7F5EF]/30 dark:bg-[#0F1F17]/20 rounded-lg border border-dashed border-[#D8D2C2] dark:border-[#355443]">
          <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">
            Tiada pautan media sosial rasmi didaftarkan untuk masjid ini.
          </p>
          {onSuggestLinks && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSuggestLinks}
              className="border-[#D8D2C2] dark:border-[#355443] text-xs gap-1.5 font-semibold"
            >
              <PlusCircle className="h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#8BC99C]" />
              Cadang Pautan
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

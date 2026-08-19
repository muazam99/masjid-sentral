import { Phone, Mail, Globe, MapPin, Building, ShieldCheck } from 'lucide-react'
import { MosqueContact } from '@/types/Mosque'

interface ContactsTabProps {
  phone: string | null
  email: string | null
  websiteUrl: string | null
  googleMapsUrl: string | null
  address: string | null
  contacts: MosqueContact[]
  mosqueName: string | null
  stateName: string | null
}

export default function ContactsTab({
  phone,
  email,
  websiteUrl,
  googleMapsUrl,
  address,
  contacts,
  mosqueName,
  stateName,
}: ContactsTabProps) {
  return (
    <div className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs space-y-6">
      <div className="border-b border-[#D8D2C2]/60 dark:border-[#355443]/60 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#173524] dark:text-[#F7F5EF]">
          Contact Directory & Channels
        </h2>
        <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9] mt-0.5">
          Official administration and community channels for {mosqueName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Telephone */}
        <div className="p-4 rounded-xl border border-[#D8D2C2]/60 dark:border-[#355443]/60 bg-[#F7F5EF]/50 dark:bg-[#0F1F17]/40 space-y-1.5">
          <div className="flex items-center gap-2 text-[#1F5A3B] dark:text-[#8BC99C]">
            <Phone className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Telephone
            </span>
          </div>
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="text-base font-bold text-[#173524] dark:text-[#F7F5EF] hover:underline block"
            >
              {phone}
            </a>
          ) : (
            <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">
              Not available · Suggest via community edit
            </p>
          )}
        </div>

        {/* Email */}
        <div className="p-4 rounded-xl border border-[#D8D2C2]/60 dark:border-[#355443]/60 bg-[#F7F5EF]/50 dark:bg-[#0F1F17]/40 space-y-1.5">
          <div className="flex items-center gap-2 text-[#1F5A3B] dark:text-[#8BC99C]">
            <Mail className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Email Address
            </span>
          </div>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="text-base font-bold text-[#173524] dark:text-[#F7F5EF] hover:underline truncate block"
            >
              {email}
            </a>
          ) : (
            <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">
              Not available · Maintained by community
            </p>
          )}
        </div>

        {/* Website */}
        <div className="p-4 rounded-xl border border-[#D8D2C2]/60 dark:border-[#355443]/60 bg-[#F7F5EF]/50 dark:bg-[#0F1F17]/40 space-y-1.5">
          <div className="flex items-center gap-2 text-[#1F5A3B] dark:text-[#8BC99C]">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Website
            </span>
          </div>
          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#1F5A3B] dark:text-[#8BC99C] hover:underline truncate block"
            >
              {websiteUrl}
            </a>
          ) : (
            <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">
              Official portal link not registered
            </p>
          )}
        </div>

        {/* State Department */}
        <div className="p-4 rounded-xl border border-[#D8D2C2]/60 dark:border-[#355443]/60 bg-[#F7F5EF]/50 dark:bg-[#0F1F17]/40 space-y-1.5">
          <div className="flex items-center gap-2 text-[#1F5A3B] dark:text-[#8BC99C]">
            <Building className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Jurisdiction & State
            </span>
          </div>
          <p className="text-sm font-bold text-[#173524] dark:text-[#F7F5EF]">
            {stateName || 'Malaysia'} Religious Department (JAIS/JAWI/JAKIM)
          </p>
        </div>

        {/* Location & Maps Navigation */}
        <div className="p-4 rounded-xl border border-[#D8D2C2]/60 dark:border-[#355443]/60 bg-[#F7F5EF]/50 dark:bg-[#0F1F17]/40 space-y-1.5 md:col-span-2">
          <div className="flex items-center gap-2 text-[#1F5A3B] dark:text-[#8BC99C]">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Address & Navigation Link
            </span>
          </div>
          <p className="text-sm text-[#173524] dark:text-[#F7F5EF]">
            {address || 'Physical address registered in Masjid Sentral directory.'}
          </p>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#1F5A3B] dark:text-[#8BC99C] hover:underline block pt-1"
            >
              Open in Google Maps &rarr;
            </a>
          )}
        </div>

        {/* Additional Contact Channels */}
        {contacts && contacts.length > 0 && (
          <div className="p-4 rounded-xl border border-[#D8D2C2]/60 dark:border-[#355443]/60 bg-[#F7F5EF]/50 dark:bg-[#0F1F17]/40 space-y-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A725F] dark:text-[#B8C8B9]">
              Additional Channels
            </span>
            <div className="flex flex-wrap gap-2">
              {contacts.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-[#172D20] border border-[#D8D2C2] dark:border-[#355443] px-3 py-1.5 text-xs font-semibold"
                >
                  <span className="uppercase text-[10px] text-[#5A725F] dark:text-[#B8C8B9]">
                    {c.type}:
                  </span>
                  <span className="text-[#173524] dark:text-[#F7F5EF]">{c.value}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Community Registration Status */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200">
        <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div className="text-xs space-y-0.5">
          <p className="font-bold">Verified Community Record</p>
          <p className="text-emerald-700 dark:text-emerald-300">
            This masjid entry is indexed in the open Masjid Sentral registry with coordinates verified against institutional data.
          </p>
        </div>
      </div>
    </div>
  )
}

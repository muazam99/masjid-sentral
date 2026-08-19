'use client'

import { Calendar, Clock, MapPin, PlusCircle } from 'lucide-react'
import { MosqueEvent } from '@/types/Mosque'
import { Button } from '@/components/ui/button'

interface EventsTabProps {
  events: MosqueEvent[]
  onSuggestEvent?: () => void
}

export default function EventsTab({ events, onSuggestEvent }: EventsTabProps) {
  const hasEvents = events && events.length > 0

  return (
    <div className="space-y-6">
      {hasEvents ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#173524] dark:text-[#F7F5EF]">
              Acara & Program Berjadual
            </h3>
            <span className="text-xs font-semibold text-[#1F5A3B] dark:text-[#8BC99C]">
              {events.length} program
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => {
              const start = new Date(ev.start_at)
              const dateStr = !isNaN(start.getTime())
                ? start.toLocaleDateString('en-MY', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })
                : ev.start_at

              const timeStr = !isNaN(start.getTime())
                ? start.toLocaleTimeString('en-MY', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : ''

              return (
                <div
                  key={ev.id}
                  className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-5 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-md bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/20 px-2.5 py-0.5 text-xs font-bold text-[#1F5A3B] dark:text-[#8BC99C]">
                        {dateStr}
                      </span>
                      {ev.status && (
                        <span className="text-[10px] uppercase font-bold text-[#5A725F] dark:text-[#B8C8B9]">
                          {ev.status}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-[#173524] dark:text-[#F7F5EF] leading-snug">
                      {ev.title}
                    </h4>

                    {ev.description && (
                      <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9] line-clamp-2">
                        {ev.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-[#5A725F] dark:text-[#B8C8B9] border-t border-[#D8D2C2]/40 dark:border-[#355443]/40 pt-2.5">
                    {timeStr && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#8BC99C] shrink-0" />
                        <span>{timeStr}</span>
                      </div>
                    )}
                    {ev.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#8BC99C] shrink-0" />
                        <span>{ev.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-8 shadow-xs text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/20 text-[#1F5A3B] dark:text-[#8BC99C]">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#173524] dark:text-[#F7F5EF]">
              Tiada Acara Berjadual
            </h3>
            <p className="text-xs sm:text-sm text-[#5A725F] dark:text-[#B8C8B9]">
              Belum ada program, kuliah, atau aktiviti komuniti yang didaftarkan untuk masjid ini.
            </p>
          </div>
          {onSuggestEvent && (
            <Button
              onClick={onSuggestEvent}
              className="bg-[#1F5A3B] hover:bg-[#173524] text-white text-xs font-bold gap-1.5 shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              Cadang Program / Kuliah
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

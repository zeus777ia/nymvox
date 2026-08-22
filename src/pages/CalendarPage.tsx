import { useMemo, useState } from 'react'
import { addMonths, format, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { usePosts } from '@/hooks/usePosts'
import { Link } from 'react-router-dom'

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

export function CalendarPage() {
  const { user } = useAuth()
  const { posts, loading } = usePosts(user?.id)
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))

  const cells = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [cursor])

  const postsByDay = useMemo(() => {
    const map = new Map<string, typeof posts>()
    for (const p of posts) {
      const raw = p.scheduled_at || p.published_at || p.created_at
      const key = format(new Date(raw), 'yyyy-MM-dd')
      const list = map.get(key) ?? []
      list.push(p)
      map.set(key, list)
    }
    return map
  }, [posts])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">İçerik Takvimi</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCursor((c) => addMonths(c, -1))} aria-label="Önceki ay">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="min-w-[140px] text-center font-semibold capitalize">
            {format(cursor, 'LLLL yyyy', { locale: tr })}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCursor((c) => addMonths(c, 1))} aria-label="Sonraki ay">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-end gap-3 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-indigo-500" /> Planlı
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500" /> Yayınlandı
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-400" /> Taslak
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-sm">
            {WEEKDAYS.map((d) => (
              <div key={d} className="font-semibold text-gray-600 py-2">
                {d}
              </div>
            ))}
            {cells.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              const dayPosts = postsByDay.get(key) ?? []
              const inMonth = isSameMonth(day, cursor)
              const today = isSameDay(day, new Date())
              return (
                <div
                  key={key}
                  className={`border rounded-lg p-1.5 min-h-[72px] md:min-h-[88px] text-left ${
                    inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                  } ${today ? 'border-indigo-400 ring-1 ring-indigo-200' : ''}`}
                >
                  <span className={`text-xs font-medium ${today ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayPosts.slice(0, 2).map((p) => (
                      <div
                        key={p.id}
                        className={`text-[10px] rounded px-1 py-0.5 truncate ${
                          p.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : p.status === 'scheduled'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                        title={p.content}
                      >
                        {p.content}
                      </div>
                    ))}
                    {dayPosts.length > 2 && (
                      <div className="text-[10px] text-gray-500">+{dayPosts.length - 2}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {!loading && posts.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Henüz post yok.{' '}
              <Link to="/create" className="text-indigo-600 hover:underline">
                İlk içeriğini oluştur
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

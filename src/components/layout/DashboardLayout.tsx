import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { usePublisher } from '@/hooks/usePublisher'

export function DashboardLayout() {
  const [open, setOpen] = useState(false)
  usePublisher()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <p className="text-xs text-gray-500 mb-3">
            Zamanlanan X postları bu sekme açıkken ~15 sn’de bir gönderilir. Tarayıcıyı kapatırsan paylaşılmaz.
          </p>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Bell, User, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type TopBarProps = {
  onMenu?: () => void
}

export function TopBar({ onMenu }: TopBarProps) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu} aria-label="Menü">
        <Menu className="w-5 h-5 text-gray-700" />
      </Button>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Bildirimler">
          <Bell className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {profile?.full_name || 'Kullanıcı'}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Çıkış">
          <LogOut className="w-5 h-5 text-gray-600" />
        </Button>
      </div>
    </header>
  )
}

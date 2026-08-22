import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Link2, CalendarDays, PlusCircle, BarChart3, Settings, CreditCard, X } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/accounts', label: 'Hesaplar', icon: Link2 },
  { path: '/calendar', label: 'Takvim', icon: CalendarDays },
  { path: '/create', label: 'Oluştur', icon: PlusCircle },
  { path: '/analytics', label: 'Analitik', icon: BarChart3 },
  { path: '/billing', label: 'Ödeme', icon: CreditCard },
  { path: '/settings', label: 'Ayarlar', icon: Settings },
]

type SidebarProps = {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Nymvox</h1>
          <button type="button" className="md:hidden p-1 text-gray-500" onClick={onClose} aria-label="Menüyü kapat">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

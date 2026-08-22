import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AnalyticsPage() {
  const stats = [
    { label: 'Toplam Etkileşim', value: '1,234', icon: Heart, color: 'text-red-500' },
    { label: 'Toplam Erişim', value: '12,456', icon: Eye, color: 'text-blue-500' },
    { label: 'Yeni Takipçi', value: '+89', icon: Users, color: 'text-green-500' },
    { label: 'Paylaşım', value: '456', icon: Share2, color: 'text-purple-500' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analitik</h2>
      
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-600" /> Haftalık Performans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-8">{day}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all" 
                      style={{ width: `${[65, 45, 80, 55, 70, 90, 40][i]}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-10 text-right">{[65, 45, 80, 55, 70, 90, 40][i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-indigo-600" /> En İyi Postlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Henüz yayınlanmış post yok.</p>
              <p className="text-sm mt-1">İlk postunu oluşturduğunda burada görünecek!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

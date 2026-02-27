import { useEffect, useMemo, useState } from 'react'
import * as FM from 'framer-motion'
import { BarChart2, CheckCircle2, PhoneCall } from 'lucide-react'
import { StatCard } from '../components/Skeleton'
import LeadsLine from '../charts/LeadsLine'
import StatusPie from '../charts/StatusPie'
import { Skeleton } from '../components/Skeleton'
import api from '../services/api'
import { Toaster } from 'react-hot-toast'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalLeads: 0, contactedCount: 0, convertedCount: 0, leadsByStatus: [] })
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    function apply(s, l) {
      if (!mounted) return
      const statData = s?.data || { totalLeads: 0, contactedCount: 0, convertedCount: 0, leadsByStatus: [] }
      const leadsData = l?.data || []
      setStats(statData)
      setLeads(leadsData)
    }
    function fetchAll() {
      Promise.all([api.get('/analytics/stats').catch(() => null), api.get('/leads').catch(() => null)]).then(([s, l]) =>
        apply(s, l),
      )
    }
    fetchAll()
    setLoading(false)
    function onChanged() {
      fetchAll()
    }
    function onVisible() {
      if (document.visibilityState === 'visible') fetchAll()
    }
    const interval = setInterval(fetchAll, 8000)
    window.addEventListener('leads:changed', onChanged)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      mounted = false
      clearInterval(interval)
      window.removeEventListener('leads:changed', onChanged)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const lineData = useMemo(() => {
    const now = new Date()
    const buckets = []
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now)
      start.setDate(now.getDate() - i * 7)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      const count = leads.filter((ld) => {
        const d = new Date(ld.createdAt || ld.updatedAt || Date.now())
        return d >= new Date(start.setHours(0, 0, 0, 0)) && d <= new Date(end.setHours(23, 59, 59, 999))
      }).length
      buckets.push({ date: `W-${6 - i}`, count })
    }
    return buckets
  }, [leads])

  return (
    <div>
      <Toaster position="top-right" />
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-24 rounded-2xl bg-white/5" />
          <Skeleton className="h-24 rounded-2xl bg-white/5" />
          <Skeleton className="h-24 rounded-2xl bg-white/5" />
          <Skeleton className="h-24 rounded-2xl bg-white/5" />
        </div>
      ) : (
        <FM.motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={BarChart2} />
            <StatCard title="Contacted" value={stats?.contactedCount || 0} icon={PhoneCall} />
            <StatCard title="Converted" value={stats?.convertedCount || 0} icon={CheckCircle2} />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="glass p-6">
              <div className="mb-3 text-sm text-slate-300">Lead Growth</div>
              <LeadsLine data={lineData} />
            </div>
            <div className="glass p-6">
              <div className="mb-3 text-sm text-slate-300">Status Breakdown</div>
              <StatusPie
                data={
                  stats?.leadsByStatus?.length
                    ? stats.leadsByStatus
                    : [
                        { status: 'new', count: 0 },
                        { status: 'contacted', count: 0 },
                        { status: 'converted', count: 0 },
                        { status: 'lost', count: 0 },
                      ]
                }
              />
            </div>
          </div>
        </FM.motion.div>
      )}
    </div>
  )
}


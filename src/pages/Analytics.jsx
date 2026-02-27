import { useEffect, useMemo, useState } from 'react'
import * as FM from 'framer-motion'
import { Skeleton } from '../components/Skeleton'
import LeadsLine from '../charts/LeadsLine'
import StatusPie from '../charts/StatusPie'
import api from '../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import HeatmapCalendar from '../charts/HeatmapCalendar'

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalLeads: 0, contactedCount: 0, convertedCount: 0, leadsByStatus: [] })
  const [leads, setLeads] = useState([])
  const [heatData, setHeatData] = useState({})

  useEffect(() => {
    let mounted = true
    Promise.all([api.get('/analytics/stats').catch(() => null), api.get('/leads').catch(() => null)])
      .then(([s, l]) => {
        if (!mounted) return
        const statData = s?.data || { totalLeads: 0, contactedCount: 0, convertedCount: 0, leadsByStatus: [] }
        const leadsData = l?.data || []
        setStats(statData)
        setLeads(leadsData)
        // heatmap from createdAt
        const days = 7 * 20
        const now = new Date()
        const map = {}
        for (let i = days; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(now.getDate() - i)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          map[key] = 0
        }
        leadsData.forEach((ld) => {
          const d = new Date(ld.createdAt || ld.updatedAt || Date.now())
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          if (key in map) map[key] += 1
        })
        setHeatData(map)
      })
      .finally(() => mounted && setLoading(false))
    function onChanged() {
      Promise.all([api.get('/analytics/stats').catch(() => null), api.get('/leads').catch(() => null)]).then(([s, l]) => {
        if (!mounted) return
        const statData = s?.data || { totalLeads: 0, contactedCount: 0, convertedCount: 0, leadsByStatus: [] }
        const leadsData = l?.data || []
        setStats(statData)
        setLeads(leadsData)
        // rebuild heatmap
        const days = 7 * 20
        const now = new Date()
        const map = {}
        for (let i = days; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(now.getDate() - i)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          map[key] = 0
        }
        leadsData.forEach((ld) => {
          const d = new Date(ld.createdAt || ld.updatedAt || Date.now())
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          if (key in map) map[key] += 1
        })
        setHeatData(map)
      })
    }
    window.addEventListener('leads:changed', onChanged)
    return () => {
      mounted = false
      window.removeEventListener('leads:changed', onChanged)
    }
  }, [])

  const lineData = useMemo(() => {
    // last 6 weeks based on createdAt
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

  const barData = useMemo(() => {
    // last 6 months conversions
    const now = new Date()
    const arr = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = d.toLocaleString('en', { month: 'short' })
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
      const value = leads.filter((ld) => {
        if (ld.status !== 'converted') return false
        const t = new Date(ld.updatedAt || ld.createdAt || Date.now())
        return t >= d && t <= next
      }).length
      arr.push({ name: monthName, value })
    }
    return arr
  }, [leads])

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl bg-white/5" />
          <Skeleton className="h-64 rounded-2xl bg-white/5" />
        </div>
      ) : (
        <FM.motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          <div className="glass p-6 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
              <span>Activity Heatmap</span>
              <div className="flex items-center gap-1">
                <span className="text-xs">Less</span>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="h-3 w-3 rounded-[3px] border border-white/10" style={{ backgroundColor: `rgba(99,102,241,${0.08 + i * 0.18})` }} />
                ))}
                <span className="text-xs">More</span>
              </div>
            </div>
            <HeatmapCalendar data={heatData} weeks={20} />
          </div>
          <div className="glass p-6 lg:col-span-2">
            <div className="mb-3 text-sm text-slate-300">Monthly Conversions</div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FM.motion.div>
      )}
    </div>
  )
}

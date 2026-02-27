import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as FM from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { Skeleton } from '../components/Skeleton'
import api from '../services/api'
import { formatINR, formatIndianPhone } from '../utils/format'

export default function LeadDetails() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [updating, setUpdating] = useState(false)

  function load() {
    setLoading(true)
    api
      .get(`/leads/${id}`)
      .then((res) => {
        const payload = res.data || {}
        const lead = payload.lead || payload
        const notes = payload.notes || []
        setData({ lead, notes })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [id])

  async function addNote(e) {
    e.preventDefault()
    if (!note.trim()) return
    setUpdating(true)
    try {
      await api.post(`/notes/${id}`, { content: note })
      setNote('')
      toast.success('Note added')
      load()
    } finally {
      setUpdating(false)
    }
  }

  if (loading || !data?.lead) {
    return (
      <div>
        <Skeleton className="h-40 rounded-2xl bg-white/5" />
      </div>
    )
  }

  const lead = data?.lead
  const notes = data?.notes || []

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="glass p-6">
        <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Lead</div>
        <div className="mb-4 text-2xl font-semibold text-white">{lead.name}</div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300 lg:grid-cols-3">
          <div className="break-words">Email: {lead.email || '-'}</div>
          <div className="whitespace-nowrap">Phone: {formatIndianPhone(lead.phone)}</div>
          <div>Status: <span className="capitalize">{lead.status}</span></div>
          <div>Value: {formatINR(lead.value)}</div>
          <div>Source: {lead.source || '-'}</div>
          <div>Follow-up: {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '-'}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass p-6 lg:col-span-2">
          <div className="mb-3 text-sm font-medium text-slate-300">Timeline</div>
          {notes.length === 0 ? (
            <div className="text-sm text-slate-300">No notes yet</div>
          ) : (
            <div className="space-y-4">
              {notes.map((n, i) => (
                <FM.motion.div
                  key={n._id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: i * 0.03 }}
                  className="relative border-l border-white/10 pl-4"
                >
                  <div className="absolute -left-1 top-1 h-2 w-2 rounded-full bg-white/60" />
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                    <div>{n.content}</div>
                    <div className="mt-1 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                </FM.motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="glass p-6">
          <div className="mb-2 text-sm font-medium">Add Note</div>
          <form onSubmit={addNote} className="space-y-2">
            <textarea className="input h-28" value={note} onChange={(e) => setNote(e.target.value)} />
            <button disabled={updating} className="btn-primary w-full">{updating ? 'Saving...' : 'Add Note'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

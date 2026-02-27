import { useEffect, useMemo, useState } from 'react'
import * as FM from 'framer-motion'
import { Search, Filter } from 'lucide-react'
// toast placeholder for future use
// import toast from 'react-hot-toast'
import { Skeleton } from '../components/Skeleton'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import api from '../services/api'
import { formatINR, formatIndianPhone } from '../utils/format'
import { Pencil, Trash2, Plus } from 'lucide-react'

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
]

export default function LeadList() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState([])
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const emptyLead = { name: '', email: '', phone: '', status: 'new', source: '', value: '' }
  const [form, setForm] = useState(emptyLead)
  const [editingId, setEditingId] = useState(null)

  function fetchLeads() {
    setLoading(true)
    api
      .get('/leads', { params: { q, status } })
      .then((res) => setLeads(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  function onSearch(e) {
    e.preventDefault()
    fetchLeads()
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyLead)
    setShowForm(true)
  }

  function openEdit(lead) {
    setEditingId(lead._id)
    setForm({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status || 'new',
      source: lead.source || '',
      value: lead.value || '',
    })
    setShowForm(true)
  }

  async function onDelete(lead) {
    if (!window.confirm(`Delete lead "${lead.name}"?`)) return
    try {
      await api.delete(`/leads/${lead._id}`)
      fetchLeads()
      window.dispatchEvent(new CustomEvent('leads:changed'))
    } catch (e) {
      void e
    }
  }

  async function submitForm(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      value: Number(form.value || 0),
    }
    try {
      if (editingId) {
        await api.put(`/leads/${editingId}`, payload)
      } else {
        await api.post('/leads', payload)
      }
      setShowForm(false)
      setForm(emptyLead)
      fetchLeads()
      window.dispatchEvent(new CustomEvent('leads:changed'))
    } catch (e) {
      void e
    } finally {
      setSaving(false)
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return leads.filter((l) => {
      const matchesTerm =
        term === '' ||
        l.name.toLowerCase().includes(term) ||
        (l.email || '').toLowerCase().includes(term) ||
        (l.phone || '').toLowerCase().includes(term)
      const matchesStatus = status === 'all' || l.status === status
      return matchesTerm && matchesStatus
    })
  }, [leads, q, status])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-300">Manage your leads</div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Lead
        </button>
      </div>
      <form onSubmit={onSearch} className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="glass flex items-center gap-2 p-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input className="input" placeholder="Search name, email, phone" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="glass flex items-center gap-2 p-3">
          <Filter className="h-5 w-5 text-slate-400" />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <button className="btn-primary w-full md:w-auto">Apply</button>
        </div>
      </form>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur">
        <div className="hidden grid-cols-7 gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-wide text-slate-300 md:grid">
          <div className="col-span-1">Name</div>
          <div className="col-span-2">Email</div>
          <div>Phone</div>
          <div>Status</div>
          <div>Value (₹)</div>
          <div className="text-right">Actions</div>
        </div>
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-300">No leads found</div>
        ) : (
          filtered.map((lead, idx) => (
            <FM.motion.div
              key={lead._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: idx * 0.03 }}
              className="grid grid-cols-2 items-start gap-3 border-t border-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/5 md:grid-cols-7 md:items-center"
            >
              <Link to={`/leads/${lead._id}`} className="col-span-2 truncate font-medium text-white hover:underline md:col-span-1">
                {lead.name}
              </Link>
              <div className="col-span-2 hidden min-w-0 text-slate-300 md:block md:col-span-2">
                <span className="block truncate">{lead.email || '-'}</span>
              </div>
              <div className="hidden whitespace-nowrap text-slate-300 md:block">{formatIndianPhone(lead.phone)}</div>
              <div className="hidden md:block">
                <StatusBadge status={lead.status} />
              </div>
              <div className="hidden md:block">{formatINR(lead.value)}</div>

              <div className="md:hidden col-span-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="truncate">{lead.email || '-'}</span>
                <span className="mx-1 text-slate-500">•</span>
                <span className="whitespace-nowrap">{formatIndianPhone(lead.phone)}</span>
                <span className="mx-1 text-slate-500">•</span>
                <StatusBadge status={lead.status} />
                <span className="ml-auto font-medium text-white">{formatINR(lead.value)}</span>
              </div>

              <div className="col-span-2 mt-1 flex items-center justify-end gap-2 md:col-span-1 md:mt-0">
                <button title="Edit" type="button" onClick={() => openEdit(lead)} className="rounded-lg p-1.5 hover:bg-white/10">
                  <Pencil className="h-4 w-4 text-slate-300" />
                </button>
                <button title="Delete" type="button" onClick={() => onDelete(lead)} className="rounded-lg p-1.5 hover:bg-white/10">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </FM.motion.div>
          ))
        )}
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="glass w-full max-w-lg p-5">
            <div className="mb-3 text-lg font-semibold">{editingId ? 'Edit Lead' : 'New Lead'}</div>
            <form onSubmit={submitForm} className="grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2">
                <label className="mb-1 block">Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="mb-1 block">Email</label>
                <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Phone</label>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {['new', 'contacted', 'converted', 'lost'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block">Source</label>
                <input className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block">Value (₹)</label>
                <input className="input" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
              <div className="col-span-2 mt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-slate-300 hover:bg-white/10">
                  Cancel
                </button>
                <button disabled={saving} className="btn-primary">{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

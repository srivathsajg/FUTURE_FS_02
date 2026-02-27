import { NavLink } from 'react-router-dom'
import * as FM from 'framer-motion'
import { LayoutGrid, ListChecks, PieChart, UsersRound } from 'lucide-react'

function Item({ to, icon, label, delay = 0 }) {
  const Icon = icon
  return (
    <FM.motion.div initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay, duration: 0.2 }}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:shadow-lg ${isActive ? 'bg-white/10 text-white ring-1 ring-white/10' : ''}`
        }
      >
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded bg-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </NavLink>
    </FM.motion.div>
  )
}

export default function Sidebar() {
  return (
    <aside className="h-full w-64">
      <div className="mb-6 flex items-center gap-2 px-1">
        <div className="h-8 w-8 shrink-0 rounded-xl bg-white/10"></div>
        <div className="truncate text-lg font-semibold text-white">CLMS</div>
      </div>
      <nav className="space-y-1">
        <Item to="/" icon={LayoutGrid} label="Dashboard" delay={0.02} />
        <Item to="/leads" icon={UsersRound} label="Leads" delay={0.06} />
        <Item to="/analytics" icon={PieChart} label="Analytics" delay={0.1} />
      </nav>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
        <div className="mb-2 flex items-center gap-2 font-medium">
          <ListChecks className="h-4 w-4" />
          Quick Tips
        </div>
        Use the Leads tab to manage pipeline and add timeline notes.
      </div>
    </aside>
  )
}

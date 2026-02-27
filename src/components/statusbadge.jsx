const COLORS = {
  new: 'bg-blue-500/20 text-blue-400',
  contacted: 'bg-orange-500/20 text-orange-400',
  converted: 'bg-green-500/20 text-green-400',
}

export default function StatusBadge({ status = 'new' }) {
  const cls = COLORS[status] || COLORS.new
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ring-white/10 ${cls} capitalize`}>
      {status}
    </span>
  )
}

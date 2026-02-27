export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`} />
}

export function Spinner({ className = '' }) {
  return (
    <svg className={`h-5 w-5 animate-spin text-primary-600 ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  )
}

export function StatCard({ title, value, icon }) {
  const Icon = icon
  return (
    <div className="relative rounded-2xl p-[1px]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent opacity-60" />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-transform duration-200 hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">{title}</div>
            <div className="mt-1 text-3xl font-semibold text-white">{value}</div>
          </div>
          {Icon ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

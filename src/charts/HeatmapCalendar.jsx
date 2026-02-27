import { useMemo } from 'react'

function toKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function HeatmapCalendar({ data = {}, weeks = 20, maxValue }) {
  const { columns, max } = useMemo(() => {
    const end = new Date()
    const endDay = end.getDay()
    // start from the previous Sunday to align rows
    const start = new Date(end)
    start.setDate(end.getDate() - (weeks * 7 + endDay))
    const cols = []
    let localMax = 0
    for (let w = 0; w < weeks; w++) {
      const col = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(start)
        date.setDate(start.getDate() + w * 7 + d)
        const key = toKey(date)
        const val = data[key] || 0
        if (val > localMax) localMax = val
        col.push({ key, date, val })
      }
      cols.push(col)
    }
    return { columns: cols, max: localMax }
  }, [data, weeks])

  const cap = maxValue || max || 1
  function colorFor(v) {
    if (v <= 0) return 'rgba(99,102,241,0.08)'
    const pct = Math.min(1, v / cap)
    const a = 0.15 + pct * 0.65
    return `rgba(99,102,241,${a})`
  }

  return (
    <div className="flex items-start gap-1 overflow-x-auto">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((cell) => (
            <div
              key={cell.key}
              className="h-3 w-3 rounded-[3px] border border-white/10"
              title={`${cell.key}: ${cell.val}`}
              style={{ backgroundColor: colorFor(cell.val) }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}


import { AlignJustify } from 'lucide-react'

export default function Topbar({ title, children, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 mb-4 flex items-center justify-between rounded-none border-b border-white/10 bg-slate-900/40 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-slate-900/30 md:px-6 md:py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 md:hidden"
        >
          <AlignJustify className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </header>
  )
}

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { getTheme, setTheme } from '../utils/storage'

export default function ThemeToggle() {
  const [mode, setMode] = useState(() => getTheme())
  function toggle() {
    const next =
      mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark'
    setMode(next)
    setTheme(next)
  }
  const isDark = document.documentElement.classList.contains('dark')
  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      title="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as FM from 'framer-motion'
import { useState } from 'react'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  function closeMobile() {
    setMobileOpen(false)
  }
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile drawer */}
      <div className={`${mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-0 z-40 transition-opacity md:hidden`}>
        <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
        <FM.motion.aside
          initial={{ x: -280 }}
          animate={{ x: mobileOpen ? 0 : -280 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-y-0 left-0 w-72 p-4"
        >
          <div className="h-full glass overflow-y-auto p-4">
            <Sidebar />
          </div>
        </FM.motion.aside>
      </div>

      <FM.motion.aside
        initial={{ x: -12, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-y-0 left-0 hidden w-72 p-4 md:block"
      >
        <div className="h-full glass overflow-y-auto p-4">
          <Sidebar />
        </div>
      </FM.motion.aside>
      <div className="md:pl-72">
        <Topbar title="Client Lead Management" onMenuClick={() => setMobileOpen(true)} />
        <FM.motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="wrapper space-y-6"
        >
          <Outlet />
        </FM.motion.main>
      </div>
    </div>
  )
}

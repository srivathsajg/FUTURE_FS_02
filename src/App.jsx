import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import LeadList from './pages/leadlist'
import LeadDetails from './pages/LeadDetails'
import Analytics from './pages/Analytics'
import DashboardLayout from './layout/DashboardLayout'
import ProtectedRoute from './layout/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadList />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Posts from './pages/Posts'
import Reports from './pages/Reports'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

export type Page = 'dashboard' | 'users' | 'posts' | 'reports' | 'analytics' | 'settings'

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':  return <Dashboard />
      case 'users':      return <Users />
      case 'posts':      return <Posts />
      case 'reports':    return <Reports />
      case 'analytics':  return <Analytics />
      case 'settings':   return <Settings />
      default:           return <Dashboard />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        overflowY: 'auto',
      }}>
        {renderPage()}
      </main>
    </div>
  )
}

// Path: /frontend/src/App.jsx - FINAL UPDATE dengan LandingPage
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LandingPage from './pages/LandingPage'
import Login from './components/Login'
import StafDashboard from './pages/Dashboard/StafDashboard'
import LettersList from './pages/Letters/LettersList'
import LetterDetailPage from './pages/Letters/LetterDetailPage'
import ProtectedRoute from './components/ProtectedRoute'
import useAuth from './hooks/useAuth'
import DebugLetterForm from './components/Debug/DebugLetterForm'
import ProposalsList from './pages/Proposal/ProposalList'
import AgendaList from './pages/Agenda/AgendaList'
import ReportsList from './pages/Reports/ReportsList'
import Settings from './pages/Settings/SettingsPage'

// NEW: Import Executive Dashboard sesuai struktur path yang benar
import KetuaDashboard from './pages/Executive/KetuaDashboard'

// Import Disposisi Page
import DisposisiPage from './pages/Disposisi/DisposisiPage'

// Lazy load AddLetter component with error handling
const AddLetter = lazy(() =>
  import('./pages/Letters/AddLetter').catch(error => {
    console.warn('AddLetter component not found:', error)
    return {
      default: () => (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>AddLetter component tidak ditemukan</h2>
          <p>File AddLetter.jsx belum dibuat di /pages/Letters/</p>
        </div>
      )
    }
  })
)

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '18px',
        color: '#64748b'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Staff - path khusus */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StafDashboard />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Ketua - path khusus */}
        <Route
          path="/executive"
          element={
            <ProtectedRoute requireKetua={true}>
              <KetuaDashboard />
            </ProtectedRoute>
          }
        />

        {/* Smart redirect untuk authenticated users */}
        <Route path="/dashboard-redirect" element={
          user?.role === 'ketua' || user?.role === 'admin' ? 
            <Navigate to="/executive" replace /> : 
            <Navigate to="/dashboard" replace />
        } />

        {/* Protected Routes untuk semua user */}
        <Route
          path="/letters"
          element={
            <ProtectedRoute>
              <LettersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/letters/:id"
          element={
            <ProtectedRoute>
              <LetterDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/letters/add"
          element={
            <ProtectedRoute>
              <Suspense fallback={
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  Loading AddLetter...
                </div>
              }>
                <AddLetter />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        {/* Surat Management - sesuai struktur sebelumnya */}
        <Route
          path="/surat"
          element={
            <ProtectedRoute>
              <LettersList />
            </ProtectedRoute>
          }
        />

        {/* Agenda Management - sesuai struktur sebelumnya */}
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <AgendaList />
            </ProtectedRoute>
          }
        />

        {/* Proposals - untuk semua role */}
        <Route
          path="/proposals"
          element={
            <ProtectedRoute>
              <ProposalsList />
            </ProtectedRoute>
          }
        />

        {/* Disposisi Management - untuk semua role */}
        <Route
          path="/disposisi"
          element={
            <ProtectedRoute>
              <DisposisiPage />
            </ProtectedRoute>
          }
        />

        {/* Approval System - hanya Ketua dan Admin (sesuai chat sebelumnya) */}
        <Route
          path="/approval"
          element={
            <ProtectedRoute requireKetua={true}>
              <div style={{ padding: '20px' }}>
                <h2>Approval System</h2>
                <p>Component ini akan diintegrasikan dengan KetuaDashboard</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsList />
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Notifications - sesuai struktur sebelumnya */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <ReportsList />
            </ProtectedRoute>
          }
        />

        {/* Debug route - hanya untuk development */}
        <Route
          path="/debug-form"
          element={
            <ProtectedRoute>
              <DebugLetterForm />
            </ProtectedRoute>
          }
        />

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
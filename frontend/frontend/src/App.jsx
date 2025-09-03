// Path: /frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Login from './components/Login'
import StafDashboard from './pages/Dashboard/StafDashboard'
import LettersList from './pages/Letters/LettersList'
import ProtectedRoute from './components/ProtectedRoute'
import useAuth from './hooks/useAuth'
import DebugLetterForm from './components/Debug/DebugLetterForm'
import ProposalsList from './pages/Proposal/ProposalList'
import AgendaList from './pages/Agenda/AgendaList'
import ReportsList from './pages/Reports/ReportsList'
import Settings from './pages/Settings/SettingsPage'

// Lazy load AddLetter component with error handling
const AddLetter = lazy(() =>
  import('./pages/Letters/AddLetter').catch(error => {
    console.warn('AddLetter component not found:', error)
    // Return fallback component
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
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StafDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/letters"
          element={
            <ProtectedRoute>
              <LettersList />
            </ProtectedRoute>
          }
        />
        
        {/* AddLetter route dengan Suspense untuk lazy loading */}
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
        
        {/* Debug Route */}
        <Route 
          path="/debug-form" 
          element={
            <ProtectedRoute>
              <DebugLetterForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Under Development Pages */}
        <Route 
          path="/proposals" 
          element={
            <ProtectedRoute>
              <ProposalsList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agenda" 
          element={
            <ProtectedRoute>
              <AgendaList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <ReportsList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
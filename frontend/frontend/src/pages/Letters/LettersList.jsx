// Path: /frontend/src/pages/Letters/LettersList.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import LetterCard from '../../components/Letters/LetterCard'
import LetterFilters from '../../components/Letters/LetterFilters'
import useAuth from '../../hooks/useAuth'

const LettersList = () => {
  const { token } = useAuth()
  const navigate = useNavigate() // ADD: useNavigate hook
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    jenis: 'all',
    status: 'all',
    label: 'all',
    q: ''
  })
  const [pagination, setPagination] = useState({})

  const fetchLetters = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all' && filters[key] !== '') {
          queryParams.append(key, filters[key])
        }
      })

      const response = await fetch(`http://localhost:4000/api/letters?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setLetters(data.data.letters)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching letters:', error)
    } finally {
      setLoading(false)
    }
  }

  // ADD: Handler untuk navigate ke AddLetter
  const handleAddLetter = () => {
    console.log('Navigate to add letter') // DEBUG
    navigate('/letters/add')
  }

  useEffect(() => {
    if (token) {
      fetchLetters()
    }
  }, [token, filters])

  return (
    <DashboardLayout>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        height: '100%'
      }}>
        
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            minWidth: 0, 
            flex: 1 
          }}>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a202c'
            }}>
              Manajemen Surat
            </h1>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '16px'
            }}>
              Tambah Surat 
            </p>
          </div>

          {/* FIX: Add onClick handler */}
          <button 
            onClick={handleAddLetter}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
              transition: 'transform 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            + Tambah Surat
          </button>
        </div>

        {/* Filters Section */}
        <LetterFilters filters={filters} setFilters={setFilters} />

        {/* Content Section */}
        <div style={{
          flex: 1,
          width: '100%',
          minWidth: 0
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e2e8f0',
                borderTop: '4px solid #0ea5e9',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div style={{
                fontSize: '16px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Loading surat...
              </div>
            </div>
          ) : letters.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                📄
              </div>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '24px', 
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Belum Ada Surat
              </h3>
              <p style={{ 
                margin: '0 0 24px 0', 
                color: '#64748b',
                fontSize: '16px'
              }}>
                Mulai dengan menambahkan surat pertama Anda
              </p>
              {/* FIX: Add onClick handler to empty state button too */}
              <button 
                onClick={handleAddLetter}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Tambah Surat Sekarang
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: '24px',
              width: '100%'
            }}>
              {letters.map(letter => (
                <LetterCard key={letter.id} letter={letter} onUpdate={fetchLetters} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            padding: '20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <button style={{
              padding: '8px 16px',
              background: pagination.page > 1 ? '#0ea5e9' : '#e2e8f0',
              color: pagination.page > 1 ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: pagination.page > 1 ? 'pointer' : 'not-allowed'
            }}>
              ← Previous
            </button>
            
            <span style={{ 
              fontSize: '14px', 
              color: '#64748b',
              fontWeight: '500'
            }}>
              Halaman {pagination.page} dari {pagination.totalPages} • Total {pagination.total} surat
            </span>
            
            <button style={{
              padding: '8px 16px',
              background: pagination.page < pagination.totalPages ? '#0ea5e9' : '#e2e8f0',
              color: pagination.page < pagination.totalPages ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: pagination.page < pagination.totalPages ? 'pointer' : 'not-allowed'
            }}>
              Next →
            </button>
          </div>
        )}

        {/* Loading Animation CSS */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </DashboardLayout>
  )
}

export default LettersList
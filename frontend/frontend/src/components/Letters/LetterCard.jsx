// Path: /frontend/src/components/Letters/LetterCard.jsx
import { useState } from 'react'
import LetterDetailModal from './LetterDetailModal'

const LetterCard = ({ letter, onUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view')

  const getStatusColor = (status) => {
    switch (status) {
      case 'baru': return { bg: '#fef3c7', text: '#92400e', label: 'Baru' }
      case 'proses': return { bg: '#dbeafe', text: '#1e40af', label: 'Dalam Proses' }
      case 'selesai': return { bg: '#d1fae5', text: '#065f46', label: 'Selesai' }
      case 'ditolak': return { bg: '#fee2e2', text: '#991b1b', label: 'Ditolak' }
      default: return { bg: '#f3f4f6', text: '#374151', label: status }
    }
  }

  const getLabelColor = (label) => {
    switch (label) {
      case 'merah': return '#ef4444'
      case 'kuning': return '#f59e0b'
      case 'hijau': return '#10b981'
      case 'hitam': return '#374151'
      default: return '#6b7280'
    }
  }

  const getJenisIcon = (jenis) => {
    switch (jenis) {
      case 'pengaduan': return '📝'
      case 'pemberitahuan': return '📢'
      case 'undangan': return '📅'
      case 'audiensi': return '🤝'
      case 'proposal': return '📋'
      default: return '📄'
    }
  }

  const getJenisGradient = (jenis) => {
    switch (jenis) {
      case 'pengaduan': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      case 'pemberitahuan': return 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
      case 'undangan': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
      case 'audiensi': return 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
      case 'proposal': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
    }
  }

  const statusInfo = getStatusColor(letter.status)
  const labelColor = getLabelColor(letter.label)
  const jenisIcon = getJenisIcon(letter.jenis)
  const jenisGradient = getJenisGradient(letter.jenis)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleDownloadDisposisi = () => {
    const url = `http://localhost:4000/api/dispositions/${letter.id}/pdf`
    window.open(url, '_blank')
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Poppins', sans-serif"
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-4px)'
      e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)'
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)'
      e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
    }}
    >
      
      {/* Header dengan gradient */}
      <div style={{
        background: jenisGradient,
        padding: '20px 24px',
        color: 'white',
        position: 'relative'
      }}>
        
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          width: '60px',
          height: '60px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              backdropFilter: 'blur(10px)'
            }}>
              {jenisIcon}
            </div>
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '4px'
              }}>
                {letter.no_surat}
              </div>
              <div style={{
                fontSize: '13px',
                opacity: 0.9,
                textTransform: 'capitalize',
                fontWeight: '500'
              }}>
                {letter.jenis}
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)'
          }}>
            {statusInfo.label}
          </div>
        </div>

        {/* Label warna indicator */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: labelColor
        }}></div>
      </div>

      {/* Content Body */}
      <div style={{
        padding: '24px'
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#1a202c',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {letter.perihal}
        </h3>
        
        <div style={{
          background: '#f8fafc',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#64748b',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            Asal Surat:
          </div>
          <div style={{
            fontSize: '14px',
            color: '#374151',
            fontWeight: '600'
          }}>
            {letter.asal_surat}
          </div>
        </div>

        <div style={{
          fontSize: '13px',
          color: '#6b7280',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '20px',
          minHeight: '60px'
        }}>
          {letter.uraian}
        </div>

        {/* Footer info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
          fontSize: '12px'
        }}>
          <div style={{
            background: '#f1f5f9',
            padding: '8px 12px',
            borderRadius: '8px'
          }}>
            <div style={{ color: '#64748b', marginBottom: '2px' }}>Tanggal Terima</div>
            <div style={{ color: '#374151', fontWeight: '600' }}>
              {formatDate(letter.tanggal_terima)}
            </div>
          </div>
          <div style={{
            background: '#f1f5f9',
            padding: '8px 12px',
            borderRadius: '8px'
          }}>
            <div style={{ color: '#64748b', marginBottom: '2px' }}>Tanggal Surat</div>
            <div style={{ color: '#374151', fontWeight: '600' }}>
              {formatDate(letter.tanggal_surat)}
            </div>
          </div>
        </div>

        {/* Action buttons - 3 BUTTONS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px'
        }}>
          <button 
            onClick={() => {
              setModalMode('view')
              setModalOpen(true)
            }}
            style={{
              padding: '10px 8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e2e8f0'
              e.target.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f8fafc'
              e.target.style.color = '#64748b'
            }}
          >
            👁️ Detail
          </button>
          
          <button 
            onClick={() => {
              setModalMode('edit')
              setModalOpen(true)
            }}
            style={{
              padding: '10px 8px',
              background: jenisGradient,
              border: 'none',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ✏️ Edit
          </button>

          <button 
            onClick={handleDownloadDisposisi}
            style={{
              padding: '10px 8px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              border: 'none',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            📄 File Disposisi
          </button>
        </div>
      </div>

      {/* Modal */}
      <LetterDetailModal
        letter={letter}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={onUpdate}
        mode={modalMode}
      />
    </div>
  )
}

export default LetterCard
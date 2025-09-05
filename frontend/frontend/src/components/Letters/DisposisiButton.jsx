import { useState } from 'react'
import useAuth from '../../hooks/useAuth'

const DisposisiButton = ({ 
  letterId, 
  size = 'medium',
  variant = 'primary',
  showText = true 
}) => {
  const { token } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)

  // Size variants
  const sizeStyles = {
    small: {
      padding: '6px 12px',
      fontSize: '12px',
      iconSize: '14px'
    },
    medium: {
      padding: '10px 16px', 
      fontSize: '13px',
      iconSize: '16px'
    },
    large: {
      padding: '12px 20px',
      fontSize: '14px', 
      iconSize: '18px'
    }
  }

  // Color variants
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    secondary: {
      background: 'white',
      color: '#f97316',
      border: '2px solid #f97316',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    minimal: {
      background: 'transparent',
      color: '#64748b',
      border: '1px solid #e5e7eb',
      boxShadow: 'none'
    }
  }

  const currentSize = sizeStyles[size]
  const currentVariant = variantStyles[variant]

  // Generate and download PDF disposisi
  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch(`http://localhost:4000/api/letters/${letterId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Gagal generate PDF disposisi')
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `disposisi-${letterId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Gagal generate PDF disposisi: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      style={{
        ...currentSize,
        ...currentVariant,
        borderRadius: '10px',
        fontWeight: '600',
        cursor: isGenerating ? 'not-allowed' : 'pointer',
        opacity: isGenerating ? 0.7 : 1,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        if (!isGenerating && variant === 'primary') {
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isGenerating && variant === 'primary') {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)'
        }
      }}
    >
      {isGenerating ? (
        <>
          <div style={{
            width: currentSize.iconSize,
            height: currentSize.iconSize,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          {showText && 'Generating...'}
        </>
      ) : (
        <>
          <span style={{ fontSize: currentSize.iconSize }}>📄</span>
          {showText && 'PDF Disposisi'}
        </>
      )}

      {/* Loading Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}

export default DisposisiButton
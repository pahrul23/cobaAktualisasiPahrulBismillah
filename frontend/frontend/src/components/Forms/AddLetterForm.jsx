// Path: /frontend/src/pages/letters/AddLetter.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import LetterFormFields from '../../components/Forms/LetterFormFields'
import useAuth from '../../hooks/useAuth'

const AddLetter = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [selectedJenis, setSelectedJenis] = useState('')
  const [formData, setFormData] = useState({
    jenis: '',
    no_disposisi: '',
    no_surat: '',
    asal_surat: '',
    perihal: '',
    tanggal_terima: '',
    tanggal_surat: '',
    uraian: '',
    keterangan: '',
    label: 'hitam',
    file_surat: null // â¬…ï¸ tambahin biar konsisten sama FileUpload
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const jenisOptions = [
    { value: '', label: 'Pilih Jenis Surat', disabled: true },
    { value: 'pengaduan', label: 'Pengaduan', icon: 'ðŸ“', color: '#ef4444' },
    { value: 'pemberitahuan', label: 'Pemberitahuan', icon: 'ðŸ“¢', color: '#0ea5e9' },
    { value: 'undangan', label: 'Undangan', icon: 'ðŸ“…', color: '#8b5cf6' },
    { value: 'audiensi', label: 'Audiensi', icon: 'ðŸ¤', color: '#f59e0b' },
    { value: 'proposal', label: 'Proposal', icon: 'ðŸ“‹', color: '#10b981' }
  ]

  const labelOptions = [
    { value: 'merah', label: 'Merah', color: '#ef4444' },
    { value: 'kuning', label: 'Kuning', color: '#f59e0b' },
    { value: 'hijau', label: 'Hijau', color: '#10b981' },
    { value: 'hitam', label: 'Hitam', color: '#374151' }
  ]

  const handleJenisChange = (jenis) => {
    setSelectedJenis(jenis)
    setFormData({ ...formData, jenis })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Buat FormData untuk kirim data + file
      const submitData = new FormData()

      // Append semua field form
      Object.keys(formData).forEach((key) => {
        if (key === 'file_surat' && formData[key]) {
          // skip karena file_surat kita handle terpisah
          return
        }
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ''
        ) {
          submitData.append(key, formData[key])
        }
      })

      // Handle file_surat
      if (formData.file_surat && formData.file_surat.originalFile) {
        submitData.append('file_surat', formData.file_surat.originalFile)
      }

      const response = await fetch('http://localhost:4000/api/letters', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // âŒ jangan set Content-Type, biar browser otomatis isi boundary
        },
        body: submitData
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Surat berhasil dibuat!')
        setTimeout(() => {
          navigate('/letters')
        }, 2000)
      } else {
        setMessage(data.message || 'Gagal membuat surat')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setMessage('Koneksi ke server gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          <button
            onClick={() => navigate('/letters')}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.target.style.background = '#e2e8f0')}
            onMouseLeave={(e) => (e.target.style.background = '#f8fafc')}
          >
            â†
          </button>

          <div>
            <h1
              style={{
                margin: '0 0 4px 0',
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a202c'
              }}
            >
              Tambah Surat Baru
            </h1>
            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: '16px'
              }}
            >
              Pilih jenis surat dan isi informasi yang diperlukan
            </p>
          </div>
        </div>

        {/* Jenis Surat */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            marginBottom: '24px'
          }}
        >
          <h2
            style={{
              margin: '0 0 24px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a202c'
            }}
          >
            Pilih Jenis Surat
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px'
            }}
          >
            {jenisOptions.slice(1).map((option) => (
              <div
                key={option.value}
                onClick={() => handleJenisChange(option.value)}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border:
                    selectedJenis === option.value
                      ? '2px solid #0ea5e9'
                      : '2px solid #e5e7eb',
                  background:
                    selectedJenis === option.value
                      ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
                      : 'white',
                  color: selectedJenis === option.value ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  if (selectedJenis !== option.value) {
                    e.target.style.borderColor = '#0ea5e9'
                    e.target.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedJenis !== option.value) {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.transform = 'translateY(0)'
                  }
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    marginBottom: '8px'
                  }}
                >
                  {option.icon}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {option.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        {selectedJenis && (
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                marginBottom: '24px'
              }}
            >
              <LetterFormFields
                jenis={selectedJenis}
                formData={formData}
                setFormData={setFormData}
                labelOptions={labelOptions}
              />
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'flex-end'
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/letters')}
                style={{
                  padding: '14px 28px',
                  background: '#f8fafc',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target.style.background = '#e2e8f0')}
                onMouseLeave={(e) => (e.target.style.background = '#f8fafc')}
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 28px',
                  background: loading
                    ? '#cbd5e0'
                    : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.transform = 'translateY(0)'
                }}
              >
                {loading ? 'Menyimpan...' : 'Simpan Surat'}
              </button>
            </div>

            {/* Pesan */}
            {message && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px 20px',
                  backgroundColor: message.includes('berhasil')
                    ? '#ecfdf5'
                    : '#fef2f2',
                  color: message.includes('berhasil') ? '#065f46' : '#dc2626',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: `1px solid ${
                    message.includes('berhasil') ? '#a7f3d0' : '#fecaca'
                  }`,
                  textAlign: 'center'
                }}
              >
                {message}
              </div>
            )}
          </form>
        )}

        {/* Helper */}
        {!selectedJenis && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#64748b',
              fontSize: '16px'
            }}
          >
            Silakan pilih jenis surat terlebih dahulu untuk melanjutkan
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AddLetter
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import useAuth from '../../hooks/useAuth'

const SettingsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('theme') || 'terang'
  })

  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupMessage, setBackupMessage] = useState('')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'terang'
    setSelectedTheme(savedTheme)
    
    if (savedTheme === 'terang') return
    
    const style = document.createElement('style')
    style.id = 'admire-theme'
    
    if (savedTheme === 'dark') {
      style.textContent = `
        body {
          background: #111827 !important;
        }
        .main-content, [style*="background: #f8fafc"], [style*="background: white"] {
          background: #1f2937 !important;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #f9fafb !important;
        }
        p, span, label {
          color: #d1d5db !important;
        }
        input, select, textarea {
          background: #374151 !important;
          color: #f9fafb !important;
          border-color: #4b5563 !important;
        }
      `
    } else if (savedTheme === 'lucu') {
      style.textContent = `
        body {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%) !important;
        }
        .main-content, [style*="background: #f8fafc"], [style*="background: white"] {
          background: rgba(252, 231, 243, 0.8) !important;
          backdrop-filter: blur(10px) !important;
        }
        h1, h2, h3, h4, h5, h6 {
          background: linear-gradient(135deg, #ec4899, #f472b6, #fb7185) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          font-weight: 800 !important;
        }
      `
    }
    
    document.head.appendChild(style)
  }, [])

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'system', label: 'Sistem', icon: '⚙️' },
    { id: 'security', label: 'Keamanan', icon: '🔒' }
  ]

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password minimal 8 karakter'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password harus mengandung minimal 1 huruf besar'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password harus mengandung minimal 1 huruf kecil'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password harus mengandung minimal 1 angka'
    }
    return null
  }

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme)
    localStorage.setItem('theme', theme)
    
    const style = document.createElement('style')
    style.id = 'admire-theme'
    
    const oldStyle = document.getElementById('admire-theme')
    if (oldStyle) oldStyle.remove()
    
    if (theme === 'dark') {
      style.textContent = `
        body {
          background: #111827 !important;
        }
        .main-content, [style*="background: #f8fafc"], [style*="background: white"] {
          background: #1f2937 !important;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #f9fafb !important;
        }
        p, span, label {
          color: #d1d5db !important;
        }
        input, select, textarea {
          background: #374151 !important;
          color: #f9fafb !important;
          border-color: #4b5563 !important;
        }
      `
    } else if (theme === 'lucu') {
      style.textContent = `
        body {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%) !important;
        }
        .main-content, [style*="background: #f8fafc"], [style*="background: white"] {
          background: rgba(252, 231, 243, 0.8) !important;
          backdrop-filter: blur(10px) !important;
        }
        h1, h2, h3, h4, h5, h6 {
          background: linear-gradient(135deg, #ec4899, #f472b6, #fb7185) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          font-weight: 800 !important;
        }
      `
    } else {
      if (oldStyle) oldStyle.remove()
      return
    }
    
    document.head.appendChild(style)
    alert(`Tema ${theme === 'dark' ? '🌙 Gelap' : theme === 'lucu' ? '💖 Pink Lucu' : '☀️ Terang'} berhasil diterapkan!`)
  }

  const handleDatabaseBackup = async () => {
    setIsBackingUp(true)
    setBackupMessage('')

    try {
      const response = await fetch('/api/letters?all=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server')
      }

      const result = await response.json()
      
      let letters = []
      
      if (Array.isArray(result)) {
        letters = result
      } else if (result.data && result.data.letters && Array.isArray(result.data.letters)) {
        letters = result.data.letters
      } else if (result.data && Array.isArray(result.data)) {
        letters = result.data
      } else if (result.letters && Array.isArray(result.letters)) {
        letters = result.letters
      } else if (result.success && Array.isArray(result.data)) {
        letters = result.data
      } else {
        throw new Error('Format data tidak valid')
      }

      if (letters.length === 0) {
        throw new Error('Tidak ada data untuk di-backup')
      }

      const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')

      const excelData = letters.map((letter, index) => ({
        'No': index + 1,
        'ID': letter.id || '-',
        'Jenis': letter.jenis || '-',
        'No Disposisi': letter.no_disposisi || '-',
        'Nomor Surat': letter.nomor_surat || '-',
        'Asal Surat': letter.asal_surat || '-',
        'Perihal': letter.perihal || '-',
        'Tanggal Terima': letter.tanggal_terima ? new Date(letter.tanggal_terima).toLocaleDateString('id-ID') : '-',
        'Tanggal Surat': letter.tanggal_surat ? new Date(letter.tanggal_surat).toLocaleDateString('id-ID') : '-',
        'Uraian': letter.uraian || '-',
        'Keterangan': letter.keterangan || '-',
        'Label': letter.label || '-',
        'Status': letter.status || '-',
        'Created By': letter.created_by || '-',
        'Created At': letter.created_at ? new Date(letter.created_at).toLocaleString('id-ID') : '-',
        'Updated At': letter.updated_at ? new Date(letter.updated_at).toLocaleString('id-ID') : '-',
        'File Path': letter.file_path || '-',
        'File Surat': letter.file_surat || '-',
        'File Surat Name': letter.file_surat_name || '-',
        'File Surat Size': letter.file_surat_size || '-',
        'Disposisi File Path': letter.disposisi_file_path || '-',
        'Disposisi Generated At': letter.disposisi_generated_at ? new Date(letter.disposisi_generated_at).toLocaleString('id-ID') : '-'
      }))

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      ws['!cols'] = [
        { wch: 5 }, { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 30 },
        { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 30 }, { wch: 15 },
        { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 30 },
        { wch: 30 }, { wch: 15 }, { wch: 30 }, { wch: 20 }
      ]

      XLSX.utils.book_append_sheet(wb, ws, 'Data Surat')

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const filename = `ADMIRE_Backup_${timestamp}.xlsx`

      XLSX.writeFile(wb, filename)

      setBackupMessage(`✅ Berhasil backup ${letters.length} data surat ke file Excel!`)

    } catch (error) {
      setBackupMessage('❌ Gagal melakukan backup: ' + error.message)
    } finally {
      setIsBackingUp(false)
      setTimeout(() => setBackupMessage(''), 5000)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    setPasswordSuccess('')

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Semua field harus diisi')
      return
    }

    const passwordValidation = validatePassword(passwordData.newPassword)
    if (passwordValidation) {
      setPasswordError(passwordValidation)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Password baru dan konfirmasi password tidak cocok')
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('Password baru tidak boleh sama dengan password lama')
      return
    }

    setIsUpdatingPassword(true)

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengubah password')
      }

      setPasswordSuccess('Password berhasil diubah! Silakan login kembali dengan password baru.')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      setTimeout(() => {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }, 2000)

    } catch (error) {
      setPasswordError(error.message || 'Terjadi kesalahan saat mengubah password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <DashboardLayout>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        display: 'grid',
        gap: '24px',
        width: '100%'
      }}>
        
        <div>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a202c'
          }}>
            Pengaturan Sistem
          </h1>
          <p style={{
            margin: 0,
            color: '#64748b',
            fontSize: '16px'
          }}>
            Kelola pengaturan profil dan sistem aplikasi
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          display: 'flex',
          gap: '4px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '16px',
                border: 'none',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          minHeight: '400px'
        }}>
          
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gap: '32px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '80px',
                  marginBottom: '16px',
                  animation: 'bounce 2s infinite'
                }}>
                  🏛️
                </div>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '28px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Sekretariat Ketua DPD RI
                </h2>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                  borderRadius: '24px',
                  padding: '32px',
                  border: '3px solid #f9a8d4',
                  boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    fontSize: '120px',
                    opacity: '0.1',
                    transform: 'rotate(-15deg)'
                  }}>
                    📝
                  </div>
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '24px'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        boxShadow: '0 4px 16px rgba(236, 72, 153, 0.3)'
                      }}>
                        🏢
                      </div>
                      <div>
                        <h3 style={{
                          margin: '0 0 4px 0',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#ec4899'
                        }}>
                          Nama Organisasi
                        </h3>
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#db2777',
                          fontWeight: '500'
                        }}>
                          Informasi resmi instansi
                        </p>
                      </div>
                    </div>

                    <div style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '2px solid #f9a8d4'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a202c',
                        lineHeight: '1.6'
                      }}>
                        Sekretariat Ketua DPD RI
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #ddd6fe 0%, #e9d5ff 100%)',
                  borderRadius: '24px',
                  padding: '32px',
                  border: '3px solid #c4b5fd',
                  boxShadow: '0 8px 32px rgba(167, 139, 250, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    fontSize: '120px',
                    opacity: '0.1',
                    transform: 'rotate(15deg)'
                  }}>
                    ✉️
                  </div>
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '24px'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        boxShadow: '0 4px 16px rgba(167, 139, 250, 0.3)'
                      }}>
                        📧
                      </div>
                      <div>
                        <h3 style={{
                          margin: '0 0 4px 0',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#7c3aed'
                        }}>
                          Email Resmi
                        </h3>
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#6d28d9',
                          fontWeight: '500'
                        }}>
                          Kontak komunikasi
                        </p>
                      </div>
                    </div>

                    <div style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '2px solid #c4b5fd'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a202c',
                        wordBreak: 'break-all'
                      }}>
                        setketua@dpd.go.id
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: '24px',
                padding: '32px',
                border: '3px dashed #fbbf24',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  ⭐✨🌟
                </div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#d97706'
                }}>
                  Sistem Manajemen Surat Digital
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#92400e',
                  fontWeight: '500'
                }}>
                  ADMIRE - Aplikasi Digital Manajemen Informasi & Rekam Elektronik
                </p>
              </div>

              <style>{`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-20px); }
                }
              `}</style>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <h2 style={{
                margin: '0 0 24px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Pengaturan Sistem
              </h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{
                  background: '#f8fafc',
                  padding: '24px',
                  borderRadius: '16px'
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a202c'
                  }}>
                    🎨 Tema Aplikasi
                  </h3>
                  <p style={{
                    margin: '0 0 20px 0',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    Pilih tema tampilan yang sesuai dengan preferensi Anda
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px'
                  }}>
                    <button
                      onClick={() => handleThemeChange('terang')}
                      style={{
                        padding: '16px',
                        border: selectedTheme === 'terang' ? '3px solid #0ea5e9' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        background: selectedTheme === 'terang' ? '#e0f2fe' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <div style={{ fontSize: '32px' }}>☀️</div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: selectedTheme === 'terang' ? '#0ea5e9' : '#374151'
                      }}>
                        Terang
                      </div>
                      {selectedTheme === 'terang' && (
                        <div style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: '500' }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => handleThemeChange('dark')}
                      style={{
                        padding: '16px',
                        border: selectedTheme === 'dark' ? '3px solid #6366f1' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        background: selectedTheme === 'dark' ? '#e0e7ff' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <div style={{ fontSize: '32px' }}>🌙</div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: selectedTheme === 'dark' ? '#6366f1' : '#374151'
                      }}>
                        Gelap
                      </div>
                      {selectedTheme === 'dark' && (
                        <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: '500' }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => handleThemeChange('lucu')}
                      style={{
                        padding: '16px',
                        border: selectedTheme === 'lucu' ? '3px solid #ec4899' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        background: selectedTheme === 'lucu' ? '#fce7f3' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <div style={{ fontSize: '32px' }}>💖</div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: selectedTheme === 'lucu' ? '#ec4899' : '#374151'
                      }}>
                        Pink Lucu
                      </div>
                      {selectedTheme === 'lucu' && (
                        <div style={{ fontSize: '12px', color: '#ec4899', fontWeight: '500' }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  padding: '24px',
                  borderRadius: '16px'
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a202c'
                  }}>
                    💾 Backup Database
                  </h3>
                  <p style={{
                    margin: '0 0 16px 0',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    Download semua data surat dalam format Excel (.xlsx) untuk backup atau migrasi data
                  </p>

                  {backupMessage && (
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      background: backupMessage.includes('✅') ? '#d1fae5' : '#fee2e2',
                      border: backupMessage.includes('✅') ? '1px solid #6ee7b7' : '1px solid #fca5a5',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: backupMessage.includes('✅') ? '#059669' : '#dc2626'
                    }}>
                      {backupMessage}
                    </div>
                  )}

                  <button
                    onClick={handleDatabaseBackup}
                    disabled={isBackingUp}
                    style={{
                      background: isBackingUp ? '#94a3b8' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isBackingUp ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isBackingUp ? (
                      <>
                        <span style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid white',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.6s linear infinite'
                        }}></span>
                        Memproses Backup...
                      </>
                    ) : (
                      <>
                        📥 Backup Sekarang
                      </>
                    )}
                  </button>

                  <p style={{
                    margin: '12px 0 0 0',
                    fontSize: '12px',
                    color: '#64748b',
                    fontStyle: 'italic'
                  }}>
                    💡 File backup akan didownload dalam format Excel (.xlsx) dengan timestamp
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{
                margin: '0 0 24px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Ubah Password
              </h2>

              <div style={{ maxWidth: '600px' }}>
                {passwordError && (
                  <div style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '24px' }}>⚠️</span>
                    <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
                      {passwordError}
                    </span>
                  </div>
                )}

                {passwordSuccess && (
                  <div style={{
                    background: '#d1fae5',
                    border: '1px solid #6ee7b7',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '24px' }}>✅</span>
                    <span style={{ color: '#059669', fontSize: '14px', fontWeight: '500' }}>
                      {passwordSuccess}
                    </span>
                  </div>
                )}

                <div style={{ display: 'grid', gap: '24px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Password Saat Ini <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="Masukkan password saat ini"
                        disabled={isUpdatingPassword}
                        style={{
                          width: '100%',
                          padding: '12px 48px 12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <button
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          padding: '4px'
                        }}
                      >
                        {showPasswords.current ? '👁️' : '🙈'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Password Baru <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Masukkan password baru"
                        disabled={isUpdatingPassword}
                        style={{
                          width: '100%',
                          padding: '12px 48px 12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <button
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          padding: '4px'
                        }}
                      >
                        {showPasswords.new ? '👁️' : '🙈'}
                      </button>
                    </div>
                    <p style={{
                      margin: '8px 0 0 0',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      Password minimal 8 karakter, kombinasi huruf besar, huruf kecil, dan angka
                    </p>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Konfirmasi Password Baru <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Konfirmasi password baru"
                        disabled={isUpdatingPassword}
                        style={{
                          width: '100%',
                          padding: '12px 48px 12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <button
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          padding: '4px'
                        }}
                      >
                        {showPasswords.confirm ? '👁️' : '🙈'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                      onClick={handlePasswordChange}
                      disabled={isUpdatingPassword}
                      style={{
                        background: isUpdatingPassword 
                          ? '#94a3b8' 
                          : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px 28px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isUpdatingPassword ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {isUpdatingPassword ? (
                        <>
                          <span style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.6s linear infinite'
                          }}></span>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          🔒 Ubah Password
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                        setPasswordError('')
                        setPasswordSuccess('')
                      }}
                      disabled={isUpdatingPassword}
                      style={{
                        background: 'white',
                        color: '#64748b',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '14px 28px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isUpdatingPassword ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '40px',
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a202c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  💡 Tips Keamanan Password
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: '24px',
                  color: '#64748b',
                  fontSize: '14px',
                  lineHeight: '1.8'
                }}>
                  <li>Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol</li>
                  <li>Jangan gunakan informasi pribadi yang mudah ditebak</li>
                  <li>Ubah password secara berkala (minimal 3 bulan sekali)</li>
                  <li>Jangan gunakan password yang sama untuk berbagai akun</li>
                  <li>Simpan password di tempat yang aman</li>
                </ul>
              </div>

              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage
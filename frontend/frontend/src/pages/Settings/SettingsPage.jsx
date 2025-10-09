import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import useAuth from '../../hooks/useAuth'

const SettingsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  
  // Password state
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

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('theme') || 'terang'
  })

  // Backup state
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupMessage, setBackupMessage] = useState('')

  // Apply theme on mount
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
          background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fbcfe8 100%) !important;
        }
        .main-content, [style*="background: #f8fafc"], [style*="background: white"] {
          background: rgba(254, 243, 199, 0.7) !important;
          backdrop-filter: blur(10px) !important;
        }
        h1, h2, h3, h4, h5, h6 {
          background: linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6) !important;
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

  // Validate password
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

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    // Validasi input
    if (!profileData.name || !profileData.email) {
      setProfileError('Nama dan email harus diisi')
      return
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      setProfileError('Format email tidak valid')
      return
    }

    setIsUpdatingProfile(true)

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengupdate profile')
      }

      setProfileSuccess('Profile berhasil diupdate!')

    } catch (error) {
      setProfileError(error.message || 'Terjadi kesalahan saat mengupdate profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Handle theme change
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme)
    localStorage.setItem('theme', theme)
    
    // Apply theme with custom CSS
    const style = document.createElement('style')
    style.id = 'admire-theme'
    
    // Remove old theme
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
          background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fbcfe8 100%) !important;
        }
        .main-content, [style*="background: #f8fafc"], [style*="background: white"] {
          background: rgba(254, 243, 199, 0.7) !important;
          backdrop-filter: blur(10px) !important;
        }
        h1, h2, h3, h4, h5, h6 {
          background: linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          font-weight: 800 !important;
        }
      `
    } else {
      // Tema terang - remove all overrides
      if (oldStyle) oldStyle.remove()
      return
    }
    
    document.head.appendChild(style)
    alert(`Tema ${theme === 'dark' ? '🌙 Gelap' : '🎨 Lucu'} berhasil diterapkan!`)
  }

  // Handle database backup - Export to Excel
  const handleDatabaseBackup = async () => {
    setIsBackingUp(true)
    setBackupMessage('')

    try {
      // Fetch all letters data
      const response = await fetch('/api/letters?all=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server')
      }

      const result = await response.json()
      
      // Handle different response formats
      let letters = []
      
      // Case 1: Direct array
      if (Array.isArray(result)) {
        letters = result
      }
      // Case 2: {data: {letters: []}} - YOUR API FORMAT
      else if (result.data && result.data.letters && Array.isArray(result.data.letters)) {
        letters = result.data.letters
      }
      // Case 3: {data: []}
      else if (result.data && Array.isArray(result.data)) {
        letters = result.data
      }
      // Case 4: {letters: []}
      else if (result.letters && Array.isArray(result.letters)) {
        letters = result.letters
      }
      // Case 5: {success: true, data: []}
      else if (result.success && Array.isArray(result.data)) {
        letters = result.data
      }
      else {
        console.error('Cannot find letters array in response:', result)
        throw new Error('Format data tidak valid - struktur data tidak sesuai')
      }

      console.log('Letters found:', letters.length)

      if (letters.length === 0) {
        throw new Error('Tidak ada data untuk di-backup')
      }

      // Dynamically import xlsx
      const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')

      // Prepare data for Excel
      const excelData = letters.map((letter, index) => ({
        'No': index + 1,
        'Nomor Surat': letter.nomor_surat || '-',
        'Tanggal Surat': letter.tanggal_surat ? new Date(letter.tanggal_surat).toLocaleDateString('id-ID') : '-',
        'Pengirim': letter.pengirim || '-',
        'Perihal': letter.perihal || '-',
        'Kategori': letter.kategori || '-',
        'Status': letter.status || '-',
        'Tanggal Diterima': letter.created_at ? new Date(letter.created_at).toLocaleDateString('id-ID') : '-'
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 20 }, // Nomor Surat
        { wch: 15 }, // Tanggal Surat
        { wch: 30 }, // Pengirim
        { wch: 40 }, // Perihal
        { wch: 15 }, // Kategori
        { wch: 15 }, // Status
        { wch: 15 }  // Tanggal Diterima
      ]

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Data Surat')

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const filename = `ADMIRE_Backup_${timestamp}.xlsx`

      // Write and download
      XLSX.writeFile(wb, filename)

      setBackupMessage(`✅ Berhasil backup ${letters.length} data surat ke file Excel!`)

    } catch (error) {
      console.error('Backup error:', error)
      setBackupMessage('❌ Gagal melakukan backup: ' + error.message)
    } finally {
      setIsBackingUp(false)
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setBackupMessage('')
      }, 5000)
    }
  }

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordError('')
    setPasswordSuccess('')

    // Validation
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

      // Optional: Auto logout after 2 seconds
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
        
        {/* Header */}
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

        {/* Tab Navigation */}
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

        {/* Tab Content */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          minHeight: '400px'
        }}>
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <h2 style={{
                margin: '0 0 16px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Informasi Profil
              </h2>

              {/* Alert Messages */}
              {profileError && (
                <div style={{
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                  <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
                    {profileError}
                  </span>
                </div>
              )}

              {profileSuccess && (
                <div style={{
                  background: '#d1fae5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <span style={{ color: '#059669', fontSize: '14px', fontWeight: '500' }}>
                    {profileSuccess}
                  </span>
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Nama Lengkap <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={isUpdatingProfile}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={isUpdatingProfile}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: '#f8fafc',
                      color: '#64748b',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingProfile}
                  style={{
                    background: isUpdatingProfile 
                      ? '#94a3b8' 
                      : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isUpdatingProfile ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isUpdatingProfile ? (
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
                    'Simpan Perubahan'
                  )}
                </button>

                <button
                  onClick={() => {
                    setProfileData({
                      name: user?.name || '',
                      email: user?.email || ''
                    })
                    setProfileError('')
                    setProfileSuccess('')
                  }}
                  disabled={isUpdatingProfile}
                  style={{
                    background: 'white',
                    color: '#64748b',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isUpdatingProfile ? 'not-allowed' : 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* SYSTEM TAB */}
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
              
              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                {/* Theme Selector */}
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
                    {/* Tema Terang */}
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
                        <div style={{
                          fontSize: '12px',
                          color: '#0ea5e9',
                          fontWeight: '500'
                        }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>

                    {/* Tema Gelap */}
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
                        <div style={{
                          fontSize: '12px',
                          color: '#6366f1',
                          fontWeight: '500'
                        }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>

                    {/* Tema Lucu */}
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
                      <div style={{ fontSize: '32px' }}>🎨</div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: selectedTheme === 'lucu' ? '#ec4899' : '#374151'
                      }}>
                        Lucu
                      </div>
                      {selectedTheme === 'lucu' && (
                        <div style={{
                          fontSize: '12px',
                          color: '#ec4899',
                          fontWeight: '500'
                        }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Backup Database */}
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

          {/* SECURITY TAB */}
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
                {/* Alert Messages */}
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
                  {/* Current Password */}
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

                  {/* New Password */}
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

                  {/* Confirm Password */}
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

                  {/* Submit Button */}
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

              {/* Security Tips */}
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
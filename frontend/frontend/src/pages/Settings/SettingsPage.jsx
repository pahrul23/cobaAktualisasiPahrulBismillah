import { useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import useAuth from '../../hooks/useAuth'

const SettingsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'system', label: 'Sistem', icon: '⚙️' },
    { id: 'notifications', label: 'Notifikasi', icon: '🔔' },
    { id: 'security', label: 'Keamanan', icon: '🔒' }
  ]

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
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none'
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
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none'
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
                    defaultValue={user?.role}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: '#f8fafc',
                      color: '#64748b'
                    }}
                  />
                </div>
              </div>

              <button style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}>
                Simpan Perubahan
              </button>
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
              
              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                <div style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '16px'
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a202c'
                  }}>
                    Auto-numbering Surat
                  </h3>
                  <p style={{
                    margin: '0 0 16px 0',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    Otomatis generate nomor disposisi untuk surat baru
                  </p>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input type="checkbox" defaultChecked />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Aktifkan auto-numbering</span>
                  </label>
                </div>

                <div style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '16px'
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a202c'
                  }}>
                    Backup Database
                  </h3>
                  <p style={{
                    margin: '0 0 16px 0',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    Backup otomatis database setiap hari
                  </p>
                  <button style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Backup Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔔</div>
              <h2 style={{
                margin: '0 0 12px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Pengaturan Notifikasi
              </h2>
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: '#64748b'
              }}>
                Fitur notifikasi email dan push notification akan segera hadir
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
              <h2 style={{
                margin: '0 0 12px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Pengaturan Keamanan
              </h2>
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: '#64748b'
              }}>
                Fitur 2FA dan pengaturan password akan segera tersedia
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage
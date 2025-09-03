import DashboardLayout from '../../components/Layout/DashboardLayout'

const StafDashboard = () => {
  const stats = [
    { 
      title: 'Total Surat', 
      value: '248', 
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      icon: '📄' 
    },
    { 
      title: 'Menunggu Proses', 
      value: '24', 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      icon: '⏳' 
    },
    { 
      title: 'Selesai', 
      value: '187', 
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: '✅' 
    },
    { 
      title: 'Ditolak', 
      value: '12', 
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      icon: '❌' 
    }
  ]

  const recentActivity = [
    { icon: '📄', text: 'Surat UN-005/2025 berhasil dibuat', time: '2 jam lalu' },
    { icon: '✅', text: 'Proposal PR-003/2025 disetujui Ketua', time: '4 jam lalu' },
    { icon: '📝', text: 'Disposisi untuk surat PG-002/2025 dibuat', time: '6 jam lalu' }
  ]

  return (
    <DashboardLayout>
      <div style={{
        display: 'grid',
        gap: '24px',
        width: '100%',
        maxWidth: 'none',
        fontFamily: "'Poppins', sans-serif"
      }}>
        
        {/* Stats Cards - Tanpa persentase */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: stat.gradient,
                borderRadius: '20px',
                padding: '28px',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
                e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.18)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'
              }}
            >
              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
              
              {/* Icon only - no percentage */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                backdropFilter: 'blur(10px)',
                marginBottom: '20px'
              }}>
                {stat.icon}
              </div>
              
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '8px',
                lineHeight: '1'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '16px',
                opacity: 0.9,
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '24px'
        }}>
          
          {/* Overview Chart */}
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
            borderRadius: '24px',
            padding: '32px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '300px'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}></div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  Overview Surat
                </h3>
                <p style={{
                  margin: 0,
                  opacity: 0.8,
                  fontSize: '16px',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  Monthly progress
                </p>
              </div>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                color: 'white',
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}>
                Monthly ▼
              </button>
            </div>

            <div style={{
              height: '140px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontFamily: "'Poppins', sans-serif",
              opacity: 0.7,
              backdropFilter: 'blur(10px)'
            }}>
              [Chart Area - 248 Total Steps]
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ 
                  fontSize: '22px', 
                  fontWeight: '800',
                  fontFamily: "'Poppins', sans-serif"
                }}>248</div>
                <div style={{ 
                  fontSize: '13px', 
                  opacity: 0.8,
                  fontFamily: "'Poppins', sans-serif"
                }}>Total</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ 
                  fontSize: '22px', 
                  fontWeight: '800',
                  fontFamily: "'Poppins', sans-serif"
                }}>24</div>
                <div style={{ 
                  fontSize: '13px', 
                  opacity: 0.8,
                  fontFamily: "'Poppins', sans-serif"
                }}>Pending</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ 
                  fontSize: '22px', 
                  fontWeight: '800',
                  fontFamily: "'Poppins', sans-serif"
                }}>187</div>
                <div style={{ 
                  fontSize: '13px', 
                  opacity: 0.8,
                  fontFamily: "'Poppins', sans-serif"
                }}>Selesai</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'grid', gap: '20px' }}>
            
            {/* Quick Actions */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px',
              padding: '28px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                📄
              </div>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: '700',
                fontFamily: "'Poppins', sans-serif"
              }}>
                Tambah Surat
              </h3>
              <p style={{
                margin: '0 0 20px 0',
                fontSize: '14px',
                opacity: 0.9,
                fontFamily: "'Poppins', sans-serif",
                lineHeight: '1.5'
              }}>
                Buat surat baru dengan mudah
              </p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}>
                Buat Sekarang →
              </button>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1a202c',
                fontFamily: "'Poppins', sans-serif"
              }}>
                Aktivitas Terbaru
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {recentActivity.map((activity, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <span style={{ fontSize: '16px' }}>{activity.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '4px',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        {activity.text}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StafDashboard
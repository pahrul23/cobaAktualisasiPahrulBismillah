import DashboardLayout from '../../components/Layout/DashboardLayout'

const KetuaDashboard = () => {
  const executiveStats = [
    { 
      title: 'Total Surat Bulan Ini', 
      value: '248', 
      subtitle: 'vs 221 bulan lalu',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      icon: '📊' 
    },
    { 
      title: 'Perlu Persetujuan', 
      value: '18', 
      subtitle: 'Menunggu keputusan Anda',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      icon: '⏳' 
    },
    { 
      title: 'Disetujui Hari Ini', 
      value: '7', 
      subtitle: 'Dari 12 pengajuan',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: '✅' 
    },
    { 
      title: 'Agenda Hari Ini', 
      value: '4', 
      subtitle: '2 rapat, 2 audiensi',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      icon: '📅' 
    }
  ]

  const pendingApprovals = [
    {
      id: 1,
      no_surat: 'PR-004/IX/2025',
      jenis: 'proposal',
      perihal: 'Proposal Bantuan Kegiatan Pendidikan',
      asal_surat: 'Yayasan Pendidikan Nusantara',
      priority: 'tinggi',
      time: '2 jam lalu'
    },
    {
      id: 2,
      no_surat: 'AD-002/IX/2025', 
      jenis: 'audiensi',
      perihal: 'Permohonan Audiensi Pengusaha Lokal',
      asal_surat: 'Asosiasi Pengusaha Jakarta',
      priority: 'sedang',
      time: '4 jam lalu'
    },
    {
      id: 3,
      no_surat: 'UN-006/IX/2025',
      jenis: 'undangan',
      perihal: 'Undangan Rapat Koordinasi Nasional',
      asal_surat: 'Kementerian Dalam Negeri',
      priority: 'urgent',
      time: '1 hari lalu'
    }
  ]

  const recentDecisions = [
    {
      action: 'approved',
      no_surat: 'PR-003/IX/2025',
      perihal: 'Proposal Bantuan Dana Pembangunan',
      time: '1 jam lalu'
    },
    {
      action: 'approved',
      no_surat: 'AD-001/IX/2025',
      perihal: 'Audiensi dengan Tokoh Masyarakat',
      time: '3 jam lalu'
    },
    {
      action: 'rejected',
      no_surat: 'PG-002/IX/2025',
      perihal: 'Pengaduan Fasilitas Umum',
      time: '5 jam lalu'
    }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return { bg: '#fee2e2', text: '#dc2626', label: 'URGENT' }
      case 'tinggi': return { bg: '#fef3c7', text: '#d97706', label: 'Tinggi' }
      case 'sedang': return { bg: '#dbeafe', text: '#2563eb', label: 'Sedang' }
      default: return { bg: '#f3f4f6', text: '#6b7280', label: 'Normal' }
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
        
        {/* Executive Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {executiveStats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: stat.gradient,
                borderRadius: '20px',
                padding: '28px',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
              
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
                marginBottom: '8px',
                lineHeight: '1'
              }}>
                {stat.value}
              </div>
              
              <div style={{
                fontSize: '16px',
                opacity: 0.9,
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {stat.title}
              </div>

              <div style={{
                fontSize: '12px',
                opacity: 0.8,
                fontWeight: '400'
              }}>
                {stat.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* Main Executive Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '24px'
        }}>
          
          {/* Pending Approvals */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <h3 style={{
                  margin: '0 0 4px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a202c'
                }}>
                  Perlu Persetujuan
                </h3>
                <p style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  Surat yang menunggu keputusan Anda
                </p>
              </div>
              <div style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                {pendingApprovals.length} Pending
              </div>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {pendingApprovals.map((item) => {
                const priorityInfo = getPriorityColor(item.priority)
                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#f8fafc',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f1f5f9'
                      e.target.style.borderColor = '#cbd5e0'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f8fafc'
                      e.target.style.borderColor = '#e2e8f0'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#1a202c',
                          marginBottom: '4px'
                        }}>
                          {item.no_surat}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b',
                          textTransform: 'capitalize'
                        }}>
                          {item.jenis} • {item.time}
                        </div>
                      </div>

                      <div style={{
                        background: priorityInfo.bg,
                        color: priorityInfo.text,
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {priorityInfo.label}
                      </div>
                    </div>

                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      marginBottom: '12px',
                      lineHeight: '1.4'
                    }}>
                      {item.perihal}
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: '#64748b',
                      marginBottom: '16px'
                    }}>
                      <strong>Dari:</strong> {item.asal_surat}
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button style={{
                        flex: 1,
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        ✓ Setujui
                      </button>
                      
                      <button style={{
                        flex: 1,
                        padding: '8px 16px',
                        background: '#f8fafc',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        👁 Detail
                      </button>
                      
                      <button style={{
                        flex: 1,
                        padding: '8px 16px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        ✕ Tolak
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'grid', gap: '20px' }}>
            
            {/* Quick Decision Actions */}
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '20px',
              padding: '24px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{
                fontSize: '40px',
                marginBottom: '12px'
              }}>
                ⚡
              </div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '700'
              }}>
                Quick Decisions
              </h3>
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '13px',
                opacity: 0.9,
                lineHeight: '1.4'
              }}>
                Setujui atau tolak surat dengan cepat
              </p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}>
                Lihat Semua →
              </button>
            </div>

            {/* Recent Decisions */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Keputusan Terbaru
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {recentDecisions.map((decision, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '12px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: decision.action === 'approved' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      {decision.action === 'approved' ? '✓' : '✕'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '2px'
                      }}>
                        {decision.no_surat}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {decision.perihal}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af'
                      }}>
                        {decision.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              borderRadius: '20px',
              padding: '24px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
              
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '700'
              }}>
                Performance Bulan Ini
              </h3>

              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>Avg Response Time</span>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>2.3 hari</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>Approval Rate</span>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>87%</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>Completed This Month</span>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>156</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Overview Chart */}
        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
          borderRadius: '24px',
          padding: '32px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
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
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                Executive Overview
              </h3>
              <p style={{
                margin: 0,
                opacity: 0.8,
                fontSize: '16px'
              }}>
                Ringkasan kinerja dan trend bulanan
              </p>
            </div>
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}>
              View Report →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '800',
                marginBottom: '4px'
              }}>248</div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8
              }}>Total Surat</div>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '800',
                marginBottom: '4px'
              }}>87%</div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8
              }}>Approval Rate</div>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '800',
                marginBottom: '4px'
              }}>2.3</div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8
              }}>Avg Days</div>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '800',
                marginBottom: '4px'
              }}>18</div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8
              }}>Pending</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default KetuaDashboard
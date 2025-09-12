// Path: /frontend/src/pages/Dashboard/ExecutiveDashboard.jsx
import React from 'react'

const ExecutiveDashboard = () => {
  return (
    <div style={{
      padding: '0',
      backgroundColor: '#f8fafc',
      fontFamily: "'Poppins', sans-serif"
    }}>
      
      {/* Executive Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        
        {/* Pending Approvals */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '20px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              fontSize: '20px'
            }}>
              ⏳
            </div>
            
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              12
            </h4>
            
            <p style={{
              margin: 0,
              fontSize: '14px',
              opacity: 0.9
            }}>
              Menunggu Persetujuan
            </p>
          </div>
        </div>

        {/* Total Letters This Month */}
        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          borderRadius: '20px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              fontSize: '20px'
            }}>
              📄
            </div>
            
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              89
            </h4>
            
            <p style={{
              margin: 0,
              fontSize: '14px',
              opacity: 0.9
            }}>
              Surat Bulan Ini
            </p>
          </div>
        </div>

        {/* Completed Proposals */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '20px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              fontSize: '20px'
            }}>
              ✅
            </div>
            
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              24
            </h4>
            
            <p style={{
              margin: 0,
              fontSize: '14px',
              opacity: 0.9
            }}>
              Proposal Disetujui
            </p>
          </div>
        </div>

        {/* Upcoming Meetings */}
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
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              fontSize: '20px'
            }}>
              📅
            </div>
            
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              5
            </h4>
            
            <p style={{
              margin: 0,
              fontSize: '14px',
              opacity: 0.9
            }}>
              Agenda Minggu Ini
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        
        {/* Approval Queue */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              Antrian Persetujuan
            </h3>
            
            <button style={{
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Lihat Semua
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Approval Item 1 */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a'
                }}>
                  Proposal Bantuan Dana Pendidikan
                </h4>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Dari: Yayasan Pendidikan Harapan
                </p>
                <div style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  Menunggu Review
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Setujui
                </button>
                <button style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Tolak
                </button>
              </div>
            </div>

            {/* Approval Item 2 */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a'
                }}>
                  Permohonan Audiensi Gubernur Jateng
                </h4>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Dari: Pemprov Jawa Tengah
                </p>
                <div style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  Prioritas Tinggi
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Setujui
                </button>
                <button style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <h4 style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              Aksi Cepat
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.background = '#f8fafc'}
              >
                <span style={{ fontSize: '18px' }}>📊</span>
                Lihat Laporan Bulanan
              </button>
              
              <button style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.background = '#f8fafc'}
              >
                <span style={{ fontSize: '18px' }}>📅</span>
                Jadwal Agenda Baru
              </button>
              
              <button style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.background = '#f8fafc'}
              >
                <span style={{ fontSize: '18px' }}>⚙️</span>
                Pengaturan Sistem
              </button>
            </div>
          </div>

          {/* Recent Executive Activities */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <h4 style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              Aktivitas Terbaru
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  marginTop: '6px'
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    Menyetujui proposal pembangunan jembatan
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    30 menit lalu
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#0ea5e9',
                  borderRadius: '50%',
                  marginTop: '6px'
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    Meeting dengan Gubernur Jawa Timur
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    2 jam lalu
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '50%',
                  marginTop: '6px'
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    Review laporan keuangan Q3
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    1 hari lalu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Latest Reports & Performance */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h4 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: '#0f172a'
          }}>
            Ringkasan Kinerja
          </h4>
          
          <select style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px'
          }}>
            <option>Bulan Ini</option>
            <option>3 Bulan Terakhir</option>
            <option>Tahun Ini</option>
          </select>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h5 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              94%
            </h5>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#64748b'
            }}>
              Tingkat Persetujuan
            </p>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h5 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              2.3
            </h5>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#64748b'
            }}>
              Rata-rata Hari Review
            </p>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h5 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              156
            </h5>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#64748b'
            }}>
              Total Surat Diproses
            </p>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h5 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              18
            </h5>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#64748b'
            }}>
              Agenda Terlaksana
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutiveDashboard
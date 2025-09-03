import DashboardLayout from '../../components/Layout/DashboardLayout'

const ProposalList = () => {
  const mockProposals = [
    {
      id: 1,
      no_proposal: 'PR-001/IX/2025',
      judul: 'Proposal Bantuan Dana Pendidikan',
      pemohon: 'Yayasan Pendidikan Nusantara',
      nominal: 500000000,
      status: 'review',
      tanggal: '2025-08-30'
    },
    {
      id: 2,
      no_proposal: 'PR-002/IX/2025',
      judul: 'Proposal Pembangunan Fasilitas Umum',
      pemohon: 'Komunitas Warga Jakarta',
      nominal: 750000000,
      status: 'approved',
      tanggal: '2025-08-29'
    },
    {
      id: 3,
      no_proposal: 'PR-003/IX/2025',
      judul: 'Proposal Program Kesehatan Masyarakat',
      pemohon: 'Puskesmas Kecamatan Tangerang',
      nominal: 300000000,
      status: 'pending',
      tanggal: '2025-08-28'
    }
  ]

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e', label: 'Pending' }
      case 'review': return { bg: '#dbeafe', text: '#1e40af', label: 'Review' }
      case 'approved': return { bg: '#d1fae5', text: '#065f46', label: 'Disetujui' }
      case 'rejected': return { bg: '#fee2e2', text: '#991b1b', label: 'Ditolak' }
      default: return { bg: '#f3f4f6', text: '#374151', label: status }
    }
  }

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a202c'
            }}>
              Manajemen Proposal
            </h1>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '16px'
            }}>
              Kelola proposal bantuan dan kegiatan
            </p>
          </div>

          <button style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 28px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            + Tambah Proposal
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>24</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Proposal</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>8</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Menunggu Review</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>15</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Disetujui</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>1</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Ditolak</div>
          </div>
        </div>

        {/* Proposal Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {mockProposals.map(proposal => {
            const statusInfo = getStatusInfo(proposal.status)
            return (
              <div
                key={proposal.id}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}>
                      📋
                    </div>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1a202c'
                      }}>
                        {proposal.no_proposal}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        {new Date(proposal.tanggal).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: statusInfo.bg,
                    color: statusInfo.text,
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {statusInfo.label}
                  </div>
                </div>

                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a202c',
                  lineHeight: '1.4'
                }}>
                  {proposal.judul}
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
                    marginBottom: '4px'
                  }}>
                    Pemohon:
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {proposal.pemohon}
                  </div>
                </div>

                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#10b981',
                  marginBottom: '16px'
                }}>
                  {formatRupiah(proposal.nominal)}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}>
                    Lihat Detail
                  </button>
                  
                  <button style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    Proses
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Coming Soon Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          color: 'white',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '700'
          }}>
            Coming Soon
          </h2>
          <p style={{
            margin: 0,
            fontSize: '16px',
            opacity: 0.9
          }}>
            Fitur lengkap manajemen proposal sedang dalam pengembangan
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProposalList
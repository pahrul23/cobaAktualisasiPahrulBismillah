// Path: /frontend/src/pages/Proposal/ProposalList.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ProposalDetailModal from '../../components/Modal/ProposalDetailModal';

const ProposalList = () => {
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    jenis_kegiatan: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);

  // Fetch proposals
  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError('');

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.jenis_kegiatan !== 'all' && { jenis_kegiatan: filters.jenis_kegiatan }),
        ...(filters.search && { q: filters.search })
      });

      const response = await fetch(`http://localhost:4000/api/proposals?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setProposals(data.data.proposals);
        setPagination({
          ...pagination,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        });
      } else {
        setError(data.message || 'Gagal memuat data proposal');
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/proposals/stats', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update proposal status
  const updateProposalStatus = async (proposalId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          catatan_tindak_lanjut: `Status diubah menjadi ${newStatus} dari sistem`
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setProposals(prev => 
          prev.map(proposal => 
            proposal.id === proposalId 
              ? { ...proposal, status: newStatus }
              : proposal
          )
        );
        // Refresh stats
        fetchStats();
      } else {
        alert('Gagal mengupdate status proposal');
      }
    } catch (error) {
      console.error('Error updating proposal:', error);
      alert('Terjadi kesalahan saat mengupdate status');
    }
  };

  // Load data when component mounts or filters change
  useEffect(() => {
    fetchProposals();
  }, [pagination.page, filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e', label: 'Pending' };
      case 'diproses': return { bg: '#dbeafe', text: '#1e40af', label: 'Diproses' };
      case 'verifikasi': return { bg: '#e0e7ff', text: '#5b21b6', label: 'Verifikasi' };
      case 'selesai': return { bg: '#d1fae5', text: '#065f46', label: 'Selesai' };
      case 'ditolak': return { bg: '#fee2e2', text: '#991b1b', label: 'Ditolak' };
      case 'ditindaklanjuti': return { bg: '#ecfdf5', text: '#064e3b', label: 'Ditindaklanjuti' };
      default: return { bg: '#f3f4f6', text: '#374151', label: status };
    }
  };

  const formatRupiah = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 }); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleShowDetail = (proposalId) => {
    setSelectedProposalId(proposalId);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedProposalId(null);
  };

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
            Proposal
          </button>
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="diproses">Diproses</option>
              <option value="verifikasi">Verifikasi</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
              <option value="ditindaklanjuti">Ditindaklanjuti</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Pencarian
            </label>
            <input
              type="text"
              placeholder="Cari judul, nama pengirim, instansi..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={fetchProposals}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Filter
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
            <div style={{ fontSize: '28px', fontWeight: '800' }}>
              {stats.total || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Proposal</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>
              {stats.statusCounts?.diproses || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Sedang Diproses</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>
              {stats.statusCounts?.selesai || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Selesai</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>
              {stats.statusCounts?.ditolak || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Ditolak</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
            <div>Memuat data proposal...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#ef4444'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>❌</div>
            <div>{error}</div>
            <button
              onClick={fetchProposals}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Proposal Cards */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {proposals.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                  Tidak ada proposal ditemukan
                </h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Coba ubah filter atau buat proposal baru
                </p>
              </div>
            ) : (
              proposals.map(proposal => {
                const statusInfo = getStatusInfo(proposal.status);
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
                            {proposal.no_surat || `PR-${proposal.id.toString().padStart(3, '0')}`}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b'
                          }}>
                            {formatDate(proposal.letter_created_at)}
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
                      {proposal.judul_proposal || proposal.perihal || 'Judul proposal tidak tersedia'}
                    </h3>

                    <div style={{
                      background: '#f8fafc',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '12px'
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
                        {proposal.nama_pengirim || proposal.asal_surat || 'Tidak diketahui'}
                      </div>
                      {proposal.instansi && (
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b',
                          marginTop: '2px'
                        }}>
                          {proposal.instansi}
                        </div>
                      )}
                    </div>

                    {proposal.jenis_kegiatan && (
                      <div style={{
                        background: '#e0f2fe',
                        color: '#0284c7',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'inline-block',
                        marginBottom: '12px'
                      }}>
                        {proposal.jenis_kegiatan}
                      </div>
                    )}

                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '16px'
                    }}>
                      {formatRupiah(proposal.total_anggaran)}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button 
                        onClick={() => handleShowDetail(proposal.id)}
                        style={{
                          flex: 1,
                          padding: '8px 16px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#64748b',
                          cursor: 'pointer'
                        }}
                      >
                        Lihat Detail
                      </button>
                      
                      {/* Status Update Dropdown */}
                      <select
                        value={proposal.status}
                        onChange={(e) => updateProposalStatus(proposal.id, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="diproses">Diproses</option>
                        <option value="verifikasi">Verifikasi</option>
                        <option value="selesai">Selesai</option>
                        <option value="ditolak">Ditolak</option>
                        <option value="ditindaklanjuti">Ditindaklanjuti</option>
                      </select>
                    </div>

                    {/* Additional Info */}
                    {proposal.tanggal_kegiatan && (
                      <div style={{
                        marginTop: '12px',
                        fontSize: '12px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📅 Tanggal Kegiatan: {formatDate(proposal.tanggal_kegiatan)}
                      </div>
                    )}

                    {proposal.lokasi_kegiatan && (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '12px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📍 {proposal.lokasi_kegiatan}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && proposals.length > 0 && pagination.totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '24px'
          }}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              style={{
                padding: '8px 16px',
                background: pagination.page === 1 ? '#f3f4f6' : '#3b82f6',
                color: pagination.page === 1 ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Prev
            </button>

            <span style={{
              fontSize: '14px',
              color: '#64748b'
            }}>
              Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} total)
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              style={{
                padding: '8px 16px',
                background: pagination.page === pagination.totalPages ? '#f3f4f6' : '#3b82f6',
                color: pagination.page === pagination.totalPages ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Detail Modal */}
        <ProposalDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetail}
          proposalId={selectedProposalId}
          onStatusUpdate={updateProposalStatus}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProposalList;
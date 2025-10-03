import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';

const ProposalList = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    statusCounts: {
      pending: 0,
      diproses: 0,
      selesai: 0,
      ditolak: 0
    }
  });

  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showBantuanModal, setShowBantuanModal] = useState(false);
  const [jumlahBantuan, setJumlahBantuan] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // State baru untuk detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailProposal, setSelectedDetailProposal] = useState(null);

  const colors = {
    primary: {
      blue: '#3B82F6',
      green: '#22C55E',
      yellow: '#EAB308',
      red: '#EF4444',
      gray: '#6B7280'
    },
    gradients: {
      blue: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      green: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      yellow: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
      red: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      admire: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)'
    },
    neutral: {
      bg: '#F9FAFB',
      white: '#FFFFFF',
      border: '#E5E7EB',
      text: '#111827',
      textLight: '#6B7280'
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProposals();
    fetchStats();
  }, [filter]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/proposals/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ri7_token')}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setStats(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? 'http://localhost:4000/api/proposals'
        : `http://localhost:4000/api/proposals?status=${filter}`;
        
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ri7_token')}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const proposalsList = result.data.proposals || result.data;
          setProposals(proposalsList);
        }
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (proposal) => {
    setSelectedDetailProposal(proposal);
    setShowDetailModal(true);
  };

  const handleApproveFromDetail = () => {
    setShowDetailModal(false);
    setSelectedProposal(selectedDetailProposal);
    setShowBantuanModal(true);
  };

  const submitApproval = async () => {
    if (!jumlahBantuan || parseInt(jumlahBantuan) <= 0) {
      alert('Jumlah bantuan harus diisi');
      return;
    }

    try {
      const updateProposal = await fetch(`http://localhost:4000/api/proposals/${selectedProposal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ri7_token')}`
        },
        body: JSON.stringify({
          jumlah_dibantu: parseInt(jumlahBantuan),
          status: 'diproses',
          pic_penanganan: user.name,
          catatan_tindak_lanjut: `Disetujui dengan bantuan Rp ${parseInt(jumlahBantuan).toLocaleString('id-ID')}`
        })
      });

      if (updateProposal.ok) {
        alert(`Proposal berhasil disetujui dengan bantuan Rp ${parseInt(jumlahBantuan).toLocaleString('id-ID')}`);
        setShowBantuanModal(false);
        setJumlahBantuan('');
        setSelectedProposal(null);
        fetchProposals();
        fetchStats();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menyetujui proposal');
    }
  };

  const handleReject = async (proposal) => {
    const reason = prompt('Masukkan alasan penolakan:');
    if (!reason?.trim()) {
      alert('Alasan harus diisi');
      return;
    }

    try {
      await fetch(`http://localhost:4000/api/proposals/${proposal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ri7_token')}`
        },
        body: JSON.stringify({
          status: 'ditolak',
          catatan_tindak_lanjut: reason
        })
      });

      alert('Proposal berhasil ditolak');
      fetchProposals();
      fetchStats();
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menolak proposal');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: '#FEF3C7', color: '#92400E', text: 'Menunggu' },
      diproses: { bg: '#DBEAFE', color: '#1E40AF', text: 'Diproses' },
      selesai: { bg: '#D1FAE5', color: '#065F46', text: 'Selesai' },
      ditolak: { bg: '#FEE2E2', color: '#991B1B', text: 'Ditolak' }
    };
    const badge = badges[status] || badges.pending;
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '700',
        backgroundColor: badge.bg,
        color: badge.color,
        textTransform: 'uppercase'
      }}>
        {badge.text}
      </span>
    );
  };

  const StatCard = ({ title, count, gradient }) => (
    <div style={{
      background: gradient,
      borderRadius: '20px',
      padding: isMobile ? '20px' : '28px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      minHeight: isMobile ? '120px' : '140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-30%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(60px)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3 style={{
          fontSize: isMobile ? '32px' : '40px',
          fontWeight: '900',
          margin: '0 0 8px 0',
          lineHeight: '1'
        }}>
          {count || 0}
        </h3>
        <p style={{
          fontSize: isMobile ? '13px' : '15px',
          margin: 0,
          opacity: 0.95,
          fontWeight: '600'
        }}>
          {title}
        </p>
      </div>
    </div>
  );

  const filteredProposals = proposals.filter(p => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (p.nama_pengirim && p.nama_pengirim.toLowerCase().includes(search)) ||
      (p.judul_proposal && p.judul_proposal.toLowerCase().includes(search)) ||
      (p.instansi_lembaga_komunitas && p.instansi_lembaga_komunitas.toLowerCase().includes(search))
    );
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: colors.neutral.bg,
        flexDirection: 'column'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid #E5E7EB',
          borderTop: '6px solid #3B82F6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{
          marginTop: '20px',
          fontSize: '16px',
          color: colors.neutral.textLight,
          fontWeight: '600'
        }}>
          Memuat data proposal...
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      
      <div style={{
        fontFamily: "'Inter', 'Poppins', sans-serif",
        backgroundColor: colors.neutral.bg,
        minHeight: '100vh',
        padding: isMobile ? '16px' : '32px'
      }}>
        {/* Header */}
        <div style={{
          background: colors.gradients.admire,
          borderRadius: '28px',
          padding: isMobile ? '32px 24px' : '48px 40px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '900',
              color: 'white',
              margin: '0 0 12px 0',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              Manajemen Proposal
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              fontWeight: '500'
            }}>
              Kelola dan review proposal yang masuk ke Ketua DPD RI
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard title="Total" count={stats.total} gradient={colors.gradients.blue} />
          <StatCard title="Menunggu" count={stats.statusCounts?.pending} gradient={colors.gradients.yellow} />
          <StatCard title="Diproses" count={stats.statusCounts?.diproses} gradient={colors.gradients.blue} />
          <StatCard title="Selesai" count={stats.statusCounts?.selesai} gradient={colors.gradients.green} />
          <StatCard title="Ditolak" count={stats.statusCounts?.ditolak} gradient={colors.gradients.red} />
        </div>

        {/* Search & Filter */}
        <div style={{
          backgroundColor: colors.neutral.white,
          borderRadius: '20px',
          padding: isMobile ? '16px' : '24px',
          marginBottom: '24px',
          border: `1px solid ${colors.neutral.border}`
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari pengirim, judul, atau instansi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: `1px solid ${colors.neutral.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.neutral.textLight,
                fontSize: '18px'
              }}>🔍</span>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {[
                { key: 'all', label: 'Semua', count: stats.total },
                { key: 'pending', label: 'Menunggu', count: stats.statusCounts?.pending },
                { key: 'diproses', label: 'Diproses', count: stats.statusCounts?.diproses },
                { key: 'selesai', label: 'Selesai', count: stats.statusCounts?.selesai },
                { key: 'ditolak', label: 'Ditolak', count: stats.statusCounts?.ditolak }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: filter === key ? colors.primary.blue : colors.neutral.border,
                    color: filter === key ? 'white' : colors.neutral.textLight,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {label} ({count || 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Proposals */}
        {filteredProposals.length === 0 ? (
          <div style={{
            backgroundColor: colors.neutral.white,
            borderRadius: '20px',
            padding: '60px 40px',
            textAlign: 'center',
            border: `1px solid ${colors.neutral.border}`
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors.neutral.text,
              margin: '0 0 8px 0'
            }}>
              Tidak ada proposal {filter !== 'all' && `dengan status "${filter}"`}
            </h3>
            <p style={{
              fontSize: '14px',
              color: colors.neutral.textLight,
              margin: 0
            }}>
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredProposals.map((proposal) => (
              <div 
                key={proposal.id} 
                onClick={() => openDetailModal(proposal)}
                style={{
                  backgroundColor: colors.neutral.white,
                  borderRadius: '20px',
                  padding: isMobile ? '20px' : '24px',
                  border: `1px solid ${colors.neutral.border}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <h3 style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontWeight: '700',
                        color: colors.neutral.text,
                        margin: 0
                      }}>
                        {proposal.judul_proposal || 'Tanpa Judul'}
                      </h3>
                      {getStatusBadge(proposal.status)}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      fontSize: '14px',
                      color: colors.neutral.textLight
                    }}>
                      <span>👤 {proposal.nama_pengirim || '-'}</span>
                      {proposal.instansi_lembaga_komunitas && (
                        <span>🏢 {proposal.instansi_lembaga_komunitas}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '12px'
                }}>
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: colors.neutral.textLight,
                      margin: '0 0 4px 0'
                    }}>
                      Tanggal Kegiatan
                    </p>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.neutral.text,
                      margin: 0
                    }}>
                      {proposal.tanggal_kegiatan 
                        ? new Date(proposal.tanggal_kegiatan).toLocaleDateString('id-ID')
                        : '-'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: colors.neutral.textLight,
                      margin: '0 0 4px 0'
                    }}>
                      Total Anggaran
                    </p>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.neutral.text,
                      margin: 0
                    }}>
                      {proposal.total_anggaran 
                        ? `Rp ${parseInt(proposal.total_anggaran).toLocaleString('id-ID')}`
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Detail Proposal */}
        {showDetailModal && selectedDetailProposal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '20px',
            overflowY: 'auto'
          }} onClick={() => setShowDetailModal(false)}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: isMobile ? '24px' : '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{ marginBottom: '24px', borderBottom: '2px solid #E5E7EB', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: colors.neutral.text,
                    margin: 0,
                    flex: 1,
                    paddingRight: '20px'
                  }}>
                    {selectedDetailProposal.judul_proposal || 'Tanpa Judul'}
                  </h2>
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '32px',
                      cursor: 'pointer',
                      color: colors.neutral.textLight,
                      padding: 0,
                      lineHeight: '1'
                    }}>
                    ×
                  </button>
                </div>
                {getStatusBadge(selectedDetailProposal.status)}
              </div>

              {/* Content Grid */}
              <div style={{ display: 'grid', gap: '20px' }}>
                
                {/* Informasi Pengirim */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${colors.primary.blue}`
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary.blue,
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase'
                  }}>
                    Informasi Pengirim
                  </h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: colors.neutral.textLight }}>Nama Pengirim:</span>
                      <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: colors.neutral.text }}>
                        {selectedDetailProposal.nama_pengirim || '-'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: colors.neutral.textLight }}>Instansi/Lembaga:</span>
                      <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: colors.neutral.text }}>
                        {selectedDetailProposal.instansi_lembaga_komunitas || '-'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: colors.neutral.textLight }}>No. Surat:</span>
                      <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: colors.neutral.text }}>
                        {selectedDetailProposal.no_surat || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detail Kegiatan */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${colors.primary.green}`
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary.green,
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase'
                  }}>
                    Detail Kegiatan
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: colors.neutral.textLight }}>Jenis Kegiatan:</span>
                      <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: colors.neutral.text }}>
                        {selectedDetailProposal.jenis_kegiatan || '-'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: colors.neutral.textLight }}>Tanggal Kegiatan:</span>
                      <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: colors.neutral.text }}>
                        {selectedDetailProposal.tanggal_kegiatan 
                          ? new Date(selectedDetailProposal.tanggal_kegiatan).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : '-'
                        }
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: colors.neutral.textLight }}>Lokasi Kegiatan:</span>
                      <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: colors.neutral.text }}>
                        {selectedDetailProposal.lokasi_kegiatan || '-'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: colors.neutral.textLight }}>Total Anggaran:</span>
                      <p style={{ margin: '4px 0 0 0', fontWeight: '700', fontSize: '18px', color: colors.primary.blue }}>
                        {selectedDetailProposal.total_anggaran 
                          ? `Rp ${parseInt(selectedDetailProposal.total_anggaran).toLocaleString('id-ID')}`
                          : '-'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ringkasan Proposal */}
                {selectedDetailProposal.ringkasan && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${colors.primary.yellow}`
                  }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#92400E',
                      margin: '0 0 12px 0',
                      textTransform: 'uppercase'
                    }}>
                      Ringkasan Proposal
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: colors.neutral.text }}>
                      {selectedDetailProposal.ringkasan}
                    </p>
                  </div>
                )}

                {/* Rekomendasi Dukungan */}
                {selectedDetailProposal.rekomendasi_dukungan && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#DBEAFE',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${colors.primary.blue}`
                  }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: colors.primary.blue,
                      margin: '0 0 12px 0',
                      textTransform: 'uppercase'
                    }}>
                      Rekomendasi Dukungan
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: colors.neutral.text }}>
                      {selectedDetailProposal.rekomendasi_dukungan}
                    </p>
                  </div>
                )}

                {/* Bantuan yang Disetujui */}
                {selectedDetailProposal.jumlah_dibantu && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#D1FAE5',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${colors.primary.green}`
                  }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: colors.primary.green,
                      margin: '0 0 8px 0',
                      textTransform: 'uppercase'
                    }}>
                      ✅ Bantuan Disetujui
                    </h3>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: colors.primary.green }}>
                      Rp {parseInt(selectedDetailProposal.jumlah_dibantu).toLocaleString('id-ID')}
                    </p>
                    {selectedDetailProposal.pic_penanganan && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: colors.neutral.textLight }}>
                        Ditangani oleh: <strong>{selectedDetailProposal.pic_penanganan}</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* Catatan Tindak Lanjut */}
                {selectedDetailProposal.catatan_tindak_lanjut && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: selectedDetailProposal.status === 'ditolak' ? '#FEE2E2' : '#F3F4F6',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${selectedDetailProposal.status === 'ditolak' ? colors.primary.red : colors.neutral.gray}`
                  }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: selectedDetailProposal.status === 'ditolak' ? colors.primary.red : colors.neutral.text,
                      margin: '0 0 8px 0',
                      textTransform: 'uppercase'
                    }}>
                      Catatan Tindak Lanjut
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: colors.neutral.text }}>
                      {selectedDetailProposal.catatan_tindak_lanjut}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedDetailProposal.status === 'pending' && (
                <div style={{
                  marginTop: '24px',
                  paddingTop: '24px',
                  borderTop: '2px solid #E5E7EB',
                  display: 'flex',
                  gap: '12px',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <button
                    onClick={handleApproveFromDetail}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      background: colors.gradients.green,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ✅ Setujui & Beri Bantuan
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleReject(selectedDetailProposal);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      background: colors.gradients.red,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Tolak Proposal
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: colors.neutral.border,
                  color: colors.neutral.textLight,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Modal Bantuan */}
        {showBantuanModal && selectedProposal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1002,
            padding: '20px'
          }} onClick={() => setShowBantuanModal(false)}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              maxWidth: '500px',
              width: '100%',
              padding: isMobile ? '24px' : '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '900',
                color: colors.neutral.text,
                margin: '0 0 8px 0'
              }}>
                Setujui Proposal
              </h3>
              <p style={{
                fontSize: '14px',
                color: colors.neutral.textLight,
                margin: '0 0 24px 0'
              }}>
                {selectedProposal.judul_proposal}
              </p>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.neutral.text,
                  marginBottom: '8px'
                }}>
                  Jumlah Bantuan (Rp)
                </label>
                <input
                  type="number"
                  value={jumlahBantuan}
                  onChange={(e) => setJumlahBantuan(e.target.value)}
                  placeholder="Contoh: 50000000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${colors.neutral.border}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {jumlahBantuan && parseInt(jumlahBantuan) > 0 && (
                  <p style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    color: colors.neutral.textLight
                  }}>
                    = <span style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: colors.primary.green
                    }}>
                      Rp {parseInt(jumlahBantuan).toLocaleString('id-ID')}
                    </span>
                  </p>
                )}
              </div>

              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <button
                  onClick={submitApproval}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: colors.gradients.green,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Setujui
                </button>
                <button
                  onClick={() => {
                    setShowBantuanModal(false);
                    setJumlahBantuan('');
                    setSelectedProposal(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: colors.neutral.border,
                    color: colors.neutral.textLight,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProposalList;
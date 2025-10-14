import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


// ADMIRE Design System
const ADMIRE = {
  colors: {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
    gradientAlt: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #10b981 100%)',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    bg: { main: '#f8fafc', card: '#ffffff', hover: 'rgba(14, 165, 233, 0.04)' },
    text: { primary: '#0f172a', secondary: '#64748b', light: '#94a3b8', white: '#ffffff' },
    border: '#e2e8f0'
  },
  breakpoints: { mobile: 640, tablet: 1024, desktop: 1280 },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
  radius: { sm: '8px', md: '12px', lg: '16px', xl: '20px', xxl: '24px' },
  shadow: {
    sm: '0 2px 8px rgba(14, 165, 233, 0.06)',
    md: '0 4px 16px rgba(14, 165, 233, 0.08)',
    lg: '0 8px 24px rgba(14, 165, 233, 0.12)',
    xl: '0 12px 32px rgba(14, 165, 233, 0.15)'
  }
};


const ApprovalUndangan = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [undanganList, setUndanganList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');


  const isMobile = windowWidth < ADMIRE.breakpoints.mobile;
  const isTablet = windowWidth >= ADMIRE.breakpoints.mobile && windowWidth < ADMIRE.breakpoints.tablet;


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    loadUndanganData();
  }, []);


  const loadUndanganData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/approval/undangan', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });


      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);


      const result = await response.json();
      setUndanganList(result.success ? (result.data || []) : []);
    } catch (error) {
      console.error('Error:', error);
      setUndanganList([]);
    } finally {
      setLoading(false);
    }
  };


  // ==================== KODE YANG DIPERBAIKI ====================
  const handleKehadiranUpdate = async (letterId, statusKehadiran, catatan = '') => {
    try {
      const userId = parseInt(localStorage.getItem('userId')) || 1;
      
      // 🔍 STEP 1: Cari data undangan lengkap dari list
      const undanganData = undanganList.find(item => item.id === letterId);
      
      if (!undanganData) {
        throw new Error('Data undangan tidak ditemukan');
      }
      
      // 📦 STEP 2: Siapkan payload dengan data lengkap
      const payload = {
        jenis_surat: 'undangan',
        status_kehadiran: statusKehadiran,
        catatan_kehadiran: catatan,
        created_by: userId,
        // ⭐ KUNCI PERBAIKAN: Kirim data tanggal & detail acara
        hari_tanggal_acara: undanganData.hari_tanggal_acara,  // Tanggal acara sebenarnya
        pukul: undanganData.pukul,                             // Waktu acara
        tempat: undanganData.tempat,                           // Lokasi acara
        perihal: undanganData.perihal,                         // Judul acara
        asal_surat: undanganData.asal_surat                    // Penyelenggara
      };
      
      // 🐛 DEBUGGING: Log untuk cek data yang dikirim
      console.log('📅 Tanggal Acara:', undanganData.hari_tanggal_acara);
      console.log('📅 Tanggal Sekarang (JANGAN dipakai):', new Date().toISOString().split('T')[0]);
      console.log('📦 Payload lengkap:', payload);
      
      const response = await fetch(`http://localhost:4000/api/approval/agenda/${letterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update');
      }

      // Update state lokal
      setUndanganList(prev =>
        prev.map(item =>
          item.id === letterId ? {
            ...item,
            status_kehadiran: statusKehadiran,
            catatan_kehadiran: catatan,
            tanggal_konfirmasi: new Date().toISOString()
          } : item
        )
      );

      alert(`Status kehadiran diperbarui menjadi "${statusKehadiran === 'hadir' ? 'Akan Hadir' : 'Tidak Hadir'}". Notifikasi telah dikirim.`);
      
    } catch (error) {
      console.error('❌ Error update kehadiran:', error);
      alert('Gagal memperbarui: ' + error.message);
    }
  };
  // ==================== END PERBAIKAN ====================


  // FILTER LOGIC
  const filteredUndangan = undanganList.filter(item => {
    switch(filter) {
      case 'all':
        return item.status_kehadiran === 'belum_konfirmasi';
      case 'tinggi':
        return item.label === 'merah' && item.status_kehadiran === 'belum_konfirmasi';
      case 'akan_hadir':
        return item.status_kehadiran === 'hadir';
      case 'tidak_hadir':
        return item.status_kehadiran === 'tidak_hadir';
      default:
        return true;
    }
  });


  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return 'TBD'; }
  };


  const formatTime = (timeString) => {
    if (!timeString) return 'TBD';
    return `${timeString.substring(0, 5)} WIB`;
  };


  const getPriorityStyle = (label) => {
    const styles = {
      merah: { bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#dc2626', label: '🔴 Tinggi' },
      kuning: { bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#92400e', label: '🟡 Sedang' },
      hijau: { bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#065f46', label: '🟢 Normal' },
      hitam: { bg: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', color: '#374151', label: '⚪ Normal' }
    };
    return styles[label] || styles.hitam;
  };


  const getStatusStyle = (status) => {
    const styles = {
      hadir: { bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#065f46', label: '✅ Akan Hadir' },
      tidak_hadir: { bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#991b1b', label: '❌ Tidak Hadir' },
      belum_konfirmasi: { bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#92400e', label: '⏳ Pending' }
    };
    return styles[status] || styles.belum_konfirmasi;
  };


  const UndanganCard = ({ item }) => {
    const priority = getPriorityStyle(item.label);
    const statusStyle = getStatusStyle(item.status_kehadiran);


    return (
      <div style={{
        background: ADMIRE.colors.bg.card, borderRadius: ADMIRE.radius.xl,
        padding: isMobile ? ADMIRE.spacing.md : ADMIRE.spacing.lg,
        marginBottom: ADMIRE.spacing.md, boxShadow: ADMIRE.shadow.md,
        border: `1px solid ${ADMIRE.colors.border}`, transition: 'all 0.3s ease',
        position: 'relative', overflow: 'hidden'
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = ADMIRE.shadow.lg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = ADMIRE.shadow.md;
        }}
      >
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '150px', height: '150px',
          background: ADMIRE.colors.gradientAlt, opacity: 0.04,
          borderRadius: '0 0 0 100%'
        }} />

        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: ADMIRE.spacing.md, marginBottom: ADMIRE.spacing.md, flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: isMobile ? '16px' : '18px', fontWeight: '800',
              color: ADMIRE.colors.text.primary, margin: `0 0 ${ADMIRE.spacing.sm} 0`,
              lineHeight: '1.3'
            }}>{item.perihal}</h3>
            <div style={{ display: 'flex', gap: ADMIRE.spacing.sm, flexWrap: 'wrap' }}>
              <span style={{
                padding: `${ADMIRE.spacing.xs} ${ADMIRE.spacing.md}`,
                borderRadius: ADMIRE.radius.md, fontSize: '12px', fontWeight: '700',
                background: priority.bg, color: priority.color
              }}>{priority.label}</span>
              <span style={{
                padding: `${ADMIRE.spacing.xs} ${ADMIRE.spacing.md}`,
                borderRadius: ADMIRE.radius.md, fontSize: '12px', fontWeight: '700',
                background: statusStyle.bg, color: statusStyle.color
              }}>{statusStyle.label}</span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.04) 0%, rgba(16, 185, 129, 0.04) 100%)',
          padding: ADMIRE.spacing.md, borderRadius: ADMIRE.radius.md,
          marginBottom: ADMIRE.spacing.md, border: `1px solid ${ADMIRE.colors.border}`
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: ADMIRE.spacing.md
          }}>
            {[
              { icon: '🏢', label: 'Penyelenggara', value: item.asal_surat },
              { icon: '📄', label: 'No. Surat', value: item.no_surat },
              { icon: '📅', label: 'Tanggal', value: formatDate(item.hari_tanggal_acara) },
              { icon: '🕐', label: 'Waktu', value: formatTime(item.pukul) },
              { icon: '📍', label: 'Tempat', value: item.tempat || 'TBD' },
              { icon: '🎭', label: 'Jenis', value: item.jenis_acara }
            ].map((info, i) => (
              <div key={i}>
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: ADMIRE.colors.text.secondary,
                  textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block',
                  marginBottom: '4px'
                }}>{info.icon} {info.label}</span>
                <p style={{
                  fontSize: '14px', color: ADMIRE.colors.text.primary,
                  margin: '0', fontWeight: '600', lineHeight: '1.4'
                }}>{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: ADMIRE.spacing.md }}>
          <span style={{
            fontSize: '11px', fontWeight: '700', color: ADMIRE.colors.text.secondary,
            textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block',
            marginBottom: '6px'
          }}>📝 DESKRIPSI</span>
          <p style={{
            fontSize: '14px', color: ADMIRE.colors.text.secondary,
            margin: '0', lineHeight: '1.6'
          }}>{item.uraian}</p>
        </div>

        <div style={{
          display: 'flex', gap: ADMIRE.spacing.md, flexWrap: 'wrap',
          marginBottom: ADMIRE.spacing.lg
        }}>
          <span style={{
            fontSize: '13px', padding: `${ADMIRE.spacing.xs} ${ADMIRE.spacing.md}`,
            background: 'rgba(14, 165, 233, 0.08)', color: ADMIRE.colors.primary,
            borderRadius: ADMIRE.radius.sm, fontWeight: '600'
          }}>👔 {item.dress_code || 'Tidak ditentukan'}</span>
          <span style={{
            fontSize: '13px', padding: `${ADMIRE.spacing.xs} ${ADMIRE.spacing.md}`,
            background: 'rgba(16, 185, 129, 0.08)', color: ADMIRE.colors.accent,
            borderRadius: ADMIRE.radius.sm, fontWeight: '600'
          }}>📝 RSVP: {item.rsvp_required === 'ya' ? 'Diperlukan' : 'Tidak'}</span>
        </div>

        {item.status_kehadiran === 'belum_konfirmasi' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: ADMIRE.spacing.md
          }}>
            <button
              onClick={() => handleKehadiranUpdate(item.id, 'hadir', 'Ketua akan hadir')}
              style={{
                padding: isMobile ? '12px' : '14px',
                background: ADMIRE.colors.gradient, color: ADMIRE.colors.text.white,
                border: 'none', borderRadius: ADMIRE.radius.md, fontSize: '14px',
                fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: ADMIRE.shadow.sm
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = ADMIRE.shadow.md;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = ADMIRE.shadow.sm;
              }}
            >✅ Hadir</button>

            <button
              onClick={() => handleKehadiranUpdate(item.id, 'tidak_hadir', 'Berhalangan hadir')}
              style={{
                padding: isMobile ? '12px' : '14px',
                background: `linear-gradient(135deg, ${ADMIRE.colors.error} 0%, #dc2626 100%)`,
                color: ADMIRE.colors.text.white, border: 'none',
                borderRadius: ADMIRE.radius.md, fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: ADMIRE.shadow.sm
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = ADMIRE.shadow.md;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = ADMIRE.shadow.sm;
              }}
            >❌ Tidak</button>

            <Link
              to={`/dashboardKetua/undangan/${item.id}/detail`}
              style={{
                padding: isMobile ? '12px' : '14px',
                background: 'transparent', color: ADMIRE.colors.text.secondary,
                border: `2px solid ${ADMIRE.colors.border}`, borderRadius: ADMIRE.radius.md,
                fontSize: '14px', fontWeight: '700', textDecoration: 'none',
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = ADMIRE.colors.primary;
                e.target.style.color = ADMIRE.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = ADMIRE.colors.border;
                e.target.style.color = ADMIRE.colors.text.secondary;
              }}
            >📋 Detail</Link>
          </div>
        )}

        {item.catatan_kehadiran && (
          <div style={{
            marginTop: ADMIRE.spacing.md, padding: ADMIRE.spacing.md,
            background: 'rgba(14, 165, 233, 0.04)', borderRadius: ADMIRE.radius.sm,
            borderLeft: `4px solid ${ADMIRE.colors.primary}`
          }}>
            <span style={{
              fontSize: '11px', fontWeight: '700', color: ADMIRE.colors.text.secondary,
              textTransform: 'uppercase', display: 'block', marginBottom: '4px'
            }}>💬 CATATAN</span>
            <p style={{
              fontSize: '13px', color: ADMIRE.colors.text.secondary,
              margin: '0', fontStyle: 'italic'
            }}>{item.catatan_kehadiran}</p>
          </div>
        )}
      </div>
    );
  };


  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: ADMIRE.spacing.md
      }}>
        <div style={{
          width: '50px', height: '50px', border: `4px solid ${ADMIRE.colors.border}`,
          borderTop: `4px solid ${ADMIRE.colors.primary}`, borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{
          fontSize: '16px', color: ADMIRE.colors.text.secondary, fontWeight: '600'
        }}>Memuat data undangan...</p>
      </div>
    );
  }


  return (
    <>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        backgroundColor: ADMIRE.colors.bg.main, minHeight: '100vh', width: '100%',
        padding: isMobile ? ADMIRE.spacing.md : isTablet ? ADMIRE.spacing.lg : ADMIRE.spacing.xl
      }}>
        <div style={{
          background: ADMIRE.colors.gradientAlt, borderRadius: ADMIRE.radius.xxl,
          padding: isMobile ? ADMIRE.spacing.lg : ADMIRE.spacing.xxl,
          marginBottom: ADMIRE.spacing.lg, position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '250px', height: '250px', borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)', filter: 'blur(70px)'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: ADMIRE.spacing.md, flexWrap: 'wrap', gap: ADMIRE.spacing.md
            }}>
              <h1 style={{
                fontSize: isMobile ? '24px' : isTablet ? '28px' : '36px',
                fontWeight: '900', color: ADMIRE.colors.text.white, margin: '0',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', letterSpacing: '-0.5px'
              }}>Approval Undangan</h1>
              <Link to="/dashboardKetua" style={{
                color: ADMIRE.colors.text.white, textDecoration: 'none',
                fontSize: '14px', fontWeight: '700',
                padding: `${ADMIRE.spacing.sm} ${ADMIRE.spacing.md}`,
                borderRadius: ADMIRE.radius.xl, background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)', transition: 'all 0.2s ease'
              }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >← Kembali</Link>
            </div>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: 'rgba(255, 255, 255, 0.95)', margin: '0',
              fontWeight: '500', lineHeight: '1.5'
            }}>Kelola konfirmasi kehadiran undangan kegiatan dan acara</p>
          </div>
        </div>

        <div style={{
          background: ADMIRE.colors.bg.card, borderRadius: ADMIRE.radius.lg,
          padding: isMobile ? ADMIRE.spacing.md : ADMIRE.spacing.lg,
          marginBottom: ADMIRE.spacing.lg, boxShadow: ADMIRE.shadow.sm,
          border: `1px solid ${ADMIRE.colors.border}`
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row', gap: ADMIRE.spacing.md
          }}>
            <h3 style={{
              fontSize: '16px', fontWeight: '700', color: ADMIRE.colors.text.primary,
              margin: '0', display: 'flex', alignItems: 'center', gap: ADMIRE.spacing.sm
            }}>
              <span style={{
                padding: `${ADMIRE.spacing.xs} ${ADMIRE.spacing.md}`,
                background: ADMIRE.colors.gradient, color: ADMIRE.colors.text.white,
                borderRadius: ADMIRE.radius.md, fontSize: '14px', fontWeight: '800'
              }}>{filteredUndangan.length}</span>
              Undangan
            </h3>

            <div style={{ display: 'flex', gap: ADMIRE.spacing.sm, flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'Baru', icon: '📋' },
                { key: 'tinggi', label: 'Urgent', icon: '🔴' },
                { key: 'akan_hadir', label: 'Disetujui', icon: '✅' },
                { key: 'tidak_hadir', label: 'Ditolak', icon: '❌' }
              ].map(opt => (
                <button key={opt.key} onClick={() => setFilter(opt.key)} style={{
                  padding: `${ADMIRE.spacing.sm} ${ADMIRE.spacing.md}`,
                  borderRadius: ADMIRE.radius.sm, border: 'none',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: filter === opt.key ? ADMIRE.colors.gradient : ADMIRE.colors.bg.main,
                  color: filter === opt.key ? ADMIRE.colors.text.white : ADMIRE.colors.text.secondary
                }}>
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredUndangan.length === 0 ? (
          <div style={{
            background: ADMIRE.colors.bg.card, borderRadius: ADMIRE.radius.xl,
            padding: ADMIRE.spacing.xxl, textAlign: 'center', boxShadow: ADMIRE.shadow.sm
          }}>
            <div style={{ fontSize: '64px', marginBottom: ADMIRE.spacing.md }}>📅</div>
            <h3 style={{
              fontSize: '20px', fontWeight: '700', color: ADMIRE.colors.text.primary,
              margin: `0 0 ${ADMIRE.spacing.sm} 0`
            }}>Tidak Ada Undangan</h3>
            <p style={{
              fontSize: '14px', color: ADMIRE.colors.text.secondary, margin: '0'
            }}>Tidak ada undangan yang sesuai dengan filter</p>
          </div>
        ) : (
          filteredUndangan.map(item => <UndanganCard key={item.id} item={item} />)
        )}
      </div>
    </>
  );
};


export default ApprovalUndangan;

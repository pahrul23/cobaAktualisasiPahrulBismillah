import React, { useState, useEffect } from 'react';

const ApprovalUndangan = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [undanganList, setUndanganList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const colors = {
    primary: {
      skyBlue: '#0ea5e9',
      teal: '#06b6d4',
      emerald: '#10b981'
    },
    gradients: {
      skyBlue: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      teal: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      admire: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)'
    },
    neutral: {
      lightGray: '#e2e8f0',
      formBg: '#f8fafc',
      white: '#ffffff',
      textSecondary: '#64748b',
      textDark: '#0f172a'
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
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
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setUndanganList(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch undangan data');
      }
    } catch (error) {
      console.error('Error loading undangan data:', error);
      // Fallback dummy data berdasarkan struktur database yang sebenarnya
      const dummyData = [
        {
          // Data dari tabel letters
          id: 61,
          jenis: 'undangan',
          no_disposisi: '0123/UND/DPD/IX/2025',
          no_surat: '045/BPSDM/IX/2025',
          asal_surat: 'Badan Pengembangan Sumber Daya Manusia (BPSDM) Kementerian Dalam Negeri',
          perihal: 'Undangan Rapat Koordinasi Nasional',
          tanggal_terima: '2025-09-07',
          tanggal_surat: '2025-09-04',
          uraian: 'Dengan hormat, bersama ini kami mengundang Ketua DPD RI untuk menghadiri Rapat Koordinasi Nasional terkait percepatan transformasi digital pemerintahan daerah.',
          keterangan: 'Mohon hadir tepat waktu, mengingat agenda padat.',
          label: 'merah',
          status: 'baru',
          // Data dari tabel letter_undangan
          hari_tanggal_acara: '2025-09-10',
          pukul: '09:39:00',
          tempat: 'Ruang Rapat Utama DPD RI',
          jenis_acara: 'Rapat',
          dress_code: 'Formal',
          rsvp_required: 'tidak',
          dokumentasi: 'Disediakan dokumentasi foto dan notulensi resmi',
          // Data dari tabel agenda (jika ada)
          status_kehadiran: 'belum_konfirmasi',
          catatan_kehadiran: null,
          tanggal_konfirmasi: null,
          tanggal_agenda: '2025-09-10'
        },
        {
          id: 66,
          jenis: 'undangan',
          no_disposisi: '056/UND/DPD/2025',
          no_surat: '315/UNDANGAN/IX/2025',
          asal_surat: 'Kementerian Dalam Negeri Republik Indonesia',
          perihal: 'Undangan Rapat Koordinasi Nasional Pemerintahan Daerah',
          tanggal_terima: '2025-09-09',
          tanggal_surat: '2025-09-07',
          uraian: 'Dengan hormat, sehubungan dengan agenda pembahasan peningkatan sinergi antara pemerintah pusat dan daerah, kami mengundang Ketua DPD RI untuk hadir dalam Rapat Koordinasi Nasional.',
          keterangan: 'Diharapkan membawa bahan paparan singkat mengenai peran DPD RI dalam mendukung otonomi daerah.',
          label: 'hijau',
          status: 'baru',
          hari_tanggal_acara: '2025-09-23',
          pukul: '15:30:00',
          tempat: 'Ruang Rapat Utama DPD RI',
          jenis_acara: 'Rapat',
          dress_code: 'Formal',
          rsvp_required: 'ya',
          dokumentasi: 'Dokumentasi akan dilaksanakan oleh Humas Kemendagri dan Biro Humas DPD RI.',
          status_kehadiran: 'belum_konfirmasi',
          catatan_kehadiran: null,
          tanggal_konfirmasi: null,
          tanggal_agenda: '2025-09-23'
        },
        {
          id: 68,
          jenis: 'undangan',
          no_disposisi: '089/UND/DPD/2025',
          no_surat: '520/UNDANGAN/IX/2025',
          asal_surat: 'Kementerian Perencanaan Pembangunan Nasional/Bappenas',
          perihal: 'Undangan Seminar Nasional Perencanaan Pembangunan 2025—2045',
          tanggal_terima: '2025-09-09',
          tanggal_surat: '2025-09-06',
          uraian: 'Dengan hormat, kami mengundang Ketua DPD RI untuk menghadiri Seminar Nasional terkait Rencana Pembangunan Jangka Panjang Nasional (RPJPN) 2025—2045.',
          keterangan: 'Diharapkan hadir sebagai narasumber utama dalam sesi pembukaan.',
          label: 'hitam',
          status: 'baru',
          hari_tanggal_acara: '2025-09-24',
          pukul: '09:00:00',
          tempat: 'Ruang Rapat Utama DPD RI',
          jenis_acara: 'Seminar',
          dress_code: 'Formal',
          rsvp_required: 'tidak',
          dokumentasi: null,
          status_kehadiran: 'belum_konfirmasi',
          catatan_kehadiran: null,
          tanggal_konfirmasi: null,
          tanggal_agenda: '2025-09-24'
        }
      ];
      setUndanganList(dummyData);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Fungsi untuk update status kehadiran - backend handle notifikasi
  const handleKehadiranUpdate = async (letterId, statusKehadiran, catatan = '') => {
    try {
      const userId = parseInt(localStorage.getItem('userId')) || 1;
      
      const response = await fetch(`http://localhost:4000/api/approval/agenda/${letterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jenis_surat: 'undangan',
          status_kehadiran: statusKehadiran,
          catatan_kehadiran: catatan,
          created_by: userId
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update attendance status');
      }

      // Update local state
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

      console.log(`Successfully updated attendance status for letter ID ${letterId} to ${statusKehadiran}`);
      
      // Success feedback
      alert(`Status kehadiran berhasil diperbarui menjadi "${statusKehadiran === 'hadir' ? 'Akan Hadir' : 'Tidak Hadir'}". Notifikasi telah dikirim ke staf.`);
      
    } catch (error) {
      console.error('Error updating attendance status:', error);
      alert('Gagal memperbarui status kehadiran: ' + error.message);
    }
  };

  const filteredUndangan = undanganList.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'tinggi') return item.label === 'merah';
    if (filter === 'pending') return item.status_kehadiran === 'belum_konfirmasi';
    if (filter === 'akan_hadir') return item.status_kehadiran === 'hadir';
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'TBD';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'TBD';
    try {
      const time = timeString.substring(0, 5);
      return `${time} WIB`;
    } catch {
      return 'TBD';
    }
  };

  const getPriorityLabel = (label) => {
    switch(label) {
      case 'merah': return 'Tinggi';
      case 'kuning': return 'Sedang';
      case 'hijau': return 'Normal';
      case 'hitam': return 'Normal';
      default: return 'Normal';
    }
  };

  const getStatusKehadiranColor = (status) => {
    switch(status) {
      case 'hadir': return { bg: '#d1fae5', color: '#065f46' };
      case 'tidak_hadir': return { bg: '#fee2e2', color: '#991b1b' };
      case 'belum_konfirmasi': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  // Component Undangan Item
  const UndanganItem = ({ item }) => {
    const statusKehadiran = getStatusKehadiranColor(item.status_kehadiran);
    
    return (
      <div style={{
        backgroundColor: colors.neutral.white,
        borderRadius: '16px',
        padding: isMobile ? '16px' : '24px',
        marginBottom: '16px',
        boxShadow: '0 4px 16px rgba(14, 165, 233, 0.08)',
        border: '1px solid rgba(14, 165, 233, 0.1)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '16px',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h3 style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '700',
                color: colors.neutral.textDark,
                margin: '0'
              }}>
                {item.perihal || 'Judul tidak tersedia'}
              </h3>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: item.label === 'merah' ? '#fee2e2' :
                                item.label === 'kuning' ? '#fef3c7' :
                                item.label === 'hijau' ? '#d1fae5' : '#f3f4f6',
                color: item.label === 'merah' ? '#dc2626' :
                       item.label === 'kuning' ? '#92400e' :
                       item.label === 'hijau' ? '#065f46' : '#374151'
              }}>
                {getPriorityLabel(item.label)}
              </span>
            </div>

            {/* Document Info */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 8px 0' }}>
                Informasi Surat:
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '6px'
              }}>
                <span style={{
                  fontSize: '13px',
                  color: colors.neutral.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>📄</span> No. Surat: {item.no_surat || 'N/A'}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: colors.neutral.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>📋</span> No. Disposisi: {item.no_disposisi || 'N/A'}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: colors.neutral.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  gridColumn: isMobile ? '1' : '1 / -1'
                }}>
                  <span>📅</span> Tanggal Terima: {formatDate(item.tanggal_terima)}
                </span>
              </div>
            </div>

            {/* Schedule Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                color: colors.neutral.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🏢</span> {item.asal_surat || 'Tidak diketahui'}
              </span>
              <span style={{
                fontSize: '14px',
                color: colors.neutral.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📅</span> {formatDate(item.hari_tanggal_acara)}
              </span>
              <span style={{
                fontSize: '14px',
                color: colors.neutral.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🕐</span> {formatTime(item.pukul)}
              </span>
              <span style={{
                fontSize: '14px',
                color: colors.neutral.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📍</span> {item.tempat || 'TBD'}
              </span>
              <span style={{
                fontSize: '14px',
                color: colors.neutral.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🎭</span> {item.jenis_acara || 'Tidak diketahui'}
              </span>
              <span style={{
                fontSize: '14px',
                color: colors.neutral.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>👔</span> {item.dress_code || 'Tidak ditentukan'}
              </span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 6px 0' }}>
                Deskripsi Undangan:
              </h4>
              <p style={{
                fontSize: '14px',
                color: colors.neutral.textSecondary,
                margin: '0',
                lineHeight: '1.5'
              }}>
                {item.uraian || 'Deskripsi tidak tersedia'}
              </p>
            </div>

            {/* RSVP and Documentation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                color: colors.neutral.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📝</span> RSVP: {item.rsvp_required === 'ya' ? 'Diperlukan' : 'Tidak diperlukan'}
              </span>
              {item.dokumentasi && (
                <span style={{
                  fontSize: '14px',
                  color: colors.neutral.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>📸</span> Dokumentasi tersedia
                </span>
              )}
            </div>

            {/* Documentation Details */}
            {item.dokumentasi && (
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 8px 0' }}>
                  Dokumentasi:
                </h4>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: colors.primary.skyBlue + '20',
                  color: colors.primary.skyBlue,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  📄 {item.dokumentasi}
                </span>
              </div>
            )}

            {/* Catatan Kehadiran jika ada */}
            {item.catatan_kehadiran && (
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 6px 0' }}>
                  Catatan Kehadiran:
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: colors.neutral.textSecondary,
                  margin: '0',
                  fontStyle: 'italic'
                }}>
                  {item.catatan_kehadiran}
                </p>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: statusKehadiran.bg,
              color: statusKehadiran.color
            }}>
              {item.status_kehadiran === 'hadir' ? 'Akan Hadir' :
               item.status_kehadiran === 'tidak_hadir' ? 'Tidak Hadir' : 'Belum Konfirmasi'}
            </span>
          </div>
        </div>

        {/* Action Buttons - Update status kehadiran */}
        {item.status_kehadiran === 'belum_konfirmasi' && (
          <div style={{
            display: 'flex',
            gap: '12px',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <button
              onClick={() => handleKehadiranUpdate(item.id, 'hadir', 'Ketua akan hadir dalam acara ini')}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: colors.gradients.emerald,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ✅ Akan Hadir
            </button>
            
            <button
              onClick={() => handleKehadiranUpdate(item.id, 'tidak_hadir', 'Ketua berhalangan hadir')}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ❌ Tidak Hadir
            </button>
            
            <button
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'transparent',
                color: colors.neutral.textSecondary,
                border: `1px solid ${colors.neutral.lightGray}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = colors.primary.skyBlue;
                e.target.style.color = colors.primary.skyBlue;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = colors.neutral.lightGray;
                e.target.style.color = colors.neutral.textSecondary;
              }}
            >
              📋 Detail Lengkap
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${colors.neutral.lightGray}`,
          borderTop: `4px solid ${colors.primary.skyBlue}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <div style={{ fontSize: '16px', color: colors.neutral.textSecondary }}>
          Memuat data undangan...
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{
        fontFamily: "'Inter', 'Poppins', sans-serif",
        backgroundColor: colors.neutral.formBg,
        minHeight: '100vh',
        margin: 0,
        padding: isMobile ? '12px' : '20px',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{
          background: colors.gradients.teal,
          borderRadius: '20px',
          padding: isMobile ? '20px' : '32px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(60px)'
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h1 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '800',
                color: 'white',
                margin: '0',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                Approval Undangan
              </h1>
              <button
                style={{
                  color: 'white',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: '0.9',
                  cursor: 'pointer'
                }}
              >
                ← Kembali ke Approval Center
              </button>
            </div>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              fontWeight: '500'
            }}>
              Kelola konfirmasi kehadiran undangan kegiatan dan acara
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div style={{
          backgroundColor: colors.neutral.white,
          borderRadius: '16px',
          padding: isMobile ? '16px' : '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(14, 165, 233, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: colors.neutral.textDark,
              margin: '0'
            }}>
              Filter Undangan ({filteredUndangan.length} item)
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'Semua' },
                { key: 'pending', label: 'Belum Konfirmasi' },
                { key: 'akan_hadir', label: 'Akan Hadir' },
                { key: 'tinggi', label: 'Prioritas Tinggi' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: filter === filterOption.key ? colors.primary.teal : colors.neutral.lightGray,
                    color: filter === filterOption.key ? 'white' : colors.neutral.textSecondary
                  }}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Undangan List */}
        <div>
          {filteredUndangan.map((item) => (
            <UndanganItem key={item.id} item={item} />
          ))}
          {filteredUndangan.length === 0 && (
            <div style={{
              backgroundColor: colors.neutral.white,
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(14, 165, 233, 0.08)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 8px 0' }}>
                Tidak ada undangan
              </h3>
              <p style={{ fontSize: '14px', color: colors.neutral.textSecondary, margin: '0' }}>
                Tidak ada undangan yang sesuai dengan filter yang dipilih.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApprovalUndangan;
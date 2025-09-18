import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Modal Component
const AudiensiApprovalModal = ({ 
  isOpen, 
  onClose, 
  audiensi, 
  onApprove,
  onReject 
}) => {
  const [approvalMode, setApprovalMode] = useState(null);
  const [formData, setFormData] = useState({
    hari_tanggal: '',
    pukul: '',
    tempat: 'Ruang Rapat DPD RI',
    catatan: ''
  });
  const [loading, setLoading] = useState(false);

  const colors = {
    primary: {
      skyBlue: '#0ea5e9',
      teal: '#06b6d4', 
      emerald: '#10b981'
    },
    gradients: {
      skyBlue: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      red: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    },
    neutral: {
      lightGray: '#e2e8f0',
      white: '#ffffff',
      textSecondary: '#64748b',
      textDark: '#0f172a'
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApprove = async () => {
    if (!formData.hari_tanggal || !formData.pukul || !formData.tempat.trim()) {
      alert('Mohon lengkapi semua field jadwal audiensi');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Starting audiensi approval process...');
      console.log('📋 Audiensi data:', audiensi);
      console.log('📅 Schedule data:', formData);
      
      // Ambil user ID dari localStorage atau session
      const userId = localStorage.getItem('userId') || '1';
      
      const response = await fetch(`http://localhost:4000/api/approval/audiensi/${audiensi.letter_id}/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: 'approve',
          approved_by: parseInt(userId),
          schedule: {
            hari_tanggal: formData.hari_tanggal,
            pukul: formData.pukul,
            tempat: formData.tempat
          },
          notes: formData.catatan || 'Ketua menyetujui permohonan audiensi ini'
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ API Response:', result);
      
      if (!result.success) {
        throw new Error(result.error || result.message || 'Failed to approve audiensi');
      }

      console.log('✅ Audiensi approved successfully');
      
      // Call parent callback untuk update UI
      if (onApprove) {
        console.log('📞 Calling parent onApprove callback...');
        await onApprove(audiensi.letter_id, {
          action: 'approve',
          schedule: formData,
          result: result.data
        });
      }
      
      // Success message
      alert(`Audiensi berhasil disetujui dan dijadwalkan!

Tanggal: ${formData.hari_tanggal}
Waktu: ${formData.pukul}
Tempat: ${formData.tempat}

Notifikasi telah dikirim ke staf secara otomatis.`);
      
      // Reset form dan close modal
      setApprovalMode(null);
      setFormData({
        hari_tanggal: '',
        pukul: '',
        tempat: 'Ruang Rapat DPD RI',
        catatan: ''
      });
      onClose();
      
    } catch (error) {
      console.error('💥 Error approving audiensi:', error);
      alert(`Gagal menyetujui audiensi: ${error.message}\n\nSilakan coba lagi atau hubungi admin.`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!formData.catatan.trim()) {
      alert('Mohon berikan alasan penolakan');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Starting audiensi rejection process...');
      
      const userId = localStorage.getItem('userId') || '1';
      
      const response = await fetch(`http://localhost:4000/api/approval/audiensi/${audiensi.letter_id}/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: 'reject',
          approved_by: parseInt(userId),
          notes: formData.catatan
        })
      });

      console.log('📡 Reject response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Reject HTTP Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Reject API Response:', result);
      
      if (!result.success) {
        throw new Error(result.error || result.message || 'Failed to reject audiensi');
      }

      // Call parent callback
      if (onReject) {
        console.log('📞 Calling parent onReject callback...');
        await onReject(audiensi.letter_id, {
          action: 'reject',
          notes: formData.catatan,
          result: result.data
        });
      }
      
      alert('Audiensi telah ditolak. Notifikasi telah dikirim secara otomatis.');
      
      setApprovalMode(null);
      setFormData({
        hari_tanggal: '',
        pukul: '',
        tempat: 'Ruang Rapat DPD RI',
        catatan: ''
      });
      onClose();
      
    } catch (error) {
      console.error('💥 Error rejecting audiensi:', error);
      alert(`Gagal menolak audiensi: ${error.message}\n\nSilakan coba lagi atau hubungi admin.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !audiensi) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: colors.neutral.white,
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            background: colors.gradients.emerald,
            padding: '24px',
            borderRadius: '20px 20px 0 0',
            position: 'relative'
          }}>
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
            >
              ×
            </button>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 8px 0'
            }}>
              Approval Audiensi
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0'
            }}>
              Review dan tentukan jadwal audiensi
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            
            {/* Audiensi Info */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: colors.neutral.textDark,
                margin: '0 0 16px 0'
              }}>
                {audiensi.perihal}
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: colors.neutral.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Pemohon
                  </span>
                  <p style={{
                    fontSize: '14px',
                    color: colors.neutral.textDark,
                    margin: '4px 0 0 0',
                    fontWeight: '500'
                  }}>
                    {audiensi.nama_pemohon}
                  </p>
                </div>
                
                <div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: colors.neutral.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Organisasi
                  </span>
                  <p style={{
                    fontSize: '14px',
                    color: colors.neutral.textDark,
                    margin: '4px 0 0 0',
                    fontWeight: '500'
                  }}>
                    {audiensi.instansi_organisasi}
                  </p>
                </div>
                
                <div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: colors.neutral.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Jumlah Peserta
                  </span>
                  <p style={{
                    fontSize: '14px',
                    color: colors.neutral.textDark,
                    margin: '4px 0 0 0',
                    fontWeight: '500'
                  }}>
                    {audiensi.jumlah_peserta || 'TBD'} orang
                  </p>
                </div>
                
                <div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: colors.neutral.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    No. Surat
                  </span>
                  <p style={{
                    fontSize: '14px',
                    color: colors.neutral.textDark,
                    margin: '4px 0 0 0',
                    fontWeight: '500'
                  }}>
                    {audiensi.no_surat}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: colors.neutral.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Topik Audiensi
                </span>
                <p style={{
                  fontSize: '14px',
                  color: colors.neutral.textDark,
                  margin: '4px 0 0 0',
                  lineHeight: '1.5'
                }}>
                  {audiensi.topik_audiensi}
                </p>
              </div>
              
              <div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: colors.neutral.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Uraian Permohonan
                </span>
                <p style={{
                  fontSize: '14px',
                  color: colors.neutral.textDark,
                  margin: '4px 0 0 0',
                  lineHeight: '1.5'
                }}>
                  {audiensi.uraian}
                </p>
              </div>
            </div>

            {/* Action Selection */}
            {!approvalMode && (
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <button
                  onClick={() => setApprovalMode('approve')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: colors.gradients.emerald,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ✅ Setujui Audiensi
                </button>
                <button
                  onClick={() => setApprovalMode('reject')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: colors.gradients.red,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ❌ Tolak Audiensi
                </button>
              </div>
            )}

            {/* Approve Form */}
            {approvalMode === 'approve' && (
              <div>
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '2px solid #10b981',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#065f46',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ✅ Tentukan Jadwal Audiensi
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#065f46',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Tanggal *
                      </label>
                      <input
                        type="date"
                        value={formData.hari_tanggal}
                        onChange={(e) => handleInputChange('hari_tanggal', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1fae5',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#065f46',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Waktu *
                      </label>
                      <input
                        type="time"
                        value={formData.pukul}
                        onChange={(e) => handleInputChange('pukul', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #d1fae5',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#065f46',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Tempat *
                    </label>
                    <input
                      type="text"
                      value={formData.tempat}
                      onChange={(e) => handleInputChange('tempat', e.target.value)}
                      placeholder="Masukkan lokasi audiensi"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #d1fae5',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#065f46',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Catatan Tambahan
                    </label>
                    <textarea
                      value={formData.catatan}
                      onChange={(e) => handleInputChange('catatan', e.target.value)}
                      placeholder="Catatan atau instruksi khusus untuk audiensi..."
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #d1fae5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setApprovalMode(null)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'transparent',
                      color: colors.neutral.textSecondary,
                      border: `2px solid ${colors.neutral.lightGray}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    style={{
                      flex: 2,
                      padding: '12px',
                      background: loading ? colors.neutral.lightGray : colors.gradients.emerald,
                      color: loading ? colors.neutral.textSecondary : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Memproses...' : 'Konfirmasi Persetujuan'}
                  </button>
                </div>
              </div>
            )}

            {/* Reject Form */}
            {approvalMode === 'reject' && (
              <div>
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '2px solid #ef4444',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#991b1b',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ❌ Alasan Penolakan
                  </h4>
                  
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#991b1b',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      Catatan Penolakan *
                    </label>
                    <textarea
                      value={formData.catatan}
                      onChange={(e) => handleInputChange('catatan', e.target.value)}
                      placeholder="Jelaskan alasan penolakan audiensi ini..."
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #fecaca',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setApprovalMode(null)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'transparent',
                      color: colors.neutral.textSecondary,
                      border: `2px solid ${colors.neutral.lightGray}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    style={{
                      flex: 2,
                      padding: '12px',
                      background: loading ? colors.neutral.lightGray : colors.gradients.red,
                      color: loading ? colors.neutral.textSecondary : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Memproses...' : 'Konfirmasi Penolakan'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Main ApprovalAudiensi Component
const ApprovalAudiensi = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [audiensiList, setAudiensiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAudiensi, setSelectedAudiensi] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadAudiensiData();
  }, []);

  const loadAudiensiData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading audiensi data...');
      
      const response = await fetch('http://localhost:4000/api/approval/audiensi/pending', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('📡 Load response status:', response.status);
      console.log('📡 Load response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Load Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📦 Load result:', result);
      
      if (result.success) {
        console.log(`✅ Loaded ${result.data.length} pending audiensi`);
        setAudiensiList(result.data || []);
      } else {
        throw new Error(result.error || result.message || 'Failed to fetch audiensi data');
      }
      
    } catch (error) {
      console.error('💥 Error loading audiensi data:', error);
      
      // Fallback data untuk development - HAPUS di production
      const dummyData = [
        {
          letter_id: 67,
          no_surat: '456/AUDIENSI/IX/2025',
          no_disposisi: '078/AUD/DPD/2025',
          asal_surat: 'Lembaga Swadaya Masyarakat Transparansi Bangsa',
          perihal: 'Permohonan Audiensi terkait RUU Perlindungan Data Pribadi',
          tanggal_terima: '2025-09-08',
          tanggal_surat: '2025-09-07',
          status: 'baru',
          label: 'merah',
          uraian: 'Bersama ini kami memohon kesempatan untuk beraudiensi dengan Ketua DPD RI guna menyampaikan aspirasi masyarakat terkait implementasi RUU Perlindungan Data Pribadi.',
          nama_pemohon: 'Budi Santoso',
          instansi_organisasi: 'LSM Transparansi Bangsa',
          jumlah_peserta: 8,
          topik_audiensi: 'Diskusi publik terkait urgensi dan implementasi RUU Perlindungan Data Pribadi',
          hari_tanggal: '2025-09-16',
          pukul: '10:00:00',
          tempat: 'Ruang Rapat DPD RI',
          dokumentasi: 'Dokumentasi resmi akan disediakan',
          status_kehadiran: 'belum_konfirmasi',
          approved_status: 'pending'
        }
      ];
      
      console.log('⚠️ Using fallback dummy data');
      setAudiensiList(dummyData);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve button click - opens modal
  const handleApproveClick = (audiensi) => {
    console.log('📝 Opening approval modal for:', audiensi);
    setSelectedAudiensi(audiensi);
    setShowModal(true);
  };

  // Handle modal approve with schedule
  const handleModalApprove = async (letterId, approvalData) => {
    try {
      console.log('🔄 Parent handling approval completion:', approvalData);
      
      // Remove dari pending list karena sudah diproses
      setAudiensiList(prev => prev.filter(item => item.letter_id !== letterId));
      
      console.log('✅ Audiensi removed from pending list');
      
    } catch (error) {
      console.error('💥 Error in parent approve handler:', error);
      throw error;
    }
  };

  // Handle modal reject 
  const handleModalReject = async (letterId, rejectData) => {
    try {
      console.log('🔄 Parent handling rejection completion:', rejectData);
      
      // Remove dari pending list karena sudah diproses
      setAudiensiList(prev => prev.filter(item => item.letter_id !== letterId));
      
      console.log('✅ Rejected audiensi removed from pending list');
      
    } catch (error) {
      console.error('💥 Error in parent reject handler:', error);
      throw error;
    }
  };

  const filteredAudiensi = audiensiList.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'tinggi') return item.label === 'merah';
    if (filter === 'pending') return item.approved_status === 'pending';
    return true;
  });

  // Format date for display
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

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'TBD';
    try {
      const time = timeString.substring(0, 5);
      return `${time} WIB`;
    } catch {
      return 'TBD';
    }
  };

  // Get priority label
  const getPriorityLabel = (label) => {
    switch(label) {
      case 'merah': return 'Tinggi';
      case 'kuning': return 'Sedang';
      case 'hijau': return 'Normal';
      case 'hitam': return 'Normal';
      default: return 'Normal';
    }
  };

  // Audiensi Item Component
  const AudiensiItem = ({ item }) => (
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
              {item.perihal}
            </h3>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: item.label === 'merah' ? '#fee2e2' : '#dbeafe',
              color: item.label === 'merah' ? '#dc2626' : '#2563eb'
            }}>
              {getPriorityLabel(item.label)}
            </span>
          </div>
          
          {/* Contact Info */}
          <div style={{ 
            backgroundColor: '#f8fafc',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 8px 0' }}>
              Informasi Pemohon:
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '6px'
            }}>
              <span style={{ fontSize: '13px', color: colors.neutral.textSecondary }}>
                👤 {item.nama_pemohon}
              </span>
              <span style={{ fontSize: '13px', color: colors.neutral.textSecondary }}>
                🏢 {item.instansi_organisasi}
              </span>
              <span style={{ fontSize: '13px', color: colors.neutral.textSecondary }}>
                📄 No. Surat: {item.no_surat}
              </span>
              <span style={{ fontSize: '13px', color: colors.neutral.textSecondary }}>
                👥 {item.jumlah_peserta} peserta
              </span>
            </div>
          </div>
          
          {/* Topic */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 6px 0' }}>
              Topik Audiensi:
            </h4>
            <p style={{
              fontSize: '14px',
              color: colors.neutral.textSecondary,
              margin: '0',
              lineHeight: '1.5'
            }}>
              {item.topik_audiensi}
            </p>
          </div>
          
          {/* Purpose */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 6px 0' }}>
              Uraian Permohonan:
            </h4>
            <p style={{
              fontSize: '14px',
              color: colors.neutral.textSecondary,
              margin: '0',
              lineHeight: '1.5'
            }}>
              {item.uraian}
            </p>
          </div>
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
            backgroundColor: '#fef3c7',
            color: '#92400e'
          }}>
            Menunggu Persetujuan
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <button
          onClick={() => handleApproveClick(item)}
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
          📝 Review & Proses Audiensi
        </button>
        
        <Link 
          to={`/dashboardKetua/audiensi/${item.letter_id}/detail`}
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
            textDecoration: 'none',
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
        </Link>
      </div>
    </div>
  );

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
          borderTop: `4px solid ${colors.primary.emerald}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <div style={{ fontSize: '16px', color: colors.neutral.textSecondary }}>
          Memuat data audiensi...
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
          background: colors.gradients.emerald,
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
                Approval Audiensi
              </h1>
              <Link 
                to="/dashboardKetua/approval"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: '0.9',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                ← Kembali
              </Link>
            </div>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              fontWeight: '500'
            }}>
              Kelola permohonan audiensi dari berbagai organisasi
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
              Filter Audiensi ({filteredAudiensi.length} item)
            </h3>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'Semua' },
                { key: 'pending', label: 'Pending' },
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
                    backgroundColor: filter === filterOption.key ? colors.primary.emerald : colors.neutral.lightGray,
                    color: filter === filterOption.key ? 'white' : colors.neutral.textSecondary
                  }}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audiensi List */}
        <div>
          {filteredAudiensi.map((item) => (
            <AudiensiItem key={item.letter_id} item={item} />
          ))}
          
          {filteredAudiensi.length === 0 && (
            <div style={{
              backgroundColor: colors.neutral.white,
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(14, 165, 233, 0.08)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.neutral.textDark, margin: '0 0 8px 0' }}>
                {loading ? 'Memuat...' : 'Tidak ada permohonan audiensi'}
              </h3>
              <p style={{ fontSize: '14px', color: colors.neutral.textSecondary, margin: '0' }}>
                {loading ? 'Sedang mengambil data audiensi...' : 'Tidak ada permohonan audiensi yang sesuai dengan filter yang dipilih.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        <AudiensiApprovalModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedAudiensi(null);
          }}
          audiensi={selectedAudiensi}
          onApprove={handleModalApprove}
          onReject={handleModalReject}
        />
      </div>
    </>
  );
};

export default ApprovalAudiensi;
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import useAuth from '../../hooks/useAuth';

const ReportsList = () => {
  const { user, token } = useAuth();
  const [pendingAudiensi, setPendingAudiensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is Ketua
  const isKetua = user?.role?.toLowerCase() === 'ketua';

  // Fetch pending audiensi (mock data for now)
  const fetchPendingAudiensi = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with real API call
      // For now, mock some data to test UI
      setTimeout(() => {
        const mockData = [
          {
            id: 1,
            perihal: "Diskusi publik terkait urgensi dan implementasi RUU Perlindungan Data Pribadi",
            asal_surat: "LSM Transparansi Bangsa",
            nama_pemohon: "Budi Santoso",
            instansi_organisasi: "LSM Transparansi Bangsa",
            jumlah_peserta: 4,
            topik_audiensi: "Diskusi publik terkait urgensi dan implementasi RUU Perlindungan Data Pribadi",
            created_at: new Date().toISOString()
          }
        ];
        setPendingAudiensi(mockData);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching pending audiensi:', error);
      setError('Gagal memuat data');
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (isKetua) {
      fetchPendingAudiensi();
    }
  }, [isKetua]);

  if (!isKetua) {
    return (
      <DashboardLayout>
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          textAlign: 'center',
          padding: '60px 20px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚫</div>
          <h1 style={{
            margin: '0 0 12px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#ef4444'
          }}>
            Akses Ditolak
          </h1>
          <p style={{
            margin: 0,
            fontSize: '16px',
            color: '#64748b'
          }}>
            Hanya Ketua yang dapat mengakses notifikasi approval
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ fontSize: '32px' }}>🔔</div>
            <h1 style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a202c'
            }}>
              Notifikasi Approval
            </h1>
            {pendingAudiensi.length > 0 && (
              <span style={{
                background: '#ef4444',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {pendingAudiensi.length}
              </span>
            )}
          </div>
          <p style={{
            margin: 0,
            fontSize: '16px',
            color: '#64748b'
          }}>
            Permohonan audiensi yang menunggu persetujuan Anda
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#64748b' }}>Memuat data...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <p style={{ color: '#ef4444' }}>{error}</p>
            <button 
              onClick={fetchPendingAudiensi}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Coba Lagi
            </button>
          </div>
        ) : pendingAudiensi.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ 
              margin: '0 0 8px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a202c'
            }}>
              Tidak Ada Permohonan Pending
            </h2>
            <p style={{ color: '#64748b' }}>
              Semua permohonan audiensi sudah diproses
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingAudiensi.map((audiensi) => (
              <div
                key={audiensi.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  border: '2px solid #f59e0b',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '24px' }}>🤝</span>
                      <h3 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1a202c'
                      }}>
                        {audiensi.perihal}
                      </h3>
                      <span style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        PENDING
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                          Asal Surat
                        </label>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                          {audiensi.asal_surat}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                          Nama Pemohon
                        </label>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                          {audiensi.nama_pemohon || '-'}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                          Instansi/Organisasi
                        </label>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                          {audiensi.instansi_organisasi || '-'}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                          Jumlah Peserta
                        </label>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                          {audiensi.jumlah_peserta ? `${audiensi.jumlah_peserta} orang` : '-'}
                        </div>
                      </div>
                    </div>

                    {audiensi.topik_audiensi && (
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                          Topik Audiensi
                        </label>
                        <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                          {audiensi.topik_audiensi}
                        </div>
                      </div>
                    )}

                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Diterima pada: {formatDate(audiensi.created_at)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                    <button
                      onClick={() => alert('Modal approval akan dibuat setelah backend ready')}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsList;
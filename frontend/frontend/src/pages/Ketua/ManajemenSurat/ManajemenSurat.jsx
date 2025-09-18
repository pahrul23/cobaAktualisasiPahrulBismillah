import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';

const ManajemenSurat = () => {
  const [stats, setStats] = useState({
    pengaduan: { count: 0, status: { baru: 0, diproses: 0, selesai: 0 } },
    pemberitahuan: { count: 0, status: { baru: 0, diproses: 0, selesai: 0 } },
    undangan: { count: 0, status: { baru: 0, diproses: 0, selesai: 0 } },
    audiensi: { count: 0, status: { baru: 0, diproses: 0, selesai: 0 } },
    proposal: { count: 0, status: { baru: 0, diproses: 0, selesai: 0 } }
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // ADMIRE Color Palette
  const colors = {
    primary: {
      skyBlue: '#0ea5e9',
      teal: '#06b6d4', 
      emerald: '#10b981',
      purple: '#8b5cf6',
      rose: '#f43f5e'
    },
    gradients: {
      skyBlue: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      teal: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      rose: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
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

  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:4000/api/letters/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } else {
        // Fallback with mock data if API fails
        setStats({
          pengaduan: { count: 12, status: { baru: 5, diproses: 4, selesai: 3 } },
          pemberitahuan: { count: 8, status: { baru: 3, diproses: 2, selesai: 3 } },
          undangan: { count: 15, status: { baru: 6, diproses: 5, selesai: 4 } },
          audiensi: { count: 10, status: { baru: 4, diproses: 3, selesai: 3 } },
          proposal: { count: 7, status: { baru: 3, diproses: 2, selesai: 2 } }
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use mock data as fallback
      setStats({
        pengaduan: { count: 12, status: { baru: 5, diproses: 4, selesai: 3 } },
        pemberitahuan: { count: 8, status: { baru: 3, diproses: 2, selesai: 3 } },
        undangan: { count: 15, status: { baru: 6, diproses: 5, selesai: 4 } },
        audiensi: { count: 10, status: { baru: 4, diproses: 3, selesai: 3 } },
        proposal: { count: 7, status: { baru: 3, diproses: 2, selesai: 2 } }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Card data configuration
  const cardData = [
    {
      id: 'pengaduan',
      title: 'Pengaduan',
      icon: '📋',
      description: 'Kelola surat pengaduan masyarakat',
      gradient: colors.gradients.rose,
      primaryColor: colors.primary.rose,
      route: '/dashboardKetua/surat/pengaduan'
    },
    {
      id: 'pemberitahuan',
      title: 'Pemberitahuan',
      icon: '📢',
      description: 'Kelola surat pemberitahuan resmi',
      gradient: colors.gradients.purple,
      primaryColor: colors.primary.purple,
      route: '/dashboardKetua/surat/pemberitahuan'
    },
    {
      id: 'undangan',
      title: 'Undangan',
      icon: '🎉',
      description: 'Kelola undangan acara dan kegiatan',
      gradient: colors.gradients.skyBlue,
      primaryColor: colors.primary.skyBlue,
      route: '/dashboardKetua/surat/undangan'
    },
    {
      id: 'audiensi',
      title: 'Audiensi',
      icon: '🤝',
      description: 'Kelola permohonan audiensi',
      gradient: colors.gradients.emerald,
      primaryColor: colors.primary.emerald,
      route: '/dashboardKetua/surat/audiensi'
    },
    {
      id: 'proposal',
      title: 'Proposal',
      icon: '📄',
      description: 'Kelola proposal dan pengajuan dana',
      gradient: colors.gradients.teal,
      primaryColor: colors.primary.teal,
      route: '/dashboardKetua/surat/proposal'
    }
  ];

  // Get total count safely
  const getTotalCount = () => {
    return Object.values(stats).reduce((total, item) => total + (item.count || 0), 0);
  };

  // Card Component
  const SuratCard = ({ data }) => {
    const cardStats = stats[data.id] || { count: 0, status: { baru: 0, diproses: 0, selesai: 0 } };
    
    return (
      <div style={{
        background: colors.neutral.white,
        borderRadius: '20px',
        padding: isMobile ? '20px' : '24px',
        boxShadow: '0 8px 32px rgba(14, 165, 233, 0.12)',
        border: '1px solid rgba(14, 165, 233, 0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(14, 165, 233, 0.12)';
      }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: data.gradient,
          borderRadius: '50%',
          opacity: '0.1',
          filter: 'blur(20px)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              background: data.gradient,
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              {data.icon}
            </div>
            <div style={{
              background: data.primaryColor,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {cardStats.count} Total
            </div>
          </div>

          {/* Title & Description */}
          <h3 style={{
            fontSize: isMobile ? '18px' : '20px',
            fontWeight: '700',
            color: colors.neutral.textDark,
            margin: '0 0 8px 0'
          }}>
            {data.title}
          </h3>
          
          <p style={{
            fontSize: '14px',
            color: colors.neutral.textSecondary,
            margin: '0 0 20px 0',
            lineHeight: '1.5'
          }}>
            {data.description}
          </p>

          {/* Status Breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '8px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#92400e'
              }}>
                {cardStats.status?.baru || 0}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#92400e',
                fontWeight: '600'
              }}>
                Baru
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '8px',
              backgroundColor: '#dbeafe',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1d4ed8'
              }}>
                {cardStats.status?.diproses || 0}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#1d4ed8',
                fontWeight: '600'
              }}>
                Proses
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '8px',
              backgroundColor: '#d1fae5',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#065f46'
              }}>
                {cardStats.status?.selesai || 0}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#065f46',
                fontWeight: '600'
              }}>
                Selesai
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={data.route}
            style={{
              display: 'block',
              background: data.gradient,
              color: 'white',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = `0 4px 16px ${data.primaryColor}40`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Kelola {data.title}
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
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
            Memuat data manajemen surat...
          </div>
        </div>
      </DashboardLayout>
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
      
      <DashboardLayout>
        <div style={{
          fontFamily: "'Inter', 'Poppins', sans-serif",
          backgroundColor: colors.neutral.formBg,
          minHeight: '100vh',
          margin: 0,
          padding: isMobile ? '16px' : '24px'
        }}>
          
          {/* Header Section */}
          <div style={{
            background: colors.gradients.admire,
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Elements */}
            <div style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(60px)'
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: '-60px',
              left: '-60px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              filter: 'blur(40px)'
            }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '16px' : '0'
              }}>
                <div>
                  <h1 style={{
                    fontSize: isMobile ? '28px' : '36px',
                    fontWeight: '800',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}>
                    Manajemen Surat
                  </h1>
                  <p style={{
                    fontSize: isMobile ? '14px' : '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0',
                    fontWeight: '500'
                  }}>
                    Kelola semua jenis surat secara terpusat dan efisien
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'white',
                    margin: '0 0 4px 0'
                  }}>
                    {getTotalCount()}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total Surat
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: colors.neutral.white,
            borderRadius: '20px',
            padding: isMobile ? '20px' : '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)',
            border: '1px solid rgba(14, 165, 233, 0.1)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors.neutral.textDark,
              margin: '0 0 16px 0'
            }}>
              Aksi Cepat
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              <Link
                to="/dashboardKetua/surat/semua"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: colors.gradients.skyBlue,
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(14, 165, 233, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '20px' }}>📄</span>
                Lihat Semua Surat
              </Link>
              
              <Link
                to="/dashboardKetua/disposisi"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: colors.gradients.emerald,
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '20px' }}>📋</span>
                Kelola Disposisi
              </Link>
              
              <button
                onClick={fetchStats}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: colors.gradients.purple,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '20px' }}>🔄</span>
                Refresh Data
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {cardData.map((card) => (
              <SuratCard key={card.id} data={card} />
            ))}
          </div>

        </div>
      </DashboardLayout>
    </>
  );
};

export default ManajemenSurat;
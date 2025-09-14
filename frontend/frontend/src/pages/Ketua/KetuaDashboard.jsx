import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const KetuaDashboard = () => {
  const [stats, setStats] = useState({
    totalSurat: 0,
    pendingUndangan: 0,
    pendingAudiensi: 0,
    agendaHariIni: 0
  });
  
  const [pendingItems, setPendingItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Responsive hooks using modern approach
  const useResponsive = () => {
    const [breakpoint, setBreakpoint] = useState('desktop');
    
    useEffect(() => {
      const updateBreakpoint = () => {
        const width = window.innerWidth;
        if (width < 640) setBreakpoint('mobile');
        else if (width < 1024) setBreakpoint('tablet');
        else setBreakpoint('desktop');
      };
      
      updateBreakpoint();
      window.addEventListener('resize', updateBreakpoint);
      return () => window.removeEventListener('resize', updateBreakpoint);
    }, []);
    
    return breakpoint;
  };

  const breakpoint = useResponsive();
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  // Modern design system
  const theme = {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        900: '#1e3a8a'
      },
      secondary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d'
      },
      accent: {
        50: '#fef2f2',
        100: '#fee2e2',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c'
      },
      neutral: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      }
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      secondary: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
      accent: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      hero: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 50%, #8b5cf6 100%)'
    },
    spacing: {
      xs: isMobile ? '8px' : '12px',
      sm: isMobile ? '12px' : '16px',
      md: isMobile ? '16px' : '24px',
      lg: isMobile ? '20px' : '32px',
      xl: isMobile ? '24px' : '48px'
    },
    typography: {
      hero: {
        fontSize: isMobile ? '24px' : isTablet ? '28px' : '32px',
        fontWeight: '800',
        lineHeight: '1.2'
      },
      h2: {
        fontSize: isMobile ? '18px' : '20px',
        fontWeight: '700',
        lineHeight: '1.3'
      },
      h3: {
        fontSize: isMobile ? '16px' : '18px',
        fontWeight: '600',
        lineHeight: '1.4'
      },
      body: {
        fontSize: isMobile ? '14px' : '16px',
        lineHeight: '1.6'
      },
      small: {
        fontSize: isMobile ? '12px' : '14px',
        lineHeight: '1.5'
      }
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      xl: '0 25px 50px rgba(0, 0, 0, 0.15)'
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        totalSurat: 156,
        pendingUndangan: 3,
        pendingAudiensi: 2,
        agendaHariIni: 4
      });

      setPendingItems([
        {
          id: 1,
          type: 'undangan',
          title: 'Rapat Koordinasi Nasional RPJPN 2025',
          from: 'Kementerian Dalam Negeri',
          date: '2025-09-15',
          priority: 'tinggi',
          icon: '📅'
        },
        {
          id: 2,
          type: 'audiensi',
          title: 'Permohonan Audiensi RUU Perlindungan Data Pribadi',
          from: 'LSM Transparansi Digital Indonesia',
          date: '2025-09-18',
          priority: 'normal',
          icon: '🤝'
        },
        {
          id: 3,
          type: 'undangan',
          title: 'Seminar Nasional Transformasi Digital',
          from: 'Bappenas',
          date: '2025-09-20',
          priority: 'sedang',
          icon: '📅'
        }
      ]);

      setRecentActivities([
        {
          id: 1,
          action: 'Disetujui',
          description: 'Undangan Seminar Nasional Perencanaan Pembangunan dari Bappenas',
          time: '2 jam yang lalu',
          type: 'success'
        },
        {
          id: 2,
          action: 'Dikonfirmasi',
          description: 'Kehadiran rapat koordinasi dengan Tim Kemendikbud',
          time: '5 jam yang lalu',
          type: 'info'
        },
        {
          id: 3,
          action: 'Ditinjau',
          description: 'Proposal kerjasama dari Universitas Indonesia',
          time: '1 hari yang lalu',
          type: 'pending'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  // Modern Stat Card with improved design
  const StatCard = ({ title, value, icon, gradient, link, description }) => (
    <Link to={link} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: theme.colors.neutral[50],
        borderRadius: isMobile ? '16px' : '20px',
        padding: theme.spacing.md,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        border: `1px solid ${theme.colors.neutral[200]}`,
        height: '100%',
        minHeight: isMobile ? '120px' : '140px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = theme.shadows.lg;
        e.currentTarget.style.borderColor = theme.colors.primary[300];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme.shadows.sm;
        e.currentTarget.style.borderColor = theme.colors.neutral[200];
      }}
      >
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradient,
          borderRadius: '20px 20px 0 0'
        }} />
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: theme.spacing.sm
        }}>
          <div style={{
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
            borderRadius: '12px',
            background: `${gradient}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '20px' : '24px'
          }}>
            {icon}
          </div>
          
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: `${gradient}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: gradient
            }} />
          </div>
        </div>
        
        <div>
          <h3 style={{
            ...theme.typography.hero,
            background: gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 4px 0'
          }}>
            {value}
          </h3>
          <p style={{
            ...theme.typography.body,
            color: theme.colors.neutral[700],
            margin: '0 0 4px 0',
            fontWeight: '600'
          }}>
            {title}
          </p>
          {description && (
            <p style={{
              ...theme.typography.small,
              color: theme.colors.neutral[500],
              margin: '0'
            }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );

  // Enhanced Activity Item
  const ActivityItem = ({ activity }) => {
    const getActivityStyle = (type) => {
      switch(type) {
        case 'success':
          return {
            bg: theme.colors.secondary[50],
            border: theme.colors.secondary[200],
            dot: theme.colors.secondary[500],
            icon: '✅'
          };
        case 'info':
          return {
            bg: theme.colors.primary[50],
            border: theme.colors.primary[200],
            dot: theme.colors.primary[500],
            icon: '📋'
          };
        case 'pending':
          return {
            bg: theme.colors.neutral[50],
            border: theme.colors.neutral[200],
            dot: theme.colors.neutral[400],
            icon: '👀'
          };
        default:
          return {
            bg: theme.colors.neutral[50],
            border: theme.colors.neutral[200],
            dot: theme.colors.neutral[400],
            icon: '📄'
          };
      }
    };

    const style = getActivityStyle(activity.type);

    return (
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing.sm,
        padding: `${theme.spacing.sm} 0`,
        borderBottom: `1px solid ${theme.colors.neutral[100]}`
      }}>
        <div style={{
          width: isMobile ? '36px' : '40px',
          height: isMobile ? '36px' : '40px',
          borderRadius: '12px',
          background: style.bg,
          border: `1px solid ${style.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: isMobile ? '16px' : '18px'
        }}>
          {style.icon}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            marginBottom: '4px'
          }}>
            <h4 style={{
              ...theme.typography.h3,
              color: theme.colors.neutral[900],
              margin: '0'
            }}>
              {activity.action}
            </h4>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: style.dot
            }} />
          </div>
          
          <p style={{
            ...theme.typography.body,
            color: theme.colors.neutral[600],
            margin: '0 0 4px 0',
            lineHeight: '1.5'
          }}>
            {activity.description}
          </p>
          
          <span style={{
            ...theme.typography.small,
            color: theme.colors.neutral[500]
          }}>
            {activity.time}
          </span>
        </div>
      </div>
    );
  };

  // Enhanced Pending Item
  const PendingItem = ({ item }) => {
    const getPriorityStyle = (priority) => {
      switch(priority) {
        case 'tinggi':
          return { bg: theme.colors.accent[50], color: theme.colors.accent[700], border: theme.colors.accent[200] };
        case 'sedang':
          return { bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
        default:
          return { bg: theme.colors.primary[50], color: theme.colors.primary[700], border: theme.colors.primary[200] };
      }
    };

    const priorityStyle = getPriorityStyle(item.priority);

    return (
      <div style={{
        padding: theme.spacing.md,
        background: theme.colors.neutral[50],
        borderRadius: '12px',
        border: `1px solid ${theme.colors.neutral[200]}`,
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme.colors.neutral[100];
        e.currentTarget.style.borderColor = theme.colors.primary[300];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = theme.colors.neutral[50];
        e.currentTarget.style.borderColor = theme.colors.neutral[200];
      }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: theme.spacing.xs,
          marginBottom: theme.spacing.xs
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <span style={{ fontSize: isMobile ? '16px' : '18px' }}>{item.icon}</span>
            <h3 style={{
              ...theme.typography.h3,
              color: theme.colors.neutral[900],
              margin: '0',
              flex: 1
            }}>
              {item.title}
            </h3>
          </div>
          
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            background: priorityStyle.bg,
            color: priorityStyle.color,
            border: `1px solid ${priorityStyle.border}`,
            whiteSpace: 'nowrap'
          }}>
            {item.priority}
          </span>
        </div>
        
        <div style={{ marginBottom: theme.spacing.xs }}>
          <p style={{
            ...theme.typography.small,
            color: theme.colors.neutral[600],
            margin: '0',
            fontWeight: '500'
          }}>
            Dari: {item.from}
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            ...theme.typography.small,
            color: theme.colors.neutral[500],
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            📅 {item.date}
          </span>
          
          <div style={{
            padding: '2px 8px',
            borderRadius: '6px',
            background: theme.colors.primary[100],
            color: theme.colors.primary[700],
            fontSize: '11px',
            fontWeight: '600'
          }}>
            {item.type.toUpperCase()}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: theme.colors.neutral[50],
        flexDirection: 'column',
        gap: theme.spacing.md
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: `4px solid ${theme.colors.neutral[200]}`,
          borderTop: `4px solid ${theme.colors.primary[500]}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          ...theme.typography.body,
          color: theme.colors.neutral[600],
          fontWeight: '500'
        }}>
          Memuat dashboard...
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
          
          * { 
            box-sizing: border-box; 
          }
          
          body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          @media (max-width: 640px) {
            .mobile-stack > * {
              margin-bottom: 16px !important;
            }
          }
        `}
      </style>
      
      <div style={{
        background: theme.colors.neutral[50],
        minHeight: '100vh',
        padding: theme.spacing.md,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        
        {/* Modern Hero Section */}
        <div style={{
          background: theme.gradients.hero,
          borderRadius: isMobile ? '20px' : '24px',
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(80px)'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            filter: 'blur(60px)'
          }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              textAlign: isMobile ? 'center' : 'left',
              gap: theme.spacing.md
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  marginBottom: theme.spacing.sm,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <span style={{ fontSize: '20px' }}>👑</span>
                  <span style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    KETUA DPD RI
                  </span>
                </div>
                
                <h1 style={{
                  ...theme.typography.hero,
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  Selamat Datang Ketua DPD RI
                </h1>
                
                <p style={{
                  ...theme.typography.body,
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0',
                  fontWeight: '500'
                }}>
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div style={{
                width: isMobile ? '80px' : '120px',
                height: isMobile ? '80px' : '120px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '40px' : '60px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                🏛️
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 
            isMobile ? '1fr' : 
            isTablet ? 'repeat(2, 1fr)' : 
            'repeat(auto-fit, minmax(250px, 1fr))',
          gap: theme.spacing.md,
          marginBottom: theme.spacing.lg
        }}>
          <StatCard
            title="Total Surat"
            value={stats.totalSurat}
            icon="📄"
            gradient={theme.gradients.primary}
            link="/dashboardKetua/surat/semua"
            description="Semua dokumen"
          />
          <StatCard
            title="Pending Undangan"
            value={stats.pendingUndangan}
            icon="📅"
            gradient={theme.gradients.secondary}
            link="/dashboardKetua/approval/undangan"
            description="Butuh persetujuan"
          />
          <StatCard
            title="Pending Audiensi"
            value={stats.pendingAudiensi}
            icon="🤝"
            gradient={theme.gradients.accent}
            link="/dashboardKetua/approval/audiensi"
            description="Menunggu konfirmasi"
          />
          <StatCard
            title="Agenda Hari Ini"
            value={stats.agendaHariIni}
            icon="⏰"
            gradient={theme.gradients.purple}
            link="/dashboardKetua/agenda"
            description="Kegiatan terjadwal"
          />
        </div>

        {/* Enhanced Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.xl
        }} className="mobile-stack">
          
          {/* Pending Items Section */}
          <div style={{
            background: theme.colors.neutral[0],
            borderRadius: '20px',
            padding: theme.spacing.lg,
            boxShadow: theme.shadows.md,
            border: `1px solid ${theme.colors.neutral[200]}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <h2 style={{
                ...theme.typography.h2,
                color: theme.colors.neutral[900],
                margin: '0'
              }}>
                Butuh Persetujuan
              </h2>
              <div style={{
                padding: '4px 12px',
                background: theme.colors.accent[100],
                color: theme.colors.accent[700],
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {pendingItems.length} item
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm
            }}>
              {pendingItems.map((item) => (
                <PendingItem key={item.id} item={item} />
              ))}
            </div>
            
            <Link 
              to="/dashboardKetua/approval" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: theme.spacing.md,
                padding: '12px 20px',
                background: theme.gradients.primary,
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: theme.typography.small.fontSize,
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = theme.shadows.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Lihat Semua Approval
              <span>→</span>
            </Link>
          </div>

          {/* Recent Activities Section */}
          <div style={{
            background: theme.colors.neutral[0],
            borderRadius: '20px',
            padding: theme.spacing.lg,
            boxShadow: theme.shadows.md,
            border: `1px solid ${theme.colors.neutral[200]}`
          }}>
            <h2 style={{
              ...theme.typography.h2,
              color: theme.colors.neutral[900],
              margin: `0 0 ${theme.spacing.md} 0`
            }}>
              Aktivitas Terbaru
            </h2>
            
            <div>
              {recentActivities.map((activity, index) => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity}
                  isLast={index === recentActivities.length - 1}
                />
              ))}
            </div>
            
            <Link 
              to="/dashboardKetua/aktivitas" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: theme.spacing.md,
                color: theme.colors.primary[600],
                textDecoration: 'none',
                fontSize: theme.typography.small.fontSize,
                fontWeight: '600',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.primary[700];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.primary[600];
              }}
            >
              Lihat Riwayat Lengkap
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Modern Footer */}
        <footer style={{
          background: theme.colors.neutral[900],
          borderRadius: '20px',
          padding: theme.spacing.xl,
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 24px',
            background: theme.gradients.hero,
            borderRadius: '16px',
            marginBottom: theme.spacing.md
          }}>
            <span style={{ fontSize: '24px' }}>👑</span>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '800',
                margin: '0',
                color: 'white'
              }}>
                RI7 ADMIRE
              </h3>
              <p style={{
                fontSize: '12px',
                margin: '0',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                Project Aktualisasi
              </p>
            </div>
          </div>
          
          <h4 style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '700',
            color: theme.colors.neutral[100],
            margin: '0 0 8px 0'
          }}>
            ADMINISTRATIVE MAIL AND INFORMATION RECORD FOR EFFICIENCY
          </h4>
          
          <p style={{
            ...theme.typography.body,
            color: theme.colors.neutral[400],
            lineHeight: '1.6',
            margin: '0 0 24px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Inovasi digitalisasi persuratan untuk mewujudkan birokrasi yang efisien, 
            akuntabel, dan modern di Bagian Sekretariat Ketua DPD RI
          </p>
          
          <div style={{
            borderTop: `1px solid ${theme.colors.neutral[700]}`,
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md
          }}>
            <p style={{
              ...theme.typography.small,
              color: theme.colors.neutral[500],
              margin: '0'
            }}>
              © 2025 DPD RI - Sekretariat Ketua. Sistem ADMIRE untuk Digitalisasi Persuratan.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default KetuaDashboard;
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const KetuaDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const navigate = useNavigate();

  // ADMIRE Color System
  const colors = {
    primary: '#0ea5e9',
    secondary: '#06b6d4', 
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
    bg: {
      primary: '#f8fafc',
      secondary: '#ffffff',
      hover: 'rgba(14, 165, 233, 0.05)'
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      white: '#ffffff'
    },
    border: '#e2e8f0',
    shadow: 'rgba(14, 165, 233, 0.08)'
  };

  // Responsive breakpoints
  const breakpoints = {
    mobile: 640,
    tablet: 1024,
    desktop: 1280
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      if (width < breakpoints.tablet) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < breakpoints.mobile;
  const isTablet = windowWidth >= breakpoints.mobile && windowWidth < breakpoints.tablet;
  const isDesktop = windowWidth >= breakpoints.tablet;

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboardKetua',
      icon: '📊',
    },
    {
      name: 'Approval Undangan',
      path: '/dashboardKetua/approval/undangan',
      icon: '📅',
    },
    {
      name: 'Approval Audiensi',
      path: '/dashboardKetua/approval/audiensi',
      icon: '🤝',
    },
    {
      name: 'Proposal',
      path: '/dashboardKetua/proposal',
      icon: '📄',
    },
    {
      name: 'Agenda',
      path: '/dashboardKetua/agenda',
      icon: '📅',
    },
    {
      name: 'Notifikasi',
      path: '/dashboardKetua/notifikasi',
      icon: '🔔',
    },
    {
      name: 'Pengaturan',
      path: '/dashboardKetua/settings',
      icon: '⚙️',
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const isActiveMenu = (path) => {
    if (path === '/dashboardKetua') {
      return location.pathname === '/dashboardKetua';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getPageTitle = () => {
    if (location.pathname === '/dashboardKetua') return 'Dashboard Ketua';
    if (location.pathname.includes('approval/undangan')) return 'Approval Undangan';
    if (location.pathname.includes('approval/audiensi')) return 'Approval Audiensi';
    if (location.pathname.includes('proposal')) return 'Manajemen Proposal';
    if (location.pathname.includes('agenda')) return 'Agenda Ketua';
    if (location.pathname.includes('notifikasi')) return 'Notifikasi';
    if (location.pathname.includes('settings')) return 'Pengaturan';
    return 'Dashboard';
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: colors.bg.primary
    }}>
      
      {/* Overlay - Mobile/Tablet */}
      {!isDesktop && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            transition: 'opacity 0.3s ease',
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: isDesktop ? '280px' : '280px',
        background: colors.gradient,
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSidebarOpen ? '4px 0 24px rgba(14, 165, 233, 0.15)' : 'none',
      }}>
        
        {/* Sidebar Header - STICKY TOP */}
        <div style={{
          padding: isMobile ? '20px 16px' : '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: colors.gradient,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: '800', 
                margin: '0 0 4px 0',
                color: colors.text.white,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                letterSpacing: '-0.5px'
              }}>
                RI7 ADMIRE
              </h1>
              <p style={{ 
                fontSize: isMobile ? '11px' : '12px',
                margin: '0',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>
                KETUA DPD RI
              </p>
            </div>
            <button
              onClick={toggleSidebar}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: colors.text.white,
                padding: isMobile ? '8px' : '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '36px' : '40px',
                height: isMobile ? '36px' : '40px'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Menu - SCROLLABLE */}
        <nav style={{ 
          flex: 1,
          padding: isMobile ? '16px 0' : '24px 0',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {menuItems.map((item, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              <Link
                to={item.path}
                onClick={() => !isDesktop && setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isMobile ? '14px 16px' : '16px 20px',
                  color: isActiveMenu(item.path) ? colors.text.white : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  backgroundColor: isActiveMenu(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                  borderLeft: isActiveMenu(item.path) ? '4px solid rgba(255,255,255,0.9)' : '4px solid transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActiveMenu(item.path)) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = colors.text.white;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveMenu(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }
                }}
              >
                <div style={{ 
                  fontSize: isMobile ? '18px' : '20px',
                  marginRight: isMobile ? '12px' : '16px',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {item.icon}
                </div>
                <span style={{ 
                  fontSize: isMobile ? '14px' : '15px',
                  fontWeight: '600'
                }}>
                  {item.name}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        {/* User Info & Logout - STICKY BOTTOM */}
        <div style={{ 
          padding: isMobile ? '16px' : '24px 20px',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: isMobile ? '12px' : '16px' }}>
            <div style={{
              width: isMobile ? '40px' : '44px',
              height: isMobile ? '40px' : '44px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
              flexShrink: 0
            }}>
              <span style={{ fontSize: isMobile ? '18px' : '20px' }}>👑</span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ 
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: '700', 
                margin: '0 0 2px 0',
                color: colors.text.white,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Ketua DPD RI
              </p>
              <p style={{ 
                fontSize: isMobile ? '11px' : '12px',
                margin: '0',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '500'
              }}>
                Administrator
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '10px 14px' : '12px 16px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              color: colors.text.white,
              fontSize: isMobile ? '13px' : '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.35)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }}
          >
            <span style={{ marginRight: '8px' }}>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: isDesktop && isSidebarOpen ? '280px' : '0',
        width: isDesktop && isSidebarOpen ? 'calc(100% - 280px)' : '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: colors.bg.primary
      }}>
        
        {/* Top Header Bar */}
        <header style={{
          backgroundColor: colors.bg.secondary,
          padding: isMobile ? '16px' : isTablet ? '18px 24px' : '20px 32px',
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: `0 2px 8px ${colors.shadow}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: isMobile ? '12px' : '16px'
          }}>
            {/* Left Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', minWidth: 0, flex: 1 }}>
              {(!isDesktop || !isSidebarOpen) && (
                <button
                  onClick={toggleSidebar}
                  style={{
                    background: colors.gradient,
                    border: 'none',
                    color: colors.text.white,
                    padding: isMobile ? '10px' : '12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: isMobile ? '16px' : '18px',
                    transition: 'all 0.2s ease',
                    boxShadow: `0 4px 12px ${colors.shadow}`,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isMobile ? '40px' : '44px',
                    height: isMobile ? '40px' : '44px'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ☰
                </button>
              )}
              <h1 style={{ 
                fontSize: isMobile ? '16px' : isTablet ? '20px' : '24px',
                fontWeight: '700', 
                color: colors.text.primary,
                margin: '0',
                background: colors.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '-0.5px'
              }}>
                {getPageTitle()}
              </h1>
            </div>

            {/* Right Section - Date */}
            {!isMobile && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: isTablet ? '8px 12px' : '10px 16px',
                backgroundColor: colors.bg.primary,
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                flexShrink: 0
              }}>
                <span style={{ fontSize: isTablet ? '14px' : '16px' }}>🕐</span>
                <span style={{ 
                  fontSize: isTablet ? '12px' : '14px',
                  color: colors.text.secondary,
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}>
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: isTablet ? undefined : 'long',
                    year: 'numeric', 
                    month: isTablet ? 'short' : 'long',
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div style={{ 
          flex: 1,
          padding: isMobile ? '16px' : isTablet ? '24px' : '32px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}>
          {children}
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        aside::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default KetuaDashboardLayout;
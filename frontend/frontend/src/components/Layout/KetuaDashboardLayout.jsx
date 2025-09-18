import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const KetuaDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ADMIRE Color Palette
  const colors = {
    primary: {
      skyBlue: '#0ea5e9',
      teal: '#06b6d4', 
      emerald: '#10b981'
    },
    gradients: {
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

  // Check for mobile screen
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboardKetua',
      icon: '📊',
      color: colors.primary.skyBlue
    },
    {
      name: 'Approval Center',
      path: '/dashboardKetua/approval',
      icon: '✅',
      color: colors.primary.emerald,
      submenu: [
        { name: 'Undangan', path: '/dashboardKetua/approval/undangan', count: 3 },
        { name: 'Audiensi', path: '/dashboardKetua/approval/audiensi', count: 2 }
      ]
    },
    {
      name: 'Proposal',
      path: '/dashboardKetua/proposal',
      icon: '📄',
      color: colors.primary.teal,
      count: 7
    },
    {
      name: 'Agenda',
      path: '/dashboardKetua/agenda',
      icon: '📅',
      color: '#8b5cf6'
    },
    {
      name: 'Notifikasi',
      path: '/dashboardKetua/notifikasi',
      icon: '🔔',
      color: '#ef4444',
      count: 5
    },
    {
      name: 'Pengaturan',
      path: '/dashboardKetua/settings',
      icon: '⚙️',
      color: colors.neutral.textSecondary
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
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarWidth = isSidebarOpen ? (isMobile ? '280px' : '280px') : '0px';

  const sidebarStyles = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: sidebarWidth,
    background: colors.gradients.admire,
    color: 'white',
    transition: 'all 0.3s ease',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 1000,
    boxShadow: isSidebarOpen ? '4px 0 24px rgba(14, 165, 233, 0.15)' : 'none',
    transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)'
  };

  const mainContentStyles = {
    marginLeft: isMobile ? '0' : (isSidebarOpen ? '280px' : '0'),
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    backgroundColor: colors.neutral.formBg,
    position: 'relative'
  };

  // Mobile overlay
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    opacity: isMobile && isSidebarOpen ? 1 : 0,
    visibility: isMobile && isSidebarOpen ? 'visible' : 'hidden',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Mobile Overlay */}
      <div 
        style={overlayStyles}
        onClick={() => isMobile && setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div style={sidebarStyles}>
        {/* Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: '800', 
                margin: '0 0 4px 0',
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                RI7 ADMIRE
              </h1>
              <p style={{ 
                fontSize: '12px', 
                margin: '0',
                color: 'rgba(255,255,255,0.85)',
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
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
            >
              ❮
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '24px 0', paddingBottom: '120px' }}>
          {menuItems.map((item, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              <Link
                to={item.path}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  color: isActiveMenu(item.path) ? 'white' : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  backgroundColor: isActiveMenu(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                  borderRight: isActiveMenu(item.path) ? '4px solid rgba(255,255,255,0.9)' : 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActiveMenu(item.path)) {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveMenu(item.path)) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'rgba(255,255,255,0.8)';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{ 
                  fontSize: '20px', 
                  marginRight: '16px',
                  minWidth: '20px',
                  textAlign: 'center',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}>
                  {item.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                  <span style={{ 
                    fontSize: '15px', 
                    fontWeight: '600',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}>
                    {item.name}
                  </span>
                  {item.count && (
                    <span style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      minWidth: '20px',
                      textAlign: 'center',
                      fontWeight: '700',
                      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                    }}>
                      {item.count}
                    </span>
                  )}
                </div>
              </Link>
              
              {/* Submenu */}
              {item.submenu && isActiveMenu(item.path) && (
                <div style={{ 
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  marginTop: '4px',
                  borderRadius: '0 0 8px 8px'
                }}>
                  {item.submenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 20px 12px 56px',
                        color: location.pathname === subItem.path ? 'white' : 'rgba(255,255,255,0.75)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        backgroundColor: location.pathname === subItem.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                        transition: 'all 0.3s ease',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => {
                        if (location.pathname !== subItem.path) {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                          e.target.style.color = 'white';
                          e.target.style.paddingLeft = '60px';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (location.pathname !== subItem.path) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'rgba(255,255,255,0.75)';
                          e.target.style.paddingLeft = '56px';
                        }
                      }}
                    >
                      <span>{subItem.name}</span>
                      {subItem.count && (
                        <span style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.9)',
                          color: 'white',
                          fontSize: '10px',
                          padding: '3px 6px',
                          borderRadius: '10px',
                          minWidth: '18px',
                          textAlign: 'center',
                          fontWeight: '700',
                          boxShadow: '0 1px 3px rgba(245, 158, 11, 0.4)'
                        }}>
                          {subItem.count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0,
          right: 0,
          padding: '24px 20px', 
          borderTop: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <span style={{ fontSize: '20px' }}>👑</span>
            </div>
            <div>
              <p style={{ 
                fontSize: '15px', 
                fontWeight: '700', 
                margin: '0 0 2px 0',
                color: 'white',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                Ketua DPD RI
              </p>
              <p style={{ 
                fontSize: '12px', 
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
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.35)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.6)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ marginRight: '8px' }}>🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyles}>
        {/* Mobile Header */}
        {isMobile && (
          <div style={{
            backgroundColor: colors.neutral.white,
            padding: '16px 20px',
            borderBottom: `1px solid ${colors.neutral.lightGray}`,
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={toggleSidebar}
              style={{
                background: colors.gradients.admire,
                border: 'none',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              ☰
            </button>
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: colors.neutral.textDark,
              margin: '0',
              background: colors.gradients.admire,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              RI7 ADMIRE
            </h1>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div style={{
            backgroundColor: colors.neutral.white,
            padding: '20px 32px',
            borderBottom: `1px solid ${colors.neutral.lightGray}`,
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {!isSidebarOpen && (
                  <button
                    onClick={toggleSidebar}
                    style={{
                      background: colors.gradients.admire,
                      border: 'none',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ☰
                  </button>
                )}
                <h1 style={{ 
                  fontSize: '26px', 
                  fontWeight: '700', 
                  color: colors.neutral.textDark,
                  margin: '0',
                  background: colors.gradients.admire,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {location.pathname === '/dashboardKetua' ? 'Dashboard Ketua' : 
                   location.pathname.includes('approval/undangan') ? 'Approval Undangan' :
                   location.pathname.includes('approval/audiensi') ? 'Approval Audiensi' :
                   location.pathname.includes('proposal') ? 'Manajemen Proposal' :
                   location.pathname.includes('agenda') ? 'Agenda Ketua' :
                   location.pathname.includes('notifikasi') ? 'Notifikasi' :
                   location.pathname.includes('settings') ? 'Pengaturan' : 'Dashboard'
                  }
                </h1>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 16px',
                backgroundColor: colors.neutral.formBg,
                borderRadius: '8px',
                border: `1px solid ${colors.neutral.lightGray}`
              }}>
                <span style={{ fontSize: '16px' }}>🕐</span>
                <span style={{ 
                  fontSize: '14px', 
                  color: colors.neutral.textSecondary,
                  fontWeight: '500'
                }}>
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div style={{ padding: isMobile ? '20px' : '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default KetuaDashboardLayout;
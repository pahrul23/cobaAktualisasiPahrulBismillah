// Path: /frontend/src/components/Layout/ExecutiveLayout.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const ExecutiveLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Page titles untuk executive routes - SEDERHANA
  const getPageTitle = () => {
    const routeTitles = {
      '/executive': 'Executive Dashboard',
      '/executive/approvals': 'Approval Center',
      '/executive/letters': 'Manajemen Surat',
      '/executive/notifications': 'Notifikasi',
      '/executive/settings': 'Pengaturan'
    }
    return routeTitles[location.pathname] || 'Executive Portal'
  }

  // Menu items untuk Ketua - HANYA 5 MENU
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/executive' },
    { icon: '✅', label: 'Approval', path: '/executive/approvals' },
    { icon: '📄', label: 'Surat', path: '/executive/letters' },
    { icon: '🔔', label: 'Notifikasi', path: '/executive/notifications' },
    { icon: '⚙️', label: 'Setting', path: '/executive/settings' }
  ]

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/executive/letters' && location.pathname.startsWith('/executive/letters'))
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif",
      background: '#f8fafc'
    }}>
      
      {/* Executive Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '80px' : '260px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        transition: 'all 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 1000,
        boxShadow: '4px 0 20px rgba(30, 41, 59, 0.15)',
        overflowY: 'auto'
      }}>
        
        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? '20px 16px' : '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            👑
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ 
                color: 'white', 
                fontSize: '20px', 
                fontWeight: '700'
              }}>
                ADMIRE
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '13px'
              }}>
                EXECUTIVE PORTAL
              </div>
            </div>
          )}
        </div>

        {/* Navigation - HANYA 5 MENU */}
        <div style={{ padding: '24px 0' }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                margin: sidebarCollapsed ? '8px 16px' : '8px 20px',
                padding: sidebarCollapsed ? '14px' : '14px 18px',
                borderRadius: '14px',
                background: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s ease',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) e.target.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) e.target.style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!sidebarCollapsed && (
                <span style={{ 
                  color: 'white', 
                  fontSize: '15px', 
                  fontWeight: '600'
                }}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-12px',
            width: '24px',
            height: '24px',
            background: 'white',
            border: '2px solid #1e293b',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transform: 'translateY(-50%)'
          }}
        >
          {sidebarCollapsed ? '▶' : '◀'}
        </button>

        {/* User Profile */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: sidebarCollapsed ? '16px' : '20px',
          right: sidebarCollapsed ? '16px' : '20px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '14px',
            padding: sidebarCollapsed ? '14px' : '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(10px)',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              👑
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: 'white', 
                  fontSize: '14px', 
                  fontWeight: '600'
                }}>
                  {user?.name || 'Ketua DPD RI'}
                </div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: '12px'
                }}>
                  Ketua DPD RI
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        marginLeft: sidebarCollapsed ? '80px' : '260px',
        transition: 'margin-left 0.3s ease'
      }}>
        
        {/* Top Header */}
        <div style={{
          background: 'white',
          padding: '24px 32px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a202c'
            }}>
              {getPageTitle()}
            </h1>
            <p style={{
              margin: '4px 0 0 0',
              color: '#64748b',
              fontSize: '15px'
            }}>
              Selamat datang kembali, {user?.name || 'Ketua DPD RI'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              position: 'relative',
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '10px 16px',
              border: '1px solid #e2e8f0'
            }}>
              <input
                placeholder="Search..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  width: '200px'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}>
                🔍
              </span>
            </div>

            <div style={{
              background: '#f59e0b',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              EXECUTIVE
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: '10px 18px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#dc2626'}
              onMouseLeave={(e) => e.target.style.background = '#ef4444'}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          padding: '20px 24px',
          overflowY: 'auto',
          background: '#f8fafc'
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default ExecutiveLayout